import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, adminError } from "@/lib/admin-auth";

export async function GET() {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminError(adminCheck.error, adminCheck.status);

  try {
    // Get top 10 activities by how many times they've been added to trips
    const topActivities = await prisma.activity.findMany({
      include: {
        city: {
          select: { name: true }
        },
        _count: {
          select: { stopActivities: true }
        }
      },
      orderBy: {
        stopActivities: {
          _count: 'desc'
        }
      },
      take: 10
    });

    // Activity type distribution
    const typeDistribution = await prisma.activity.groupBy({
      by: ['type'],
      _count: {
        id: true
      }
    });

    return NextResponse.json({
      activities: topActivities.map(a => ({
        id: a.id,
        name: a.name,
        city: a.city.name,
        type: a.type,
        timesAdded: a._count.stopActivities,
        avgCost: a.estimatedCost
      })),
      distribution: typeDistribution.map(item => ({
        name: item.type,
        value: item._count.id
      }))
    });
  } catch (error) {
    console.error("Admin Popular Activities Error:", error);
    return adminError("Failed to fetch popular activities", 500);
  }
}
