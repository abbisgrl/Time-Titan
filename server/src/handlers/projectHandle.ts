import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Project from '../models/project';
import { validateRequiredFields } from '../helpers/validators';
import { UserRequest } from '../middlewares/authMiddlewave';
import User from '../models/user';

export const getProjectsList = async (req: UserRequest, res: express.Response) => {
  const { userId } = req.user || {};
  console.dir({ userId }, { depth: null });
  try {
    const projectsList = await Project.aggregate([
      {
        $match: {
          $or: [{ 'owner.userId': userId }, { members: userId }],
        },
      },
      { $project: { name: 1, description: 1, logo: 1, projectId: 1 } },
    ]);

    res.status(200).json(projectsList);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: (error as Error).message });
  }
};

export const addProject = async (req: express.Request, res: express.Response) => {
  const { name, description, owner, logo } = req.body || {};
  const validationError = validateRequiredFields([{ name: 'name', value: name, message: 'Name is required.' }], res);

  if (validationError) return;

  const projectDetails = await Project.aggregate([
    {
      $match: { name },
    },
  ]);

  try {
    if (projectDetails.length) {
      // If the project already has same name
      return res.status(400).send({ message: 'Project with same name is already created' });
    } else {
      // If the user doesn't exist, create a new user
      const newProject = {
        name,
        owner,
        projectId: uuidv4(),
        members: [] as string[],
        isActive: true,
        logo,
        description,
      };
      const data = await Project.create(newProject);
      if (data) {
        await User.updateOne({ userId: owner.userId }, { $push: { projects: newProject.projectId } });
      }
      return res.status(200).send({ message: 'New project created successfully', data });
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
