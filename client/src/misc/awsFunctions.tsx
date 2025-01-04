import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
