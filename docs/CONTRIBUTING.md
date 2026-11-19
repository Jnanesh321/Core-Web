# Contributing to CoRE Web

Welcome! **CoRE** (Center of Research and Excellence, VCET Puttur) is an open-source, community-driven platform. Our motto is **"Built by CoRE, for CoRE."**

This codebase is not only a functional platform—it is a showcase of our technical culture, engineering rigor, and collaborative spirit. Every commit, code review, and merged pull request is proof of the community's learning and growth.

---

## 👥 Team Structure & Mentorship

- **Team Lead:** Jnanesh
- **Frontend Co-Leads:** Madhura, Akshatha
- **Backend, Database, DevOps, QA & Media:** Community contributors & leads

### Contributing by Skill Level

| Level | Recommended Contributions |
|---|---|
| **Beginners (1st & 2nd Year)** | Content updates, README/documentation improvements, accessible UI components with defined specs, unit tests, bug reporting, media handling. Look for issues labeled `good first issue`. |
| **Intermediate** | Full pages, interactive forms, REST/Server Action endpoints with defined Zod schemas, Prisma queries, reviewing beginner pull requests. |
| **Advanced** | Core architecture, authentication & RBAC, CI/CD pipelines, performance optimization, mentoring, and security reviews. |

---

## 🛠️ Development Setup

### 1. Prerequisites
- **Node.js** (v18.x or v20.x LTS)
- **npm** (or pnpm / yarn)
- **Git**
- **PostgreSQL** instance (local, Docker, or managed like Supabase / Neon)

### 2. Fork and Clone
```bash
# Clone the repository
git clone https://github.com/core-vcet/Core-Web.git
cd Core-Web
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Environment Variables
```bash
cp .env.example .env
```
Update the `.env` file with your local database connection string and required secrets.

### 5. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Apply database migrations
npx prisma migrate dev
```

### 6. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌿 Git & Branching Workflow

We follow a structured Git branching strategy to keep `main` stable at all times.

### Branch Naming Conventions
- `feature/<short-description>`: New features (e.g., `feature/event-registration`, `feature/project-cards`)
- `fix/<short-description>`: Bug fixes (e.g., `fix/auth-cookie-expiry`, `fix/navbar-mobile-toggle`)
- `docs/<short-description>`: Documentation changes (e.g., `docs/api-guide`)
- `refactor/<short-description>`: Code restructuring without feature changes
- `chore/<short-description>`: Maintenance tasks and dependency updates

### Branching Commands
```bash
# Ensure your local main is up to date
git checkout main
git pull origin main

# Create a feature branch
git checkout -b feature/event-registration
```

---

## 📝 Commit Guidelines (Conventional Commits)

We enforce clear, descriptive commit messages adhering to the **Conventional Commits** specification:

```
<type>(<optional scope>): <short description in imperative mood>
```

### Common Types:
- `feat`: A new user-facing feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect code meaning (formatting, spacing)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Code changes improving performance
- `test`: Adding or correcting tests
- `chore`: Build process, dependencies, or tool configurations

### Examples:
- `feat(events): add CSV participant export for organizers`
- `fix(auth): handle expired session token redirect`
- `docs: update setup instructions in README.md`

---

## 🚀 Pull Request (PR) Process

1. **Keep PRs Focused:** Aim for small, single-purpose pull requests. Large, monolithic PRs take longer to review.
2. **Run Linting & Tests:**
   ```bash
   npm run lint
   npm run test # once tests are implemented
   ```
3. **Open a PR with Details:**
   - Clearly describe **what** was changed and **why**.
   - Attach before/after screenshots or screen recordings for UI changes.
   - Reference related issues using keywords (e.g., `Closes #12`).
4. **Code Review & Learning:**
   - At least one approval is required before merging.
   - Code reviews are a learning opportunity: communicate constructively, ask questions, and be respectful.
5. **No Direct Pushes to `main`:** All code lands on `main` through reviewed and approved Pull Requests.

---

## ✅ Definition of Done (DoD)

A contribution is ready for merge when:
- [ ] Code compiles without TypeScript errors.
- [ ] ESLint rules pass without warnings.
- [ ] Server endpoints and forms validate all input with Zod.
- [ ] UI is fully responsive across mobile (360px) and desktop devices.
- [ ] Accessibility standards (keyboard navigation, semantic tags, contrast) are upheld.
- [ ] Documentation or comments are added where complex logic exists.
- [ ] The PR has received review and approval.

---

## 📜 Audit Logging (`logAudit`) Guidelines

To ensure accountability and security across privileged actions, administrative handlers must log mutations using the `logAudit` service.

### When to call `logAudit`:
1. **Role Modifications:** Whenever assigning or removing user roles (`ROLE_ASSIGNED`, `ROLE_REMOVED`).
2. **Membership Applications:** When approving or rejecting student applications (`APPLICATION_APPROVED`, `APPLICATION_REJECTED`).
3. **Sensitive Exports:** When downloading or exporting event participant registries or membership CSVs (`REGISTRATIONS_EXPORTED`).
4. **Official Announcements:** When broadcasting or publishing system announcements (`ANNOUNCEMENT_PUBLISHED`).
5. **System Settings:** When altering global site configurations or keys (`SETTING_CHANGED`).

### Usage Example:
```typescript
import { logAudit } from "@/services/audit.service";
import { AuditActions } from "@/types/audit";

await logAudit({
  actorId: currentUser.id,
  action: AuditActions.APPLICATION_APPROVED,
  entity: "MembershipApplication",
  entityId: application.id,
  before: { status: application.status },
  after: { status: "APPROVED" },
  ip: req.headers.get("x-forwarded-for"),
});
```

> **Note:** `logAudit` automatically strips sensitive fields such as passwords, hashes, USNs, and phone numbers. It catches and handles its own errors so logging failures never break primary business logic.

---

Thank you for building CoRE! 🚀
