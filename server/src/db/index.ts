import mongoose from 'mongoose';

const mongoDbUrl = process.env.MONGODB_URL as string;

if (!mongoDbUrl) {
  console.error('MONGODB_URL is not defined in environment variables.');
  process.exit(1); // Exit the app if the database URL is not provided
}

mongoose
  .connect(mongoDbUrl, {
    serverSelectionTimeoutMS: 30000, // 30 seconds
  })
  .then(() => console.log('Database connected successfully'))
  .catch((error: any) => console.error('Database connection error:', error));
