import { PrismaClient, RoleName } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedRoles() {
  const roles: { name: RoleName; description: string }[] = [
    { name: RoleName.STUDENT, description: "VCET student with platform access and registration capabilities" },
    { name: RoleName.MEMBER, description: "Approved CoRE member with profile and project portfolio rights" },
    { name: RoleName.EVENT_ORGANIZER, description: "Organizes and manages designated events, schedules, and attendees" },
    { name: RoleName.CONTENT_CONTRIBUTOR, description: "Manages announcements, gallery albums, and public showcases" },
    { name: RoleName.ADMIN, description: "Platform administrator with moderation and user management rights" },
    { name: RoleName.SUPER_ADMIN, description: "Full system administration, audit access, and privileged role grants" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: { name: role.name, description: role.description },
    });
  }
}

async function main() {
  await seedRoles();
}

if (process.env.NODE_ENV !== "test") {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
