import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: tripId } = await params;

    const items = await prisma.packingItem.findMany({
      where: { tripId },
      orderBy: { createdAt: "asc" }
    });

    const totalItems = items.length;
    const packedItems = items.filter(i => i.isPacked).length;

    // Grouping logic for initial load if needed
    const categories = items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    return NextResponse.json({
      items,
      categories,
      stats: {
        total: totalItems,
        packed: packedItems,
        percent: totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0
      }
    });
  } catch (error) {
    console.error("Packing GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch packing items" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: tripId } = await params;
    const body = await request.json();
    const { name, category, isPriority } = body;

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const newItem = await prisma.packingItem.create({
      data: {
        tripId,
        name,
        category: category || "OTHER",
        isPriority: isPriority || false,
      }
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Packing POST Error:", error);
    return NextResponse.json({ error: "Failed to add packing item" }, { status: 500 });
  }
}
