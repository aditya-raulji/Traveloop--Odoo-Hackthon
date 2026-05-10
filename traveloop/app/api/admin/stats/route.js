import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, adminError } from "@/lib/admin-auth";

export async function GET() {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminError(adminCheck.error, adminCheck.status);

  try {
    const [
      totalUsers,
      newUsersThisWeek,
      totalTrips,
      tripsThisMonth,
      totalActivities
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.trip.count(),
      prisma.trip.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.stopActivity.count()
    ]);

    // Active today = users who created something today (simplified)
    const activeToday = await prisma.user.count({
      where: {
        OR: [
          {
            trips: {
              some: {
                createdAt: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
              }
            }
          },
          {
            communityPosts: {
              some: {
                createdAt: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
              }
            }
          }
        ]
      }
    });

    return NextResponse.json({
      totalUsers,
      newUsersThisWeek,
      activeToday,
      totalTrips,
      tripsThisMonth,
      totalActivities
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    return adminError("Failed to fetch admin stats", 500);
  }
}
