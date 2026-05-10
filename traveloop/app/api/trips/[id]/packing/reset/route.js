import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: tripId } = await params;

    await prisma.packingItem.updateMany({
      where: { tripId },
      data: { isPacked: false }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Packing Reset Error:", error);
    return NextResponse.json({ error: "Failed to reset checklist" }, { status: 500 });
  }
}
