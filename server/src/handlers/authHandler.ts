import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/user';
import { handleError } from '../helpers/error';
import { validateRequiredFields } from '../helpers/validators';
import { UserRequest } from '../middlewares/authMiddlewave';

export const loginHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { email, password } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET as string;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(handleError({ name: 'user not found', statusCode: 401, message: 'User not found' }, res));
    }

    const validPassword = await bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return next(handleError({ name: 'user not found', statusCode: 401, message: 'Wrong password' }, res));
    }

    // create jwt token
    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, {
      expiresIn: '9999 years',
    });

    res.status(200).json({ token, user });
  } catch (err) {
    throw new Error('Error signing');
    next(err);
  }
};

// only for owner registration
export const registerHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { name, email, password, role } = req.body;

  const validationError = validateRequiredFields(
    [
      { name: 'email', value: email, message: 'Email is required.' },
      { name: 'name', value: name, message: 'Name is required.' },
      { name: 'password', value: password, message: 'Password is required.' },
    ],
    res,
  );

  if (validationError) return;

  try {
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(400).send({
        message: 'Email is already in use.',
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new User({
      name,
      email,
      isAdmin: false,
      role,
      password: hashedPassword,
      userId: uuidv4(),
      isOwner: true,
    });

    const JWT_SECRET = process.env.JWT_SECRET as string;

    newUser
      .save()
      .then((user) => {
        const token = jwt.sign({ userId: user.userId }, JWT_SECRET, {
          expiresIn: '9999 years',
        });
        res.status(200).json({ token, user });
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
};

export const userDetails = async (req: UserRequest, res: express.Response) => {
  const { userId } = req?.user || {};
  const userDetailsData = await User.findOne({ userId }, { name: 1, email: 1, userId: 1 });
  if (!userDetailsData) {
    res.status(401).json({ message: 'User Not Found' });
  } else {
    res.status(200).json(userDetailsData);
  }
};
