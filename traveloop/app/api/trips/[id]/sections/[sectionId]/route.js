import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sectionId } = await params;
    const body = await request.json();
    
    // Map of fields that can be updated
    const updateData = {};
    const allowedFields = [
      'title', 'description', 'sectionType', 'startDate', 
      'endDate', 'isPlanned', 'attachmentUrl', 'order'
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        if (field === 'startDate' || field === 'endDate') {
          updateData[field] = body[field] ? new Date(body[field]) : null;
        } else {
          updateData[field] = body[field];
        }
      }
    });

    const section = await prisma.section.update({
      where: { id: sectionId },
      data: updateData,
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("Section PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update section" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sectionId } = await params;

    await prisma.section.delete({
      where: { id: sectionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Section DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete section" }, { status: 500 });
  }
}
