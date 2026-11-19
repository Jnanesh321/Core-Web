import { z } from "zod";

export interface StudentRecord {
  usn: string;
  name: string;
  department: string;
  year: number;
  email?: string;
}

export interface IStudentDirectoryService {
  findByUsn(usn: string): Promise<StudentRecord | null>;
  verifyStudent(usn: string, email: string): Promise<boolean>;
}

/**
 * Normalizes USN (trims and converts to uppercase)
 * Validates standard 10-character VTU / VCET alphanumeric USN format.
 */
export const usnSchema = z
  .string()
  .trim()
  .transform((val) => val.toUpperCase())
  .pipe(
    z
      .string()
      .regex(
        /^[0-9A-Z]{10}$/,
        "Invalid USN format: expected 10 alphanumeric characters (e.g. 4VP21CS001)"
      )
  );

export function normalizeAndValidateUsn(rawUsn: string): string {
  const result = usnSchema.safeParse(rawUsn);
  if (!result.success) {
    throw new Error("Invalid USN format");
  }
  return result.data;
}
