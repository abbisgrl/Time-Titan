import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    descriptions: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    logo: {
      type: String,
    },
    members: [
      {
        userId: { type: String, required: true },
        role: { type: String, required: true },
      },
    ],
    owner: {
      userId: { type: String, required: true },
      name: { type: String, required: true, max: 50 },
      email: { type: String, required: true, unique: true },
    },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

const Project = mongoose.model('Project', ProjectSchema);
export default Project;
