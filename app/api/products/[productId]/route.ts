import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadFile } from "@/lib/s3";

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

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const id = parseInt(params.productId);
    
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const body = await req.json();
    const id = parseInt(params.productId);

    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const { name, image, description, usp } = body;

    let imageUrl = image;

    // Handle base64 image upload to S3 if a new image is provided
    if (image && image.startsWith("data:image")) {
      const { type, buffer } = parseBase64Image(image);
      const fileName = `product-${id}-${Date.now()}.${type.split("/")[1]}`;
      imageUrl = await uploadFile(buffer, fileName, type);
    }

    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name,
        image: imageUrl,
        description,
        usp,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const id = parseInt(params.productId);
    
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    await prisma.product.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
