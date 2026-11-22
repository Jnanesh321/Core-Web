import { prisma } from "@/lib/prisma";
import {
  IStudentDirectoryService,
  StudentRecord,
  normalizeAndValidateUsn,
} from "@/types/student-directory";

export class LocalDirectoryAdapter implements IStudentDirectoryService {
  /**
   * Queries local database for an existing StudentProfile.
   * A student is "known" locally if a verified StudentProfile exists.
   * Privacy: Never logs USN or phone to console.
   */
  async findByUsn(rawUsn: string): Promise<StudentRecord | null> {
    const usn = normalizeAndValidateUsn(rawUsn);

    const profile = await prisma.studentProfile.findUnique({
      where: { usn },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!profile) {
      return null;
    }

    return {
      usn: profile.usn,
      name: profile.user.name ?? "Student",
      department: profile.department,
      year: profile.year,
      email: profile.user.email ?? undefined,
    };
  }

  /**
   * Verifies that the provided USN and email correspond to the same local student.
   * Privacy: Never logs USN or email to console.
   */
  async verifyStudent(rawUsn: string, email: string): Promise<boolean> {
    const usn = normalizeAndValidateUsn(rawUsn);
    const normalizedEmail = email.trim().toLowerCase();

    const profile = await prisma.studentProfile.findUnique({
      where: { usn },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!profile || !profile.user.email) {
      return false;
    }

    return profile.user.email.toLowerCase() === normalizedEmail;
  }
}
