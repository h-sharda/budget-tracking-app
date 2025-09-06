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
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const type = searchParams.get("type") || "monthly";

    const currentDate = new Date();
    let startDate: Date;
    let endDate: Date;
    let selectedMonth: number | undefined;
    let selectedYear: number | undefined;

    if (type === "yearly" && year) {
      // Yearly data
      selectedYear = parseInt(year);
      startDate = new Date(selectedYear, 0, 1);
      endDate = new Date(selectedYear, 11, 31, 23, 59, 59);
    } else if (month && year) {
      // Monthly data
      selectedMonth = parseInt(month);
      selectedYear = parseInt(year);
      startDate = new Date(selectedYear, selectedMonth - 1, 1);
      endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);
    } else {
      // Default to current month
      selectedMonth = currentDate.getMonth() + 1;
      selectedYear = currentDate.getFullYear();
      startDate = new Date(selectedYear, selectedMonth - 1, 1);
      endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);
    }

    // Get period totals
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

    const income = incomeResult._sum.amount || 0;
    const expenses = expenseResult._sum.amount || 0;
    const netBalance = income - expenses;
    const savingsRate = income > 0 ? (netBalance / income) * 100 : 0;

    // Get daily data for the period
    const dailyData = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dayStart = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate()
      );
      const dayEnd = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate(),
        23,
        59,
        59
      );

      const [dayIncome, dayExpense] = await Promise.all([
        prisma.transaction.aggregate({
          where: {
            userId: session.user.id,
            type: TransactionType.INCOME,
            date: { gte: dayStart, lte: dayEnd },
          },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: {
            userId: session.user.id,
            type: TransactionType.EXPENSE,
            date: { gte: dayStart, lte: dayEnd },
          },
          _sum: { amount: true },
        }),
      ]);

      dailyData.push({
        date: current.toISOString().split("T")[0],
        income: dayIncome._sum.amount || 0,
        expenses: dayExpense._sum.amount || 0,
        net: (dayIncome._sum.amount || 0) - (dayExpense._sum.amount || 0),
      });

      current.setDate(current.getDate() + 1);
    }

    // Get expense categories for the period
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

    return NextResponse.json({
      selectedMonth,
      selectedYear,
      income,
      expenses,
      savingsRate,
      netBalance,
      dailyData,
      categoryData,
    });
  } catch (error) {
    console.error("Error fetching period data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
