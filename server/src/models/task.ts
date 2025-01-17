import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    dueDate: { type: Date, default: new Date() },
    description: { type: String, required: true },
    priority: {
      type: String,
      default: 'normal',
      enum: ['high', 'medium', 'normal', 'low'],
    },
    stage: {
      type: String,
      default: 'todo',
      enum: ['todo', 'in-progress', 'qa-testing', 'pm-testing', 'completed'],
    },
    activities: [
      {
        type: {
          type: String,
          default: 'assigned',
          enum: ['assigned', 'started', 'in-progress', 'bug', 'completed', 'commented'],
        },
        activity: String,
        date: { type: Date, default: new Date() },
        by: { type: Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    comments: [String],
    subTasks: [String],
    assets: [String],
    team: [String],
    projectId: { type: String, required: true },
    isTrashed: { type: Boolean, default: false },
    taskId: { type: String, required: true },
  },
  { timestamps: true },
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
