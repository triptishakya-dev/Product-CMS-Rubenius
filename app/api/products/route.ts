import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3";

function parseBase64Image(base64String: string) {
  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }
  return {
    type: matches[1],
    buffer: Buffer.from(matches[2], "base64"),
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, image, description, usp } = body;

    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!image) return new NextResponse("Image is required", { status: 400 });
    if (!description) return new NextResponse("Description is required", { status: 400 });
    if (!usp || !Array.isArray(usp)) return new NextResponse("USP array is required", { status: 400 });

    let imageUrl = image;

    // Handle base64 image upload to S3
    if (image.startsWith("data:image")) {
      const { type, buffer } = parseBase64Image(image);
      const fileName = `product-${Date.now()}.${type.split("/")[1]}`;
      imageUrl = await uploadToS3(buffer, fileName, type);
    }

    const product = await prisma.product.create({
      data: {
        name,
        image: imageUrl,
        description,
        usp,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
