import { RoleName } from "@prisma/client";

export type ExtendedRole = RoleName | "PUBLIC";

export const Roles = {
  PUBLIC: "PUBLIC" as const,
  STUDENT: RoleName.STUDENT,
  MEMBER: RoleName.MEMBER,
  EVENT_ORGANIZER: RoleName.EVENT_ORGANIZER,
  CONTENT_CONTRIBUTOR: RoleName.CONTENT_CONTRIBUTOR,
  ADMIN: RoleName.ADMIN,
  SUPER_ADMIN: RoleName.SUPER_ADMIN,
};
