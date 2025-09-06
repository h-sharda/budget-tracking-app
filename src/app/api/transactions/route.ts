import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { TransactionType, Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const whereClause: Prisma.TransactionWhereInput = {
      userId: session.user.id,
    };

    if (year) {
      if (month) {
        // Both month and year provided - filter by specific month
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(
          parseInt(year),
          parseInt(month),
          0,
          23,
          59,
          59
        );
        whereClause.date = {
          gte: startDate,
          lte: endDate,
        };
      } else {
        // Only year provided - filter by entire year
        const startDate = new Date(parseInt(year), 0, 1); // January 1st
        const endDate = new Date(parseInt(year), 11, 31, 23, 59, 59); // December 31st
        whereClause.date = {
          gte: startDate,
          lte: endDate,
        };
      }
    }

    if (type && (type === "INCOME" || type === "EXPENSE")) {
      whereClause.type = type;
    }

    if (category) {
      whereClause.category = category;
    }

    // For date sorting, we can use Prisma's orderBy
    // For amount sorting, we need to fetch all and sort manually
    const orderBy: Prisma.TransactionOrderByWithRelationInput =
      sortBy === "date" ? { date: sortOrder as "asc" | "desc" } : {};

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: sortBy === "date" ? orderBy : undefined,
    });

    // If sorting by amount, apply custom sorting logic
    if (sortBy === "amount") {
      transactions.sort((a, b) => {
        // Calculate actual transaction values (positive for income, negative for expense)
        const aValue = a.type === "INCOME" ? a.amount : -a.amount;
        const bValue = b.type === "INCOME" ? b.amount : -b.amount;

        if (sortOrder === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    }

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, type, category, description, date } = await req.json();

    if (!amount || !type || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!Object.values(TransactionType).includes(type)) {
      return NextResponse.json(
        { error: "Invalid transaction type" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        type: type as TransactionType,
        category,
        description: description || null,
        date: date ? new Date(date) : new Date(),
        userId: session.user.id,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
