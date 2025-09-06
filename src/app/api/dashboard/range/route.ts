import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const preset = searchParams.get("preset");

    let startDate: Date;
    let endDate: Date;

    if (preset) {
      const currentDate = new Date();
      switch (preset) {
        case "3months":
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 3,
            1
          );
          endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            0,
            23,
            59,
            59
          );
          break;
        case "6months":
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 6,
            1
          );
          endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            0,
            23,
            59,
            59
          );
          break;
        case "year":
          startDate = new Date(
            currentDate.getFullYear() - 1,
            currentDate.getMonth(),
            1
          );
          endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            0,
            23,
            59,
            59
          );
          break;
        case "thisyear":
          startDate = new Date(currentDate.getFullYear(), 0, 1);
          endDate = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59);
          break;
        default:
          return NextResponse.json(
            { error: "Invalid preset" },
            { status: 400 }
          );
      }
    } else if (startDateParam && endDateParam) {
      startDate = new Date(startDateParam);
      endDate = new Date(endDateParam);
      endDate.setHours(23, 59, 59, 999);
    } else {
      return NextResponse.json(
        { error: "Missing date parameters" },
        { status: 400 }
      );
    }

    // Get range totals
    const [incomeResult, expenseResult] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId: session.user.id,
          type: TransactionType.INCOME,
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId: session.user.id,
          type: TransactionType.EXPENSE,
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = incomeResult._sum.amount || 0;
    const totalExpenses = expenseResult._sum.amount || 0;
    const netBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;

    // Calculate months in range for averages
    const monthsInRange = Math.max(
      1,
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
      )
    );
    const averageMonthlyIncome = totalIncome / monthsInRange;
    const averageMonthlyExpenses = totalExpenses / monthsInRange;

    // Get monthly data for the range
    const monthlyData = [];
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

    while (current <= endDate) {
      const monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
      const monthEnd = new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        0,
        23,
        59,
        59
      );

      const [monthIncome, monthExpense] = await Promise.all([
        prisma.transaction.aggregate({
          where: {
            userId: session.user.id,
            type: TransactionType.INCOME,
            date: { gte: monthStart, lte: monthEnd },
          },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: {
            userId: session.user.id,
            type: TransactionType.EXPENSE,
            date: { gte: monthStart, lte: monthEnd },
          },
          _sum: { amount: true },
        }),
      ]);

      monthlyData.push({
        month: current.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        income: monthIncome._sum.amount || 0,
        expenses: monthExpense._sum.amount || 0,
        net: (monthIncome._sum.amount || 0) - (monthExpense._sum.amount || 0),
      });

      current.setMonth(current.getMonth() + 1);
    }

    // Get expense categories for the entire range
    const expenseCategories = await prisma.transaction.groupBy({
      by: ["category"],
      where: {
        userId: session.user.id,
        type: TransactionType.EXPENSE,
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });

    const categoryData = expenseCategories.map((cat) => ({
      category: cat.category,
      amount: cat._sum.amount || 0,
    }));

    // Get category trends (top 5 categories over time)
    const topCategories = categoryData
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map((cat) => cat.category);

    const categoryTrends = [];
    for (const category of topCategories) {
      const trendData = [];
      const trendCurrent = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        1
      );

      while (trendCurrent <= endDate) {
        const monthStart = new Date(
          trendCurrent.getFullYear(),
          trendCurrent.getMonth(),
          1
        );
        const monthEnd = new Date(
          trendCurrent.getFullYear(),
          trendCurrent.getMonth() + 1,
          0,
          23,
          59,
          59
        );

        const monthCategoryExpense = await prisma.transaction.aggregate({
          where: {
            userId: session.user.id,
            type: TransactionType.EXPENSE,
            category: category,
            date: { gte: monthStart, lte: monthEnd },
          },
          _sum: { amount: true },
        });

        trendData.push({
          month: trendCurrent.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          amount: monthCategoryExpense._sum.amount || 0,
        });

        trendCurrent.setMonth(trendCurrent.getMonth() + 1);
      }

      categoryTrends.push({
        category,
        data: trendData,
      });
    }

    return NextResponse.json({
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      totalIncome,
      totalExpenses,
      netBalance,
      averageMonthlyIncome,
      averageMonthlyExpenses,
      savingsRate,
      monthlyData,
      categoryData,
      categoryTrends,
    });
  } catch (error) {
    console.error("Error fetching range data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
