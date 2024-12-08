import mongoose, { Schema } from 'mongoose';

const subTasksSchema = new Schema(
  {
    title: { type: String, required: true },
    dueDate: { type: Date, default: new Date() },
    description: { type: String, required: true },
    taskId: { type: String, required: true },
    subTaskId: { type: String, required: true },
    tag: { type: String, required: true },
  },
  { timestamps: true },
);

const SubTask = mongoose.model('SubTask', subTasksSchema);

export default SubTask;
