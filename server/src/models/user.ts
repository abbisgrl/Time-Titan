import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    role: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isOwner: { type: Boolean, required: true, default: false },
    projects: {
      type: [String],
    },
    tasks: [{ type: String, ref: 'Task' }],
    isActive: { type: Boolean, required: true, default: true },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    memberPassword: {
      type: String,
      required: true,
      min: 5,
    },
    ownerId: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);
export default User;
