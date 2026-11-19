import { NextRequest, NextResponse } from "next/server";
import { requireRole, AuthError, ForbiddenError } from "@/lib/auth";
import { RoleName } from "@prisma/client";
import { auditLogsQuerySchema } from "@/types/audit";
import { getAuditLogs } from "@/services/audit.service";

export async function GET(req: NextRequest) {
  try {
    // Only SUPER_ADMIN has audit log inspection authorization
    await requireRole(RoleName.SUPER_ADMIN);

    const { searchParams } = new URL(req.url);
    const queryResult = auditLogsQuerySchema.safeParse({
      cursor: searchParams.get("cursor") || undefined,
      limit: searchParams.get("limit") || undefined,
    });

    if (!queryResult.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: queryResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { cursor, limit } = queryResult.data;
    const result = await getAuditLogs({ cursor, limit });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    console.error("[AuditLogsRoute] Error fetching audit logs:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
