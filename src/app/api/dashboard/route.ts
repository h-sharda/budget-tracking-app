import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get overall statistics (lifetime)
    const [incomeResult, expenseResult] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId: session.user.id,
          type: TransactionType.INCOME,
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId: session.user.id,
          type: TransactionType.EXPENSE,
        },
        _sum: { amount: true },
      }),
    ]);

    // Get user's base balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { baseBalance: true, currency: true },
    });

    const totalIncome = incomeResult._sum.amount || 0;
    const totalExpenses = expenseResult._sum.amount || 0;
    const baseBalance = user?.baseBalance || 0;
    const netBalance = baseBalance + totalIncome - totalExpenses;

    return NextResponse.json({
      overall: {
        baseBalance,
        totalIncome,
        totalExpenses,
        netBalance,
        currency: user?.currency || "INR",
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
