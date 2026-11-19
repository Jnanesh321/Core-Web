# Role-Based Access Control (RBAC) Specification

> **Platform:** CoRE Web  
> **Source:** PRD Section 3 (User Types & Roles) & Section 18 (Admin Dashboard)

---

## 🛡️ Role Definitions

| Role | Scope & Type | Description |
|---|---|---|
| `PUBLIC` | Implicit (Unauthenticated) | Can browse all public showcases, project portfolios, upcoming events, achievements, and gallery albums. |
| `STUDENT` | Authenticated (Base) | Default authenticated role for VCET students. Can submit a membership application and register for events. |
| `MEMBER` | Authenticated (Tier 1) | Approved CoRE member. Can curate their public profile, add/edit own project submissions, and track participation history. |
| `EVENT_ORGANIZER` | Additive Contextual | Assigned to specific events. Can manage schedules, rulebooks, attendee lists, attendance marking, and event announcements. |
| `CONTENT_CONTRIBUTOR`| Additive Contextual | Assists with media and communication. Can manage gallery albums, media uploads, and platform announcements. |
| `ADMIN` | Privileged Management | Core team lead / faculty coordinator. Can review membership applications, moderate all projects, events, and achievements, and assign non-super-admin roles. |
| `SUPER_ADMIN` | Root System Authority | Full platform ownership: manage site settings, inspect immutable audit logs, grant admin roles, and perform emergency data deletions/exports. |

---

## 📈 Role Hierarchy & Implication Rules

```
SUPER_ADMIN
    │
    ▼ (implies)
  ADMIN
    │
    ▼ (implies)
  MEMBER
```

- **Hierarchy inheritance:**
  - `SUPER_ADMIN` inherits all capabilities of `ADMIN` and `MEMBER`.
  - `ADMIN` inherits all read/write capabilities of `MEMBER`.
- **Additive roles:**
  - `EVENT_ORGANIZER` and `CONTENT_CONTRIBUTOR` are additive contextual roles rather than vertical ranks. They grant scoped permissions to specific events or content subsystems.

---

## 🔐 Permissions Matrix

| Capability / Resource | PUBLIC | STUDENT | MEMBER | EVENT_ORGANIZER | CONTENT_CONTRIBUTOR | ADMIN | SUPER_ADMIN |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Browse public showcase | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Submit Membership Application | ❌ | ✅ | ❌ (Already Member) | ❌ | ❌ | ❌ | ❌ |
| Register for Events | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Own Member Profile | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create / Edit Own Projects | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Assigned Event & Attendance | ❌ | ❌ | ❌ | ✅ (Assigned) | ❌ | ✅ (All) | ✅ (All) |
| Manage Gallery & Announcements | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Review Membership Applications | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Moderate All Projects / Events | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Assign Roles | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (up to Admin) | ✅ (All) |
| Read System Audit Logs | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Modify System Settings | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## ⚙️ Guard Functions in Code

Server-side guards enforce default-deny security:

```typescript
import { requireAuth, requireRole, requireAnyRole, requireEventOrganizer, requireOwnerOrAdmin } from "@/lib/auth";
import { RoleName } from "@prisma/client";

// Require a specific role (with hierarchy inheritance)
const adminUser = await requireRole(RoleName.ADMIN);

// Require at least one matching role
const staffUser = await requireAnyRole(RoleName.ADMIN, RoleName.CONTENT_CONTRIBUTOR);

// Require event organizer or ADMIN+
const organizerUser = await requireEventOrganizer(eventId);

// Require owner or ADMIN+
const authorUser = await requireOwnerOrAdmin(resource.authorId);
```
