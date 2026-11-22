import { RoleName } from "@prisma/client";

/**
 * Role Hierarchy:
 * - SUPER_ADMIN implies ADMIN
 * - ADMIN implies MEMBER
 * - EVENT_ORGANIZER and CONTENT_CONTRIBUTOR are additive, contextual roles (not ranks)
 */
export function getImpliedRoles(assignedRoles: RoleName[]): Set<RoleName> {
  const effective = new Set<RoleName>(assignedRoles);

  if (effective.has(RoleName.SUPER_ADMIN)) {
    effective.add(RoleName.ADMIN);
  }

  if (effective.has(RoleName.ADMIN)) {
    effective.add(RoleName.MEMBER);
  }

  return effective;
}

/**
 * Checks if a user possessing `userRoles` satisfies `requiredRole` (including role hierarchy).
 */
export function hasRole(userRoles: RoleName[], requiredRole: RoleName): boolean {
  const effective = getImpliedRoles(userRoles);
  return effective.has(requiredRole);
}

/**
 * Checks if a user has at least one of the specified roles (or implied by hierarchy).
 */
export function hasAnyRole(userRoles: RoleName[], requiredRoles: RoleName[]): boolean {
  const effective = getImpliedRoles(userRoles);
  return requiredRoles.some((role) => effective.has(role));
}

/**
 * Checks if a user has all of the specified roles (or implied by hierarchy).
 */
export function hasAllRoles(userRoles: RoleName[], requiredRoles: RoleName[]): boolean {
  const effective = getImpliedRoles(userRoles);
  return requiredRoles.every((role) => effective.has(role));
}
