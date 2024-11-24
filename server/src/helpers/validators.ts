import express from 'express';

interface Field {
  name: string;
  value: string;
  message: string;
}

export const validateRequiredFields = (fields: Array<Field>, res: express.Response) => {
  for (const field of fields) {
    if (!field.value) {
      return res.status(400).send({ message: field.message, field: field.name });
    }
  }
  return null; // Return null if validation passes
};
