import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        baseBalance: true,
        currency: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate net balance
    const [incomeResult, expenseResult] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId: session.user.id,
          type: "INCOME",
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId: session.user.id,
          type: "EXPENSE",
        },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = incomeResult._sum.amount || 0;
    const totalExpenses = expenseResult._sum.amount || 0;
    const netBalance = user.baseBalance + totalIncome - totalExpenses;

    return NextResponse.json({
      ...user,
      netBalance,
      totalIncome,
      totalExpenses,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password, baseBalance, currency, currentPassword } =
      await req.json();

    // Validate required fields for sensitive operations
    if (email && email !== session.user.email) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password required to change email" },
          { status: 400 }
        );
      }
    }

    if (password) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password required to change password" },
          { status: 400 }
        );
      }
    }

    // Verify current password if provided
    if (currentPassword) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      });

      if (
        !user?.password ||
        !(await bcrypt.compare(currentPassword, user.password))
      ) {
        return NextResponse.json(
          { error: "Invalid current password" },
          { status: 400 }
        );
      }
    }

    // Check if email is already taken (if changing email)
    if (email && email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: {
      name?: string;
      email?: string;
      baseBalance?: number;
      currency?: string;
      password?: string;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (baseBalance !== undefined)
      updateData.baseBalance = parseFloat(baseBalance);
    if (currency !== undefined) updateData.currency = currency;

    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        baseBalance: true,
        currency: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword } = await req.json();

    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password required to delete account" },
        { status: 400 }
      );
    }

    // Verify current password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (
      !user?.password ||
      !(await bcrypt.compare(currentPassword, user.password))
    ) {
      return NextResponse.json(
        { error: "Invalid current password" },
        { status: 400 }
      );
    }

    // Delete user (cascade will handle transactions, accounts, sessions)
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
