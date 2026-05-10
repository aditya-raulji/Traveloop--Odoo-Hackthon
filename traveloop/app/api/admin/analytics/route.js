import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, adminError } from "@/lib/admin-auth";

export async function GET() {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminError(adminCheck.error, adminCheck.status);

  try {
    // 1. Trips created per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyTrips = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "createdAt") as date,
        COUNT(id)::int as count
      FROM trips
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    // 2. Trips per month (last 12 months)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const monthlyTrips = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(id)::int as count
      FROM trips
      WHERE "createdAt" >= ${oneYearAgo}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    // 3. Averages
    const [avgDurationData, avgBudgetData] = await Promise.all([
      prisma.$queryRaw`
        SELECT AVG(EXTRACT(DAY FROM ("endDate" - "startDate")))::float as avg_duration
        FROM trips
        WHERE "startDate" IS NOT NULL AND "endDate" IS NOT NULL
      `,
      prisma.budget.aggregate({
        _avg: {
          totalBudget: true
        }
      })
    ]);

    // 4. Most popular items
    const [mostPopularCity, mostPopularType] = await Promise.all([
      prisma.city.findFirst({
        orderBy: { stops: { _count: 'desc' } },
        select: { name: true }
      }),
      prisma.activity.groupBy({
        by: ['type'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 1
      })
    ]);

    return NextResponse.json({
      dailyTrends: dailyTrips.map(d => ({
        date: d.date.toISOString().split('T')[0],
        count: d.count
      })),
      monthlyTrends: monthlyTrips.map(m => ({
        month: m.month.toLocaleString('default', { month: 'short' }),
        count: m.count
      })),
      stats: {
        avgDuration: Math.round(avgDurationData[0]?.avg_duration || 0),
        avgBudget: Math.round(avgBudgetData._avg.totalBudget || 0),
        mostPopularCity: mostPopularCity?.name || "N/A",
        mostPopularActivityType: mostPopularType[0]?.type || "N/A"
      }
    });
  } catch (error) {
    console.error("Admin Analytics Error:", error);
    return adminError("Failed to fetch analytics", 500);
  }
}
