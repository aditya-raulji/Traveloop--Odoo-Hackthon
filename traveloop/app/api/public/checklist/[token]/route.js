import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { token } = await params;

    const trip = await prisma.trip.findUnique({
      where: { checklistShareToken: token },
      select: {
        id: true,
        name: true,
        packingItems: {
          orderBy: { createdAt: "asc" }
        }
      }
    });

    if (!trip) {
      return NextResponse.json({ error: "Checklist not found" }, { status: 404 });
    }

    // Grouping logic
    const categories = trip.packingItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    const total = trip.packingItems.length;
    const packed = trip.packingItems.filter(i => i.isPacked).length;

    return NextResponse.json({
      tripName: trip.name,
      categories,
      stats: {
        total,
        packed,
        percent: total > 0 ? Math.round((packed / total) * 100) : 0
      }
    });
  } catch (error) {
    console.error("Public Checklist GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
