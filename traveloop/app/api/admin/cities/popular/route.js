import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, adminError } from "@/lib/admin-auth";

export async function GET() {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminError(adminCheck.error, adminCheck.status);

  try {
    // Get top 10 cities by trip count
    const topCities = await prisma.city.findMany({
      include: {
        _count: {
          select: { stops: true }
        }
      },
      orderBy: {
        stops: {
          _count: 'desc'
        }
      },
      take: 10
    });

    // Regional distribution
    const regionalData = await prisma.city.groupBy({
      by: ['region'],
      _count: {
        id: true
      }
    });

    const regions = regionalData.map(item => ({
      name: item.region,
      value: item._count.id
    }));

    return NextResponse.json({
      cities: topCities.map(c => ({
        id: c.id,
        name: c.name,
        country: c.country,
        tripCount: c._count.stops,
        region: c.region
      })),
      regions
    });
  } catch (error) {
    console.error("Admin Popular Cities Error:", error);
    return adminError("Failed to fetch popular cities", 500);
  }
}
