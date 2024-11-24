import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Project from '../models/project';
import { validateRequiredFields } from 'src/helpers/validators';

export const getProjectsList = async (req: express.Request, res: express.Response) => {
  console.log({ req });
  try {
    const projects = await Project.find({}, { tasks: 0, isAdmin: 0, _id: 0, isOwner: 0 });
    res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const addProject = async (req: express.Request, res: express.Response) => {
  const { name, owner } = req.body || {};
  const validationError = validateRequiredFields([{ name: 'name', value: name, message: 'Name is required.' }], res);

  if (validationError) return;

  const projectDetails = await Project.aggregate([
    {
      $match: { name },
    },
  ]);

  try {
    if (projectDetails) {
      // If the project already has same name
      return res.status(400).send({ message: 'Project with same name is already created' });
    } else {
      // If the user doesn't exist, create a new user
      const newProject = {
        name,
        owner,
        projectId: uuidv4(),
        members: [],
        isActive: true,
      };
      await Project.create(newProject);
      return res.status(401).send({ message: 'New project created successfully' });
    }
  } catch (error) {
    console.error('Error processing user:', error);
    return res.status(500).send({ message: 'An error occurred while processing the user' });
  }
};

export const deleteProject = async (req: express.Request, res: express.Response) => {
  const { projectId } = req.params || {};
  const projectDetails = await Project.aggregate([
    {
      $match: { projectId }, // First filter by email
    },
  ]);
  console.dir({ projectDetails }, { depth: null });
  if (!projectDetails) {
    return res.status(401).send({ message: 'Project does not exists' });
  } else {
    await Project.deleteOne({ projectId });
    return res.status(200).send({ message: 'Project deleted successfully' });
  }
};

export const updateProject = async (req: express.Request, res: express.Response) => {
  const { data } = req.body || {};
  const { projectId } = req.params || {};

  const projectDetails = await Project.aggregate([
    {
      $match: { projectId },
    },
  ]);
  if (!projectDetails) {
    return res.status(401).send({ message: 'Project does not exists' });
  } else {
    await Project.updateOne({ projectId }, { $set: data });
    return res.status(200).send({ message: 'Project Updated successfully' });
  }
};
