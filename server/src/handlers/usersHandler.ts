import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/user';
import { validateRequiredFields } from '../helpers/validators';

export const getTeamList = async (req: express.Request, res: express.Response) => {
  console.log({ req });
  try {
    const users = await User.find({}, { tasks: 0, isAdmin: 0, _id: 0, isOwner: 0 });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const addTeamMember = async (req: express.Request, res: express.Response) => {
  const { name, email, password, role, projectIds } = req.body || {};
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
      $match: { email }, // First filter by email
    },
  ]);

  try {
    if (usersDetails) {
      // If the user already added
      return res.status(400).send({ message: 'User already added' });
    } else {
      // If the user doesn't exist, create a new user
      const newUser = {
        name,
        email,
        password,
        role,
        projects: [...projectIds],
        userId: uuidv4(),
        isActive: true,
      };
      await User.create(newUser);
      return res.status(401).send({ message: 'New user created successfully' });
    }
  } catch (error) {
    console.error('Error processing user:', error);
    return res.status(500).send({ message: 'An error occurred while processing the user' });
  }
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
  const { userId } = req.params || {};
  const usersDetails = await User.aggregate([
    {
      $match: { userId }, // First filter by email
    },
  ]);
  console.dir({ usersDetails }, { depth: null });
  if (!usersDetails) {
    return res.status(401).send({ message: 'User does not exists' });
  } else {
    await User.deleteOne({ userId });
    return res.status(200).send({ message: 'User deleted successfully' });
  }
};

export const updateUser = async (req: express.Request, res: express.Response) => {
  const { data } = req.body || {};
  const { userId } = req.params || {};

  const usersDetails = await User.aggregate([
    {
      $match: { userId },
    },
  ]);
  if (!usersDetails) {
    return res.status(401).send({ message: 'User does not exists' });
  } else {
    await User.updateOne({ userId }, { $set: data });
    return res.status(200).send({ message: 'User Updated successfully' });
  }
};
