import {
  IStudentDirectoryService,
  StudentRecord,
  normalizeAndValidateUsn,
} from "@/types/student-directory";

export class NotImplementedError extends Error {
  constructor(message = "Not implemented") {
    super(message);
    this.name = "NotImplementedError";
  }
}

export class CellsApiError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "CellsApiError";
    this.statusCode = statusCode;
  }
}

export class CellsStudentDirectory implements IStudentDirectoryService {
  private apiUrl: string | undefined;
  private apiKey: string | undefined;

  constructor(apiUrl?: string, apiKey?: string) {
    this.apiUrl = apiUrl ?? process.env.CELLS_API_URL;
    this.apiKey = apiKey ?? process.env.CELLS_API_KEY;
  }

  private ensureConfigured(): { apiUrl: string; apiKey: string } {
    if (!this.apiUrl || !this.apiKey) {
      throw new NotImplementedError(
        "Cells API is not configured: CELLS_API_URL and CELLS_API_KEY must be provided"
      );
    }
    return { apiUrl: this.apiUrl, apiKey: this.apiKey };
  }

  /**
   * Fetches student record from VCET Cells API with a 3-second timeout.
   * Privacy: Never logs USN to console.
   */
  async findByUsn(rawUsn: string): Promise<StudentRecord | null> {
    const usn = normalizeAndValidateUsn(rawUsn);
    const { apiUrl, apiKey } = this.ensureConfigured();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch(`${apiUrl}/api/v1/students/${encodeURIComponent(usn)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new CellsApiError(
          `Cells API responded with status ${response.status}`,
          response.status
        );
      }

      const data = (await response.json()) as {
        usn: string;
        name: string;
        department: string;
        year: number;
        email?: string;
      };

      return {
        usn: data.usn,
        name: data.name,
        department: data.department,
        year: data.year,
        email: data.email,
      };
    } catch (err: any) {
      if (err.name === "AbortError") {
        throw new CellsApiError("Cells API request timed out after 3000ms");
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Verifies student against VCET Cells API.
   * Privacy: Never logs USN to console.
   */
  async verifyStudent(rawUsn: string, email: string): Promise<boolean> {
    const student = await this.findByUsn(rawUsn);
    if (!student || !student.email) {
      return false;
    }
    return student.email.trim().toLowerCase() === email.trim().toLowerCase();
  }
}
