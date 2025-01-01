import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true, // Keep this as unique for project-level uniqueness
    },
    name: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    description: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    logo: {
      type: String,
    },
    members: [{ type: String, required: true }],
    owner: {
      userId: { type: String, required: true },
      name: { type: String, required: true, max: 50 },
      email: { type: String, required: true },
    },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

const Project = mongoose.model('Project', ProjectSchema);
export default Project;
