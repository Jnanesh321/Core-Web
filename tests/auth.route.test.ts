import { describe, it, expect, beforeEach } from "vitest";
import { POST as signupHandler } from "@/app/api/auth/signup/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetRateLimits } from "@/services/auth.service";

describe("POST /api/auth/signup Route Handler", () => {
  beforeEach(async () => {
    resetRateLimits();
    await prisma.user.deleteMany({
      where: { email: { in: ["route-test@vcet.edu.in"] } },
    });
  });

  it("returns 201 when user is created successfully", async () => {
    const req = new NextRequest("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Route Tester",
        email: "route-test@vcet.edu.in",
        password: "securepassword123",
      }),
    });

    const res = await signupHandler(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.message).toBe("User created successfully");
    expect(json.user.email).toBe("route-test@vcet.edu.in");
    expect(json.user.roles).toContain("STUDENT");
  });

  it("returns 409 when email already exists", async () => {
    const body = {
      name: "Route Tester",
      email: "route-test@vcet.edu.in",
      password: "securepassword123",
    };

    const req1 = new NextRequest("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const res1 = await signupHandler(req1);
    expect(res1.status).toBe(201);

    const req2 = new NextRequest("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const res2 = await signupHandler(req2);
    expect(res2.status).toBe(409);
    const json2 = await res2.json();
    expect(json2.error).toBe("Email is already registered");
  });

  it("returns 400 when password is too short", async () => {
    const req = new NextRequest("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Short Pwd",
        email: "route-test@vcet.edu.in",
        password: "short", // < 10 chars
      }),
    });

    const res = await signupHandler(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Validation failed");
    expect(json.details.password).toBeDefined();
  });
});
