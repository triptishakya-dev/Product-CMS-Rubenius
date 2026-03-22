import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

/**
 * Uploads a file buffer to S3
 * @param {Buffer} fileBuffer - The file content as a Buffer
 * @param {string} fileName - The name/key for the file in S3
 * @param {string} contentType - Mime type of the file
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
export async function uploadFile(fileBuffer, fileName, contentType = "image/jpeg") {
    const bucketName = process.env.BUCKET_NAME;
    
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
    });

    await s3.send(command);
    
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}
