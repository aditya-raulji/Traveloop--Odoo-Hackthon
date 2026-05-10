import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, adminError } from "@/lib/admin-auth";

export async function PATCH(req, { params }) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminError(adminCheck.error, adminCheck.status);

  const { id } = params;
  const body = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isAdmin: body.isAdmin
      },
      select: {
        id: true,
        username: true,
        isAdmin: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Admin User Update Error:", error);
    return adminError("Failed to update user", 500);
  }
}

export async function DELETE(req, { params }) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminError(adminCheck.error, adminCheck.status);

  const { id } = params;

  // Prevent self-deletion
  if (id === adminCheck.user.id) {
    return adminError("You cannot delete your own account", 400);
  }

  try {
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Admin User Delete Error:", error);
    return adminError("Failed to delete user", 500);
  }
}
