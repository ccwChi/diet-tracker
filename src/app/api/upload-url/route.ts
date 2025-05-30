// app/api/upload-url/route.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "ap-northeast-1", 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename") ?? "upload.webp";

  const command = new PutObjectCommand({
    Bucket: "diet-fubone-tracker",
    Key: filename,
    ContentType: "image/webp",
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 });

  return Response.json({ url });
}
