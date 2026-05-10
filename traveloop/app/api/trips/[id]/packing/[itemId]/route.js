import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;
    const body = await request.json();
    const { isPacked, name, category, isPriority } = body;

    const updatedItem = await prisma.packingItem.update({
      where: { id: itemId },
      data: {
        ...(isPacked !== undefined && { isPacked }),
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        ...(isPriority !== undefined && { isPriority }),
      }
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Packing Item PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;

    await prisma.packingItem.delete({
      where: { id: itemId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Packing Item DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
