import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sectionId } = await params;
    const body = await request.json();
    const { items } = body; // Expecting an array of budget items

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Items array is required" }, { status: 400 });
    }

    // Use a transaction to replace all budget items for this section
    const result = await prisma.$transaction(async (tx) => {
      // 1. Delete existing items
      await tx.sectionBudget.deleteMany({
        where: { sectionId },
      });

      // 2. Create new items
      if (items.length > 0) {
        return await tx.sectionBudget.createMany({
          data: items.map((item) => ({
            sectionId,
            category: item.category || "MISCELLANEOUS",
            amount: parseFloat(item.amount) || 0,
            description: item.description || "",
            billingDetails: item.billingDetails || "",
            unitCost: parseFloat(item.unitCost) || 0,
            quantity: parseInt(item.quantity) || 1,
          })),
        });
      }
      return { count: 0 };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Budget Bulk POST Error:", error);
    return NextResponse.json({ error: "Failed to update budget items" }, { status: 500 });
  }
}
