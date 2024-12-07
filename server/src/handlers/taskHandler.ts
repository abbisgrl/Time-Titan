import express from 'express';
import { validateRequiredFields } from '../helpers/validators';
import Task from '../models/task';

export const getTaskList = async (req: express.Request, res: express.Response) => {
  const { projectId } = req.params;
  const { status } = req.query;
  const validationError = validateRequiredFields([{ name: 'projectId', value: projectId, message: 'Project details is missing' }], res);
  if (validationError) return;

  console.dir({ projectId, status }, { depth: null });

  const condition: any = { projectId };

  if (status === 'todo' || status === 'in progress' || status === 'completed') {
    condition.stage = status;
  }

  console.dir({ condition }, { depth: null });
  try {
    const taskData = await Task.aggregate([{ $match: condition }]);
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
    };
    console.dir({ taskObject }, { depth: null });

    const response = await Task.create(taskObject);
    console.dir({ response }, { depth: null });
    return res.status(200).send({ message: 'New task created successfully', response });
  } catch (error) {
    console.log(error);
  }
};

export const deleteTasks = () => {};

export const updateTasks = () => {};
