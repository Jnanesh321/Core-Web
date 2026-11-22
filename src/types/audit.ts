import { z } from "zod";

export const AuditActions = {
  ROLE_ASSIGNED: "ROLE_ASSIGNED",
  ROLE_REMOVED: "ROLE_REMOVED",
  APPLICATION_APPROVED: "APPLICATION_APPROVED",
  APPLICATION_REJECTED: "APPLICATION_REJECTED",
  REGISTRATIONS_EXPORTED: "REGISTRATIONS_EXPORTED",
  ANNOUNCEMENT_PUBLISHED: "ANNOUNCEMENT_PUBLISHED",
  SETTING_CHANGED: "SETTING_CHANGED",
} as const;

export type AuditAction = (typeof AuditActions)[keyof typeof AuditActions];

export interface LogAuditInput {
  actorId?: string | null;
  action: AuditAction | string;
  entity: string;
  entityId?: string | null;
  before?: unknown;
  after?: unknown;
  ip?: string | null;
  userAgent?: string | null;
}

export const auditLogsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 25))
    .pipe(
      z
        .number({ invalid_type_error: "Limit must be a valid number" })
        .int("Limit must be an integer")
        .min(1, "Limit must be at least 1")
        .max(100, "Limit cannot exceed 100")
    ),
});

export type AuditLogsQuery = z.infer<typeof auditLogsQuerySchema>;
