import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema(
  {
    taskId: { type: String, required: true },
    userId: { type: String, required: true },
    attachments: [{ type: String }],
    commentId: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true },
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
