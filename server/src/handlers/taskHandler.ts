import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validateRequiredFields } from '../helpers/validators';
import Task from '../models/task';
import SubTask from '../models/subTask';
import Comment from '../models/comments';

type Status = 'todo' | 'in-progress' | 'qa-testing' | 'pm-testing' | 'completed';

export const getTaskList = async (req: express.Request, res: express.Response) => {
  const { projectId } = req.params;
  const { status, isTrashed, searchQuery } = req.query;

  const validationError = validateRequiredFields([{ name: 'projectId', value: projectId, message: 'Project details is missing' }], res);
  if (validationError) return;

  const condition: any = { projectId, isTrashed: isTrashed === 'true' };

  if (status && ['todo', 'in-progress', 'qa-testing', 'pm-testing', 'completed'].includes(status as Status)) {
    condition.stage = status;
  }
  if (searchQuery) {
    const searchRegex = new RegExp(searchQuery as string, 'i');
    condition.$or = [{ title: { $regex: searchRegex } }, { description: { $regex: searchRegex } }];
  }
  console.dir({ condition }, { depth: null });
  console.dir({ condition }, { depth: null });

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
      isTrashed: false,
    };

    const response = await Task.create(taskObject);
    console.dir({ response }, { depth: null });
    return res.status(200).send({ message: 'New task created successfully', response });
  } catch (error) {
    console.log(error);
  }
};

export const viewTask = async (req: express.Request, res: express.Response) => {
  const { taskId } = req.params || {};

  const taskDetails = await Task.aggregate([
    {
      $match: { taskId }, // Match the specific task by ID
    },
    {
      $lookup: {
        from: 'subtasks',
        localField: 'subTasks',
        foreignField: 'subTaskId',
        as: 'subTasks', // Retrieve subtasks
      },
    },
    {
      $lookup: {
        from: 'comments',
        localField: 'comments',
        foreignField: 'commentId',
        as: 'comments', // Retrieve comments
      },
    },
    {
      $unwind: {
        path: '$comments',
        preserveNullAndEmptyArrays: true, // Unwind comments but keep null arrays
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'comments.userId',
        foreignField: 'userId',
        as: 'userDetails', // Get user details for each comment
      },
    },
    {
      $addFields: {
        'comments.userName': {
          $cond: {
            if: { $gt: [{ $size: '$userDetails' }, 0] },
            then: { $arrayElemAt: ['$userDetails.name', 0] }, // Extract user name
            else: null,
          },
        },
      },
    },
    {
      $project: {
        'comments.userDetails': 0, // Remove the userDetails field from comments
      },
    },
    {
      $group: {
        _id: '$_id', // Group by task ID
        task: { $first: '$$ROOT' },
        comments: { $push: '$comments' }, // Recreate the comments array
      },
    },
    {
      $addFields: {
        'task.comments': {
          $filter: {
            input: '$comments',
            as: 'comment',
            cond: { $ne: ['$$comment.userName', null] }, // Remove invalid comments
          },
        },
      },
    },
    {
      $replaceRoot: { newRoot: '$task' }, // Replace root with the task object
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

export const moveToTrash = async (req: express.Request, res: express.Response) => {
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
      await Task.updateOne({ taskId }, { isTrashed: true });
      return res.status(200).send({ message: 'Task Moved to trashed successfully' });
    }
  } catch (error) {
    console.log(error);
  }
};

export const restoreTask = async (req: express.Request, res: express.Response) => {
  const { taskId } = req.params || {};
  try {
    const taskObject = {
      isTrashed: false,
    };
    const response = await Task.updateOne({ taskId }, { $set: taskObject });
    return res.status(200).send({ message: 'Task moved successfully', response });
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
  const isTeamVariableIsArray = Array.isArray(team);
  console.dir({ isTeamVariableIsArray, team }, { depth: null });
  try {
    const taskObject = {
      title,
      description,
      priority: priority || 'normal',
      stage: stage || 'todo',
      assets,
      dueDate,
      team: isTeamVariableIsArray ? team : [team.value],
    };
    const response = await Task.updateOne({ taskId }, { $set: taskObject });
    return res.status(200).send({ message: 'Task updated successfully', response });
  } catch (error) {
    console.log(error);
  }
};

export const createSubTask = async (req: express.Request, res: express.Response) => {
  const { title, description, dueDate, taskId, tag, status } = req.body || {};
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
      status: status || 'todo',
    };

    const response = await SubTask.create(subTaskObject);
    await Task.updateOne({ taskId }, { $push: { subTasks: subTaskId } });
    return res.status(200).send({ message: 'New sub task created successfully', response });
  } catch (error) {
    console.log(error);
  }
};

export const updateSubTask = async (req: express.Request, res: express.Response) => {
  const { title, description, dueDate, taskId, tag, status, subTaskId } = req.body || {};
  const validationError = validateRequiredFields(
    [
      { name: 'title', value: title, message: 'Title is required.' },
      { name: 'date', value: dueDate, message: 'Date is required.' },
      { name: 'taskId', value: taskId, message: 'Task details is missing' },
    ],
    res,
  );

  if (validationError) return;
  try {
    const subTaskObject = {
      title,
      description,
      taskId,
      dueDate,
      tag,
      status,
    };

    const response = await SubTask.updateOne({ subTaskId }, subTaskObject);
    return res.status(200).send({ message: 'New sub task updated successfully', response });
  } catch (error) {
    console.log(error);
  }
};

export const deleteSubTask = async (req: express.Request, res: express.Response) => {
  const { subTaskId } = req.params || {};
  const subTaskDetails = await SubTask.aggregate([
    {
      $match: { subTaskId },
    },
  ]);
  try {
    if (!subTaskDetails) {
      return res.status(401).send({ message: 'Sub task does not exists' });
    } else {
      const taskId = subTaskDetails[0].taskId;
      await SubTask.deleteOne({ subTaskId });
      await Task.updateOne({ taskId }, { $pull: { subTasks: { id: subTaskId } } });
      return res.status(200).send({ message: 'Sub task deleted successfully' });
    }
  } catch (error) {
    console.log(error);
  }
};

export const viewSubTask = async (req: express.Request, res: express.Response) => {
  const { subTaskId } = req.params || {};

  const subTaskDetails = await SubTask.aggregate([
    {
      $match: { subTaskId },
    },
  ]);

  if (!subTaskDetails) {
    return res.status(401).send({ message: 'Sub task does not exists' });
  } else {
    return res.status(200).send({ message: 'Sub task details successfully displayed', subTaskDetails: subTaskDetails[0] });
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
