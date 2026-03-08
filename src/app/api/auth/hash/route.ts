import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    return NextResponse.json({
      success: true,
      hashedPassword
    });

  } catch (error) {
    console.error("Error hashing password:", error);
    return NextResponse.json(
      { success: false, message: "Error hashing password" },
      { status: 500 }
    );
  }
}
