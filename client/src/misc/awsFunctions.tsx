import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_REGION: string;
      REACT_APP_AWS_ACCESS_KEY_ID: string;
      REACT_APP_AWS_SECRET_ACCESS_KEY: string;
      REACT_APP_BUCKET_NAME: string;
    }
  }
}
const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: "AKIA22ZOBKF5FZK2WQ7U",
    secretAccessKey: "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",
  },
});

export const uploadFileToS3 = async (
  file: File,
  bucketName: string,
  key: string
) => {
  try {
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: file.type,
      ACL: "public-read" as
        | "private"
        | "public-read"
        | "public-read-write"
        | "authenticated-read",
    };

    const command = new PutObjectCommand(uploadParams);

    await s3Client.send(command);

    const fileUrl = `https://${bucketName}.s3.us-east-1.amazonaws.com/${key}`;

    console.log("File uploaded successfully:", fileUrl);
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
