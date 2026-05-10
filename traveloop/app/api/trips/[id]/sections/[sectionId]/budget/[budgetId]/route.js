import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { budgetId } = await params;
    const body = await request.json();
    
    const updateData = {};
    if (body.category !== undefined) updateData.category = body.category;
    if (body.amount !== undefined) updateData.amount = parseFloat(body.amount);
    if (body.description !== undefined) updateData.description = body.description;

    const budget = await prisma.sectionBudget.update({
      where: { id: budgetId },
      data: updateData,
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error("Budget PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update budget item" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { budgetId } = await params;

    await prisma.sectionBudget.delete({
      where: { id: budgetId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Budget DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete budget item" }, { status: 500 });
  }
}
