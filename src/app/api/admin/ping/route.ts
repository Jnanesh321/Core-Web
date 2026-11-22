import { NextResponse } from "next/server";
import { requireRole, AuthError, ForbiddenError } from "@/lib/auth";
import { RoleName } from "@prisma/client";

export async function GET() {
  try {
    const user = await requireRole(RoleName.ADMIN);
    return NextResponse.json({
      message: "pong",
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
