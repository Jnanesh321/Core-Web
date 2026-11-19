import { describe, it, expect } from "vitest";
import { RoleName } from "@prisma/client";
import {
  getImpliedRoles,
  hasRole,
  hasAnyRole,
  hasAllRoles,
} from "@/lib/permissions";

describe("RBAC Hierarchy & Permissions Logic", () => {
  describe("getImpliedRoles", () => {
    it("SUPER_ADMIN implies ADMIN and MEMBER", () => {
      const implied = getImpliedRoles([RoleName.SUPER_ADMIN]);
      expect(implied.has(RoleName.SUPER_ADMIN)).toBe(true);
      expect(implied.has(RoleName.ADMIN)).toBe(true);
      expect(implied.has(RoleName.MEMBER)).toBe(true);
      expect(implied.has(RoleName.STUDENT)).toBe(false);
    });

    it("ADMIN implies MEMBER but not SUPER_ADMIN", () => {
      const implied = getImpliedRoles([RoleName.ADMIN]);
      expect(implied.has(RoleName.ADMIN)).toBe(true);
      expect(implied.has(RoleName.MEMBER)).toBe(true);
      expect(implied.has(RoleName.SUPER_ADMIN)).toBe(false);
    });

    it("STUDENT does not imply MEMBER or ADMIN", () => {
      const implied = getImpliedRoles([RoleName.STUDENT]);
      expect(implied.has(RoleName.STUDENT)).toBe(true);
      expect(implied.has(RoleName.MEMBER)).toBe(false);
      expect(implied.has(RoleName.ADMIN)).toBe(false);
    });

    it("additive roles (EVENT_ORGANIZER) do not imply administrative ranks", () => {
      const implied = getImpliedRoles([RoleName.EVENT_ORGANIZER]);
      expect(implied.has(RoleName.EVENT_ORGANIZER)).toBe(true);
      expect(implied.has(RoleName.ADMIN)).toBe(false);
      expect(implied.has(RoleName.MEMBER)).toBe(false);
    });
  });

  describe("hasRole", () => {
    it("recognizes direct role assignment", () => {
      expect(hasRole([RoleName.STUDENT], RoleName.STUDENT)).toBe(true);
      expect(hasRole([RoleName.MEMBER], RoleName.MEMBER)).toBe(true);
    });

    it("evaluates hierarchical inheritance", () => {
      // SUPER_ADMIN has ADMIN role
      expect(hasRole([RoleName.SUPER_ADMIN], RoleName.ADMIN)).toBe(true);
      // SUPER_ADMIN has MEMBER role
      expect(hasRole([RoleName.SUPER_ADMIN], RoleName.MEMBER)).toBe(true);
      // ADMIN has MEMBER role
      expect(hasRole([RoleName.ADMIN], RoleName.MEMBER)).toBe(true);
      // MEMBER does NOT have ADMIN role
      expect(hasRole([RoleName.MEMBER], RoleName.ADMIN)).toBe(false);
      // STUDENT does NOT have MEMBER role
      expect(hasRole([RoleName.STUDENT], RoleName.MEMBER)).toBe(false);
    });
  });

  describe("hasAnyRole", () => {
    it("returns true if at least one role matches directly or hierarchically", () => {
      expect(
        hasAnyRole([RoleName.STUDENT], [RoleName.STUDENT, RoleName.ADMIN])
      ).toBe(true);

      // ADMIN matches MEMBER requirement through hierarchy
      expect(
        hasAnyRole([RoleName.ADMIN], [RoleName.MEMBER, RoleName.EVENT_ORGANIZER])
      ).toBe(true);

      expect(
        hasAnyRole([RoleName.STUDENT], [RoleName.ADMIN, RoleName.SUPER_ADMIN])
      ).toBe(false);
    });
  });

  describe("hasAllRoles", () => {
    it("returns true only if all required roles are met", () => {
      expect(
        hasAllRoles([RoleName.SUPER_ADMIN], [RoleName.ADMIN, RoleName.MEMBER])
      ).toBe(true);

      expect(
        hasAllRoles(
          [RoleName.ADMIN, RoleName.EVENT_ORGANIZER],
          [RoleName.ADMIN, RoleName.EVENT_ORGANIZER]
        )
      ).toBe(true);

      expect(
        hasAllRoles([RoleName.ADMIN], [RoleName.ADMIN, RoleName.EVENT_ORGANIZER])
      ).toBe(false);
    });
  });
});
