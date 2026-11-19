import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  getStudentDirectory,
  LocalDirectoryAdapter,
  CellsStudentDirectory,
  NotImplementedError,
} from "@/services/adapters";
import { normalizeAndValidateUsn } from "@/types/student-directory";
import { prisma } from "@/lib/prisma";

describe("Student Directory Service & Adapters", () => {
  const originalEnv = { ...process.env };

  beforeEach(async () => {
    process.env = { ...originalEnv };
    // Clean up test data
    await prisma.studentProfile.deleteMany({
      where: { usn: "4VP21CS001" },
    });
    await prisma.user.deleteMany({
      where: { email: "student.test@vcet.edu.in" },
    });
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe("USN Normalization & Validation", () => {
    it("normalizes lowercase and whitespace", () => {
      const normalized = normalizeAndValidateUsn("  4vp21cs001  ");
      expect(normalized).toBe("4VP21CS001");
    });

    it("rejects invalid USNs", () => {
      expect(() => normalizeAndValidateUsn("tooShort")).toThrow("Invalid USN format");
      expect(() => normalizeAndValidateUsn("4VP21CS001_TOOLONG")).toThrow("Invalid USN format");
      expect(() => normalizeAndValidateUsn("4VP21CS00$")).toThrow("Invalid USN format");
    });
  });

  describe("LocalDirectoryAdapter", () => {
    it("returns null when profile does not exist", async () => {
      const adapter = new LocalDirectoryAdapter();
      const result = await adapter.findByUsn("4VP21CS001");
      expect(result).toBeNull();
    });

    it("returns student record when profile exists in database", async () => {
      const user = await prisma.user.create({
        data: {
          name: "Test Student",
          email: "student.test@vcet.edu.in",
          studentProfile: {
            create: {
              usn: "4VP21CS001",
              department: "CSE",
              year: 3,
            },
          },
        },
      });

      const adapter = new LocalDirectoryAdapter();
      const result = await adapter.findByUsn("4vp21cs001");

      expect(result).not.toBeNull();
      expect(result?.usn).toBe("4VP21CS001");
      expect(result?.name).toBe("Test Student");
      expect(result?.department).toBe("CSE");
      expect(result?.year).toBe(3);
      expect(result?.email).toBe("student.test@vcet.edu.in");

      // Test verifyStudent
      const isVerified = await adapter.verifyStudent("4VP21CS001", "student.test@vcet.edu.in");
      expect(isVerified).toBe(true);

      const isMismatch = await adapter.verifyStudent("4VP21CS001", "wrong@vcet.edu.in");
      expect(isMismatch).toBe(false);
    });
  });

  describe("CellsStudentDirectory", () => {
    it("throws NotImplementedError when API url or key is missing", async () => {
      delete process.env.CELLS_API_URL;
      delete process.env.CELLS_API_KEY;

      const cells = new CellsStudentDirectory();
      await expect(cells.findByUsn("4VP21CS001")).rejects.toThrow(NotImplementedError);
    });
  });

  describe("Factory & Resilient Fallback", () => {
    it("returns local adapter when CELLS_ENABLED is unset or false", () => {
      process.env.CELLS_ENABLED = "false";
      const directory = getStudentDirectory();
      expect(directory instanceof LocalDirectoryAdapter).toBe(true);
    });

    it("falls back to local directory without throwing on Cells failure", async () => {
      // Seed local student
      await prisma.user.create({
        data: {
          name: "Fallback Student",
          email: "student.test@vcet.edu.in",
          studentProfile: {
            create: {
              usn: "4VP21CS001",
              department: "ISE",
              year: 4,
            },
          },
        },
      });

      // Enable Cells but provide invalid endpoint to trigger network failure
      const directory = getStudentDirectory({
        cellsEnabled: true,
        cellsApiUrl: "http://localhost:59999/unreachable",
        cellsApiKey: "mock-key",
      });

      // Spy on console.warn to verify warning is issued without exposing USN
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const student = await directory.findByUsn("4VP21CS001");

      expect(student).not.toBeNull();
      expect(student?.name).toBe("Fallback Student");
      expect(student?.department).toBe("ISE");
      expect(warnSpy).toHaveBeenCalled();

      // Ensure console warning never logged the USN
      const loggedMessages = warnSpy.mock.calls.map((c) => c.join(" ")).join(" ");
      expect(loggedMessages).not.toContain("4VP21CS001");

      warnSpy.mockRestore();
    });
  });
});
