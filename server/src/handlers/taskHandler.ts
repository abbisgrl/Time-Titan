import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validateRequiredFields } from '../helpers/validators';
import Task from '../models/task';
import SubTask from '../models/subTask';
import Comment from '../models/comments';

type Status = 'todo' | 'in-progress' | 'qa-testing' | 'pm-testing' | 'completed';

export const getTaskList = async (req: express.Request, res: express.Response) => {
  const { projectId } = req.params;
  const { status } = req.query;

  const validationError = validateRequiredFields([{ name: 'projectId', value: projectId, message: 'Project details is missing' }], res);
  if (validationError) return;

  const condition: any = { projectId };

  if (status && ['todo', 'in-progress', 'qa-testing', 'pm-testing', 'completed'].includes(status as Status)) {
    condition.stage = status;
  }

  try {
    const taskData = await Task.aggregate([
      { $match: condition },
      {
        $lookup: {
          from: 'users',
          let: { teamMember: { $arrayElemAt: ['$team', 0] } },
          pipeline: [{ $match: { $expr: { $eq: ['$userId', '$$teamMember'] } } }, { $project: { name: 1, email: 1, userId: 1 } }],
          as: 'teamDetails',
        },
      },
      {
        $lookup: {
          from: 'subtasks',
          localField: 'subTasks',
          foreignField: 'subTaskId',
          as: 'subTasks',
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'comments',
          foreignField: 'commentId',
          as: 'comments',
        },
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          team: 0,
        },
      },
    ]);
    res.status(200).send({ message: 'Task successfully displayed', taskData });
  } catch (error) {
    console.log(error);
  }
};

export const createTasks = async (req: express.Request, res: express.Response) => {
  const { title, description, dueDate, priority, stage, assets, projectId, team } = req.body || {};
  const validationError = validateRequiredFields(
    [
      { name: 'title', value: title, message: 'Title is required.' },
      { name: 'date', value: dueDate, message: 'Date is required.' },
      { name: 'projectId', value: dueDate, message: 'Project details is missing' },
    ],
    res,
  );

  if (validationError) return;

  try {
    const taskObject = {
      title,
      description,
      priority: priority || 'normal',
      stage: stage || 'todo',
      assets,
      projectId,
      dueDate,
      team: [team.value],
      taskId: uuidv4(),
    };

    const response = await Task.create(taskObject);
    console.dir({ response }, { depth: null });
    return res.status(200).send({ message: 'New task created successfully', response });
  } catch (error) {
    console.log(error);
  }
};

export const createSubTask = async (req: express.Request, res: express.Response) => {
  const { title, description, dueDate, taskId, tag } = req.body || {};
  const validationError = validateRequiredFields(
    [
      { name: 'title', value: title, message: 'Title is required.' },
      { name: 'date', value: dueDate, message: 'Date is required.' },
      { name: 'taskId', value: taskId, message: 'Task details is missing' },
    ],
    res,
  );

  if (validationError) return;
  const subTaskId = uuidv4();
  try {
    const subTaskObject = {
      title,
      description,
      taskId,
      dueDate,
      subTaskId,
      tag,
    };

    const response = await SubTask.create(subTaskObject);
    await Task.updateOne({ taskId }, { $push: { subTasks: subTaskId } });
    return res.status(200).send({ message: 'New sub task created successfully', response });
  } catch (error) {
    console.log(error);
  }
};

export const viewTask = async (req: express.Request, res: express.Response) => {
  const { taskId } = req.params || {};

  const taskDetails = await Task.aggregate([
    {
      $match: { taskId },
    },
  ]);

  if (!taskDetails) {
    return res.status(401).send({ message: 'Task does not exists' });
  } else {
    return res.status(200).send({ message: 'Task details successfully displayed', taskDetails: taskDetails[0] });
  }
};

export const deleteTasks = async (req: express.Request, res: express.Response) => {
  const { taskId } = req.params || {};
  const taskDetails = await Task.aggregate([
    {
      $match: { taskId },
    },
  ]);
  try {
    if (!taskDetails) {
      return res.status(401).send({ message: 'Task does not exists' });
    } else {
      const commentsArray = taskDetails[0].comments;
      const subTasksArray = taskDetails[0].subTasks;
      await Task.deleteOne({ taskId });
      if (commentsArray?.length) {
        await Comment.deleteMany({ commentId: { $in: commentsArray } });
      }
      if (subTasksArray?.length) {
        await SubTask.deleteMany({ subTaskId: { $in: subTasksArray } });
      }
      return res.status(200).send({ message: 'Task deleted successfully' });
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateTasks = async (req: express.Request, res: express.Response) => {
  const { title, description, dueDate, priority, stage, assets, team, taskId } = req.body || {};
  const validationError = validateRequiredFields(
    [
      { name: 'title', value: title, message: 'Title is required.' },
      { name: 'date', value: dueDate, message: 'Date is required.' },
      { name: 'projectId', value: dueDate, message: 'Project details is missing' },
      { name: 'taskId', value: taskId, message: 'Task details is missing' },
    ],
    res,
  );

  if (validationError) return;
  try {
    const taskObject = {
      title,
      description,
      priority: priority || 'normal',
      stage: stage || 'todo',
      assets,
      dueDate,
      team: [team.value],
    };
    const response = await Task.updateOne({ taskId }, { $set: taskObject });
    return res.status(200).send({ message: 'Task updated successfully', response });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req: express.Request, res: express.Response) => {
  const { userId, taskId, comment } = req.body || {};
  const validationError = validateRequiredFields(
    [
      { name: 'content', value: comment, message: 'comment is required.' },
      { name: 'userId', value: userId, message: 'User is required.' },
      { name: 'taskId', value: taskId, message: 'Task details is missing' },
    ],
    res,
  );

  if (validationError) return;
  const commentId = uuidv4();
  try {
    const commentObject = {
      userId,
      taskId,
      comment,
      commentId,
    };

    const response = await Comment.create(commentObject);
    await Task.updateOne({ taskId }, { $push: { comments: commentId } });
    return res.status(200).send({ message: 'Comment added successfully', response });
  } catch (error) {
    console.log(error);
  }
};
