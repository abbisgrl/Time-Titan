import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const awsAccessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const region = import.meta.env.VITE_REGION;

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: awsAccessKeyId || "",
    secretAccessKey: awsSecretAccessKey || "",
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

    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
