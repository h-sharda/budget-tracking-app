import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the earliest and latest transaction dates for the user
    const [earliestTransaction, latestTransaction] = await Promise.all([
      prisma.transaction.findFirst({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          date: "asc",
        },
        select: {
          date: true,
        },
      }),
      prisma.transaction.findFirst({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          date: "desc",
        },
        select: {
          date: true,
        },
      }),
    ]);

    // If no transactions exist, return current year
    if (!earliestTransaction || !latestTransaction) {
      const currentYear = new Date().getFullYear();
      return NextResponse.json({
        years: [currentYear],
        minYear: currentYear,
        maxYear: currentYear,
      });
    }

    // Extract years from the earliest and latest transaction dates
    const minYear = new Date(earliestTransaction.date).getFullYear();
    const maxYear = new Date(latestTransaction.date).getFullYear();

    // Generate array of years from min to max
    const years = Array.from(
      { length: maxYear - minYear + 1 },
      (_, i) => minYear + i
    );

    return NextResponse.json({
      years,
      minYear,
      maxYear,
    });
  } catch (error) {
    console.error("Error fetching year range:", error);
    return NextResponse.json(
      { error: "Failed to fetch year range" },
      { status: 500 }
    );
  }
}
