import createError from 'http-errors';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config({ path: path.join(__dirname, '../.env') });
import { handleError } from './helpers/error';
import httpLogger from './middlewares/httpLogger';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/usersRoutes';
import taskRoutes from './routes/tasksRoutes';
import projectRoutes from './routes/projectRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import './db/index';

const app: express.Application = express();

app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());

app.use('/auth', authRoutes);
app.use('/team', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/project', projectRoutes);
app.use('/dashboard', dashboardRoutes);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
const errorHandler: express.ErrorRequestHandler = (err, _req, res) => {
  handleError(err, res);
};
app.use(errorHandler);

const port = process.env.PORT || '8000';
app.set('port', port);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
