import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
