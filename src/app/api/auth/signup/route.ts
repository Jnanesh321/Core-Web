import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/types/auth.schema";
import {
  checkRateLimit,
  createUser,
  EmailAlreadyRegisteredError,
} from "@/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "localhost";
    const allowed = checkRateLimit(`signup:${ip}`, 10, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many signup requests. Please try again later." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const user = await createUser(validation.data);

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof EmailAlreadyRegisteredError) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 409 }
      );
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
