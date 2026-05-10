import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await params; // Await even if not using specific params to satisfy Next.js 15+ check if needed, or just remove if unused. Actually we might need id if we validated it.
    const body = await request.json();
    const { orderedIds } = body;

    if (!orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "orderedIds array is required" }, { status: 400 });
    }

    // Update all section orders in a transaction
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.section.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder API Error:", error);
    return NextResponse.json({ error: "Failed to reorder sections" }, { status: 500 });
  }
}
