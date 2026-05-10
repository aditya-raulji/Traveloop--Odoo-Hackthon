import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, adminError } from "@/lib/admin-auth";

export async function GET(req) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminError(adminCheck.error, adminCheck.status);

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const q = searchParams.get("q") || "";
  const filter = searchParams.get("filter") || "all";
  const skip = (page - 1) * limit;

  try {
    let where = q ? {
      OR: [
        { username: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
      ]
    } : {};

    if (filter === "admins") {
      where = { ...where, isAdmin: true };
    } else if (filter === "regular") {
      where = { ...where, isAdmin: false };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          email: true,
          profileImage: true,
          isAdmin: true,
          createdAt: true,
          _count: {
            select: { trips: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where })
    ]);

    return NextResponse.json({
      users,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Admin Users Fetch Error:", error);
    return adminError("Failed to fetch users", 500);
  }
}
