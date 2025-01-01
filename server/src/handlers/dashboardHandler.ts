import express from 'express';
import { validateRequiredFields } from '../helpers/validators';
import Task from '../models/task';

export const getDashboardCardDetails = async (req: express.Request, res: express.Response) => {
  const { projectId } = req.params;

  const validationError = validateRequiredFields([{ name: 'projectId', value: projectId, message: 'Project details is missing' }], res);
  if (validationError) return;
  try {
    const taskDetails = await Task.aggregate([{ $match: { projectId } }, { $group: { _id: '$stage', totalTask: { $count: {} } } }]);
    const taskCounts = taskDetails.reduce((acc, { _id, totalTask }) => {
      acc[_id] = totalTask;
      return acc;
    }, {});
    console.dir({ taskCounts }, { depth: null });
    return res.status(200).send({ message: 'Dashboard details fetched successfully', cardDetails: taskCounts });
  } catch (error) {
    console.dir(error);
  }
};

export const getRecentUpdatedTasks = async (req: express.Request, res: express.Response) => {
  const { projectId } = req.params;
  const validationError = validateRequiredFields([{ name: 'projectId', value: projectId, message: 'Project details is missing' }], res);
  if (validationError) return;
  try {
    const taskList = await Task.aggregate([
      { $match: { projectId } },
      { $sort: { updatedAt: -1 } },
      { $project: { _id: 0, taskId: 1, title: 1, description: 1, priority: 1, createdAt: 1, stage: 1, dueDate: 1, team: 1 } },
    ]);
    return res.status(200).send({ message: 'Dashboard task list fetched successfully', taskList });
  } catch (error) {
    console.dir(error);
  }
};
