import express from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/user';
import { validateRequiredFields } from '../helpers/validators';
import { UserRequest } from '../middlewares/authMiddlewave';
import Project from '../models/project';
import sendEmail from '../utils/SendEmail/sendEmail';

export const getTeamList = async (req: UserRequest, res: express.Response) => {
  const { userId, ownerId, isAdmin } = req.user || {};
  const { searchQuery } = req.query;
  const conditions: any = { ownerId: isAdmin ? ownerId : userId, isOwner: false };

  if (searchQuery) {
    const searchRegex = new RegExp(searchQuery as string, 'i');
    conditions.$or = [{ name: { $regex: searchRegex } }, { email: { $regex: searchRegex } }, { role: { $regex: searchRegex } }];
  }

  try {
    const users = await User.find(conditions, { tasks: 0, isAdmin: 0, _id: 0, isOwner: 0, password: 0 });
    res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ status: false, message: (error as Error).message });
  }
};

export const addTeamMember = async (req: express.Request, res: express.Response) => {
  const { name, email, password, role, projects, ownerId } = req.body || {};
  const validationError = validateRequiredFields(
    [
      { name: 'email', value: email, message: 'Email is required.' },
      { name: 'name', value: name, message: 'Name is required.' },
      { name: 'password', value: password, message: 'Password is required.' },
      { name: 'role', value: role, message: 'Role is required.' },
    ],
    res,
  );

  if (validationError) return;

  const usersDetails = await User.aggregate([
    {
      $match: { email },
    },
  ]);

  try {
    if (usersDetails?.length) {
      // If the user already added
      return res.status(400).send({ message: 'User already added' });
    } else {
      // If the user doesn't exist, create a new user
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const REACT_URL = process.env.REACT_URL;
      const newUser = {
        name,
        email,
        password: hashedPassword,
        role,
        projects: [...projects],
        userId: uuidv4(),
        isActive: true,
        memberPassword: password,
        ownerId,
        status: 'pending',
        isAdmin: role === 'A',
      };
      await User.create(newUser);

      const updatePromises = projects.map((projectId: string) => Project.updateOne({ projectId }, { $push: { members: newUser.userId } }));
      Promise.all(updatePromises)
        .then((results) => {
          console.log(
            'All Projects updated:',
            results.map((res) => ({
              matchedCount: res.matchedCount,
              modifiedCount: res.modifiedCount,
              acknowledged: res.acknowledged,
            })),
          );
        })
        .catch((err) => {
          console.error('Error during updates:', err);
        });

      await sendEmail(email, 'inviteTeam', { inviteLink: `${REACT_URL}/create/password?email=${email}` });
      return res.status(200).send({ message: 'New user created successfully' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'An error occurred while processing the user', error });
  }
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
  const { userId } = req.params || {};
  const usersDetails = await User.aggregate([
    {
      $match: { userId },
    },
  ]);
  if (!usersDetails) {
    return res.status(401).send({ message: 'User does not exists' });
  } else {
    await User.deleteOne({ userId });
    return res.status(200).send({ message: 'User deleted successfully' });
  }
};

export const updateUser = async (req: express.Request, res: express.Response) => {
  const { name, email, role, projects: newProjects, ownerId } = req.body || {};
  const { userId } = req.params || {};

  const usersDetails: any = await User.aggregate([
    {
      $match: { userId },
    },
  ]);
  const data = { name, email, role, projects: newProjects, isAdmin: role === 'A' };
  const currentProjects = usersDetails[0].projects || [];

  // Find projects to add the user to
  const projectsToAdd = newProjects.filter((projectId: string) => !currentProjects.includes(projectId));

  // Find projects to remove the user from
  const projectsToRemove = currentProjects.filter((projectId: string) => !newProjects.includes(projectId));

  // Update the Project collection
  await Promise.all([
    // Add the user to the members array of new projects
    Project.updateMany({ projectId: { $in: projectsToAdd } }, { $addToSet: { members: userId } }),

    // Remove the user from the members array of removed projects
    Project.updateMany({ projectId: { $in: projectsToRemove } }, { $pull: { members: userId } }),
  ]);

  console.dir({ usersDetails, data }, { depth: null });
  if (!usersDetails) {
    return res.status(401).send({ message: 'User does not exists' });
  } else {
    await User.updateOne({ userId }, { $set: data });
    return res.status(200).send({ message: 'User Updated successfully' });
  }
};

export const viewUser = async (req: express.Request, res: express.Response) => {
  const { userId } = req.params || {};

  const usersDetails = await User.aggregate([
    {
      $match: { userId },
    },
  ]);

  if (!usersDetails) {
    return res.status(401).send({ message: 'User does not exists' });
  } else {
    return res.status(200).send({ message: 'User Updated successfully', usersDetails });
  }
};

export const getProjectsTeamList = async (req: express.Request, res: express.Response) => {
  const { projectId } = req.params || {};
  try {
    const users = await User.find({ projects: { $in: projectId }, isOwner: false }, { name: 1, userId: 1 });
    res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ status: false, message: (error as Error).message });
  }
};
