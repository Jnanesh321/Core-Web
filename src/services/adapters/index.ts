import { IStudentDirectoryService, StudentRecord } from "@/types/student-directory";
import { LocalDirectoryAdapter } from "./local-directory.adapter";
import { CellsStudentDirectory } from "./cells.adapter";

export * from "./local-directory.adapter";
export * from "./cells.adapter";

/**
 * Resilient proxy that invokes CellsStudentDirectory and transparently
 * falls back to LocalDirectoryAdapter on any network, timeout, or NotImplemented error.
 * Privacy: Never logs USN to console.
 */
export class ResilientCellsStudentDirectory implements IStudentDirectoryService {
  constructor(
    private primary: CellsStudentDirectory,
    private fallback: LocalDirectoryAdapter
  ) {}

  async findByUsn(usn: string): Promise<StudentRecord | null> {
    try {
      return await this.primary.findByUsn(usn);
    } catch (err) {
      console.warn(
        "[StudentDirectoryFactory] Primary Cells directory lookup failed; safely falling back to local directory."
      );
      return await this.fallback.findByUsn(usn);
    }
  }

  async verifyStudent(usn: string, email: string): Promise<boolean> {
    try {
      return await this.primary.verifyStudent(usn, email);
    } catch (err) {
      console.warn(
        "[StudentDirectoryFactory] Primary Cells verification failed; safely falling back to local directory."
      );
      return await this.fallback.verifyStudent(usn, email);
    }
  }
}

/**
 * Factory that instantiates the active student directory service.
 * - If CELLS_ENABLED === "true": uses CellsStudentDirectory wrapped with LocalDirectory fallback.
 * - Otherwise: directly returns LocalDirectoryAdapter.
 */
export function getStudentDirectory(options?: {
  cellsEnabled?: boolean;
  cellsApiUrl?: string;
  cellsApiKey?: string;
}): IStudentDirectoryService {
  const isCellsEnabled =
    options?.cellsEnabled ?? process.env.CELLS_ENABLED === "true";

  const localAdapter = new LocalDirectoryAdapter();

  if (!isCellsEnabled) {
    return localAdapter;
  }

  const cellsAdapter = new CellsStudentDirectory(
    options?.cellsApiUrl,
    options?.cellsApiKey
  );

  return new ResilientCellsStudentDirectory(cellsAdapter, localAdapter);
}
