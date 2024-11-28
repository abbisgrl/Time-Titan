import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user';
import express from 'express';

export interface UserRequest extends express.Request {
  user?: {
    email: string;
    isAdmin: boolean;
    userId: string;
    isOwner: boolean;
  };
}

export const protectRoute = async (req: UserRequest, res: express.Response, next: express.NextFunction) => {
  try {
    let token: string | undefined;

    if (typeof req.headers.authorization === 'string') {
      token = req.headers.authorization; // Extract the token
    } else if (Array.isArray(req.headers.authorization)) {
      token = req.headers.authorization[0]; // Use the first token if it's an array
    } else {
      throw new Error('Invalid token format in headers');
    }

    if (token) {
      const JWT_SECRET: string = process.env.JWT_SECRET || '';
      const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
      const resp = await User.findOne({ userId: decodedToken.userId }, { isOwner: 1, isAdmin: 1, email: 1 });

      // Check if the user was found
      if (!resp) {
        return res.status(404).json({ message: 'User not found' });
      }

      req.user = {
        email: resp.email,
        isAdmin: resp.isAdmin,
        userId: decodedToken.userId,
        isOwner: resp.isOwner,
      };

      next();
    } else {
      return res.status(401).json({ status: false, message: 'Not authorized. Try login again.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({ status: false, message: 'Not authorized. Try login again.' });
  }
};

export const isAdminOrOwnerRoute = (req: UserRequest, res: express.Response, next: express.NextFunction) => {
  if (req.user && (req.user.isAdmin || req.user.isOwner)) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: 'Not authorized as admin. Try login as admin.',
    });
  }
};

export const isOwnerOnly = (req: UserRequest, res: express.Response, next: express.NextFunction) => {
  if (req.user && req.user.isOwner) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: 'Not authorized as admin. Try login as admin.',
    });
  }
};
