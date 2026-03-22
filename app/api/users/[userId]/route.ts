import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const id = parseInt(params.userId);

    if (isNaN(id)) {
        return new NextResponse("Invalid ID", { status: 400 });
    }

    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
