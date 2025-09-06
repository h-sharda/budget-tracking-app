import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { password, confirmPassword, currentPassword } = await req.json();

    // Validate required fields
    if (!password || password.trim() === "") {
      return NextResponse.json(
        { error: "New password is required" },
        { status: 400 }
      );
    }

    if (!confirmPassword || confirmPassword.trim() === "") {
      return NextResponse.json(
        { error: "Password confirmation is required" },
        { status: 400 }
      );
    }

    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required to change password" },
        { status: 400 }
      );
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
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

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedPassword,
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
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
