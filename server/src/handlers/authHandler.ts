import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; // random
import User from '../models/user';
import { handleError } from '../helpers/error';

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
      return next(handleError({ name: 'user not found', statusCode: 201, message: 'Wrong password' }, res));
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

export const registerHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { name, email, password, isAdmin, role } = req.body;
  console.dir({ body: req.body }, 'body');
  if (!email) {
    return res.status(400).send({ message: 'Missing email.', field: 'email' });
  }
  if (!name) {
    return res.status(400).send({ message: 'Missing name', field: 'name' });
  }
  if (!password) {
    return res.status(400).send({ message: 'Missing password', field: 'password' });
  }

  try {
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(400).send({
        message: 'Email is already in use.',
      });
    }
    // Step 1 - Create and save the userconst salt = bcrypt.genSaltSync(10);
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new User({
      name,
      email,
      isAdmin,
      role,
      password: hashedPassword,
      userId: uuidv4(),
    });

    const JWT_SECRET = process.env.JWT_SECRET as string;

    newUser
      .save()
      .then((user) => {
        // create jwt token
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
