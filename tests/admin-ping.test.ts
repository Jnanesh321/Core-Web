import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET as pingHandler } from "@/app/api/admin/ping/route";
import { getServerSession } from "next-auth";
import { RoleName } from "@prisma/client";

vi.mock("next-auth", async () => {
  const actual = await vi.importActual("next-auth");
  return {
    ...actual,
    getServerSession: vi.fn(),
  };
});

describe("GET /api/admin/ping RBAC Guard Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when no session is present", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const res = await pingHandler();
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Authentication required");
  });

  it("returns 403 when user is only STUDENT", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: {
        id: "user-123",
        email: "student@vcet.edu.in",
        name: "Student User",
        roles: [RoleName.STUDENT],
      },
      expires: "2099-01-01",
    });

    const res = await pingHandler();
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toContain("Missing required role(s): ADMIN");
  });

  it("returns 200 when user has ADMIN role", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: {
        id: "admin-123",
        email: "admin@vcet.edu.in",
        name: "Admin User",
        roles: [RoleName.ADMIN],
      },
      expires: "2099-01-01",
    });

    const res = await pingHandler();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe("pong");
    expect(body.user.email).toBe("admin@vcet.edu.in");
  });

  it("returns 200 when user has SUPER_ADMIN role (hierarchical inheritance)", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: {
        id: "superadmin-123",
        email: "superadmin@vcet.edu.in",
        name: "Super Admin User",
        roles: [RoleName.SUPER_ADMIN],
      },
      expires: "2099-01-01",
    });

    const res = await pingHandler();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe("pong");
  });
});
