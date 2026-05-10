import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const trip = await prisma.trip.findUnique({
      where: { 
        id,
        userId: session.user.id 
      },
      include: {
        stops: {
          include: { city: true }
        },
        sections: {
          include: { sectionBudgets: true },
          orderBy: { order: "asc" }
        }
      }
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error("Trip GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch trip" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, startDate, endDate, coverImage, isPublic } = body;

    const updatedTrip = await prisma.trip.update({
      where: { 
        id,
        userId: session.user.id // Security check
      },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(coverImage !== undefined && { coverImage }),
        ...(isPublic !== undefined && { isPublic }),
      }
    });

    return NextResponse.json(updatedTrip);
  } catch (error) {
    console.error("Trip PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.trip.delete({
      where: { 
        id,
        userId: session.user.id // Security check
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Trip DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete trip" }, { status: 500 });
  }
}
