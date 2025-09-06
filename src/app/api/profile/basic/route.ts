import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, baseBalance, currency } = await req.json();

    // Validate required fields
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (baseBalance === undefined || baseBalance === null) {
      return NextResponse.json(
        { error: "Base balance is required" },
        { status: 400 }
      );
    }

    if (!currency || currency.trim() === "") {
      return NextResponse.json(
        { error: "Currency is required" },
        { status: 400 }
      );
    }

    // Validate base balance is a valid number
    const parsedBaseBalance = parseFloat(baseBalance);
    if (isNaN(parsedBaseBalance)) {
      return NextResponse.json(
        { error: "Base balance must be a valid number" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        baseBalance: parsedBaseBalance,
        currency: currency.trim(),
      },
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
    console.error("Error updating basic profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
