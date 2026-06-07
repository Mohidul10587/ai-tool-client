import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dpksjt1e3",
  api_key: "516976553864439",
  api_secret: "ycUtN1JCHtEskPWyJeL-OltqUaw",
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json(
      { error: "File too large. Maximum size is 5MB" },
      { status: 400 }
    );

  const buffer = Buffer.from(await file.arrayBuffer());

  const result: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "portfolio",
          resource_type: "image",
          transformation: [
            { width: 800, height: 800, crop: "limit" },
            { quality: "auto:good" },
          ],
        },
        (error, result) => (error ? reject(error) : resolve(result))
      )
      .end(buffer);
  });

  return NextResponse.json({ url: result.secure_url });
}
