import express from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/user';
import { validateRequiredFields } from '../helpers/validators';
import { UserRequest } from '../middlewares/authMiddlewave';

export const getTeamList = async (req: UserRequest, res: express.Response) => {
  const { userId } = req.user || {};

  try {
    const users = await User.find({ ownerId: userId, isOwner: false }, { tasks: 0, isAdmin: 0, _id: 0, isOwner: 0 });
    res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
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

      console.dir({ projects }, { depth: null });
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
      };
      await User.create(newUser);
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
      $match: { userId }, // First filter by email
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
  const { name, email, password, role, projects, ownerId } = req.body || {};
  const { userId } = req.params || {};

  const usersDetails = await User.aggregate([
    {
      $match: { userId },
    },
  ]);
  const data = { name, email, password, role, projects, ownerId };
  if (!usersDetails) {
    return res.status(401).send({ message: 'User does not exists' });
  } else {
    console.dir({ body: req.body, data }, { depth: null });
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
    return res.status(400).json({ status: false, message: error.message });
  }
};
