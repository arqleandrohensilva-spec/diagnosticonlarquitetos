# Diagnostico NL

# AI Agent Prompt

Create this application called **Asset & Equipment Tracker**—an internal tool to log, assign, and track all company assets with condition notes, assignment history, and depreciation tracking. It is designed for internal operations, IT, or office management staff at a single organization. The primary user is someone responsible for managing company-owned equipment and licenses—likely an IT manager, office manager, or COO. They need a simple, reliable way to see everything the company owns, who has it, and what it's worth—without relying on spreadsheets. The main user action is to log assets, assign them to employees, track condition and location, and view depreciation over time.

This application should deliver a lightweight, data-dense internal dashboard that becomes the organization's single source of truth for asset management. The backend should leverage **Supabase** for authentication (simple email/password for internal staff), a relational database (PostgreSQL) to store assets, assignments, employees, and depreciation history, and file storage for optional asset photos. The MVP focuses on three core pillars: asset logging with essential metadata, timestamped assignment tracking with full history, and automatic straight-line depreciation calculation. The UI should follow a clean, professional aesthetic inspired by Linear, Notion, and Retool—neutral blues and slate grays with teal or indigo accents for CTAs, emphasizing data clarity and fast data entry over visual flourish.

The V2 roadmap includes barcode/QR scanning for rapid asset lookup, maintenance and warranty tracking with expiration alerts, bulk CSV import, role-based access control (read-only vs. admin), and an employee-facing view so staff can see what's assigned to them. The initial deployment should be fully functional within 2–3 weeks, with the post-signup flow guiding admins through a simple 3–5 step onboarding (add categories, add employees, log first asset) so the tool is immediately useful. All data is internal to the organization; no multi-tenant complexity or public-facing features are required at launch.

---

## Project Overview

**Asset & Equipment Tracker** is a single-organization internal tool built to replace spreadsheet-based asset management with a centralized, reliable database and dashboard. The application serves a small, focused user group (IT/ops staff at one company) and prioritizes operational clarity, fast data entry, and accurate financial reporting over feature breadth.

**Key Goals:**
- Provide a single source of truth for all company-owned assets (hardware, furniture, software licenses, etc.)
- Eliminate manual tracking, duplicate purchases, and lost equipment through clear assignment and condition history
- Automatically calculate asset depreciation for financial reporting and budgeting
- Enable rapid onboarding of new assets and quick lookup of existing inventory
- Support future expansion into barcode scanning, maintenance logging, and employee-facing views

**Technology Stack:**
- **Frontend:** React with TypeScript, Tailwind CSS for styling, React Router for navigation
- **Backend:** Supabase (PostgreSQL database, built-in auth, real-time subscriptions, file storage)
- **Hosting:** Vercel (frontend), Supabase Cloud (backend)
- **Authentication:** Supabase Auth (email/password, admin-controlled access)
- **Data Export:** CSV export for reports and integrations

---

## Core Functionality

### 1. Asset Management
- **Create Assets:** Add new assets with fields: name, category, serial/ID number, purchase date, purchase cost, current condition, location, and optional notes.
- **Edit Assets:** Update any asset field (condition, location, cost adjustments, notes) with a timestamp of who made the change and when.
- **View Assets:** Browse all assets in a searchable, filterable table with columns for name, category, assignee, condition, location, purchase date, and current depreciated value.
- **Asset Detail Page:** Full profile view showing specs, condition history, assignment timeline, depreciation curve, and optional photo attachments.
- **Delete/Archive Assets:** Soft-delete or archive retired assets so they remain in historical records but don't clutter active inventory.

### 2. Assignment Tracking
- **Assign Assets:** Assign any asset to an employee or department with a timestamp and optional notes (e.g., "assigned during onboarding").
- **Assignment History:** View a complete timeline of who held each asset and when, including return dates and notes. This is the core differentiator from spreadsheets.
- **Unassign Assets:** Return assets to "unassigned" status with a timestamp, triggering optional notifications (future feature).
- **Bulk Assignment:** Assign multiple assets to a single employee in one action.

### 3. Depreciation Calculation
- **Straight-Line Depreciation (Default):** Automatically calculate current asset value based on purchase price, purchase date, and a configurable useful life (e.g., 3 years for laptops, 5 years for furniture).
- **Depreciation Timeline:** Display a visual timeline or table showing asset value over time from purchase to full depreciation.
- **Configurable Methods:** Settings allow admins to adjust depreciation method (straight-line vs. future options like declining balance) and useful life by category.
- **Financial Reporting:** Export total asset value, depreciation by category, and depreciation expense for accounting purposes.

### 4. Dashboard & Reporting
- **Dashboard Summary:** Key metrics at a glance—total assets, assigned vs. unassigned count, total asset value, total depreciation, and status breakdown (Excellent/Good/Fair/Poor/Retired).
- **Asset List View:** Searchable, filterable table with sorting by any column. Filters include category, assignee, condition, location, and date range.
- **Reports:** Pre-built reports (by category, by department, by condition) with export to CSV.
- **Search:** Fast, full-text search across asset names, serial numbers, and assignee names.

### 5. Configuration & Setup
- **Categories:** Admin-managed list of asset types (Hardware, Furniture, Software Licenses, etc.) with optional depreciation defaults per category.
- **Employees/Assignees:** Simple list of people assets can be assigned to, with name, department, and email. Not a full HR module—just enough to support assignments.
- **Depreciation Settings:** Configure default useful life by category, choose depreciation method, and set residual value percentage.
- **User Management:** Admin controls who can access the tool (future: role-based access for read-only vs. admin).

---

## User Journey

### Post-Signup Flow (First-Time Admin Setup)
1. **Admin Account Created:** Admin logs in with email/password (Supabase Auth).
2. **Onboarding Checklist:** Dashboard shows a 3–5 step guided setup:
   - Step 1: Add asset categories (Hardware, Furniture, Licenses, etc.)
   - Step 2: Add employees/assignees (bulk import or manual entry)
   - Step 3: Log first asset (walk through the asset form)
   - Step 4: Assign the asset to an employee
   - Step 5: View the dashboard and first reports
3. **Completion:** Checklist marks items as complete; dashboard becomes the main view once setup is done.

### Ongoing User Workflows

**Workflow A: Logging a New Asset**
1. Click "Add Asset" button on Dashboard or Asset List.
2. Fill out form: name, category, serial number, purchase date, cost, condition, location.
3. Click "Save" → asset appears in list and is available for assignment.
4. (Optional) Upload a photo of the asset.

**Workflow B: Assigning an Asset**
1. Open Asset Detail page or select asset from list.
2. Click "Assign" button.
3. Select employee from dropdown, add optional notes (e.g., "onboarding"), confirm.
4. Assignment is timestamped and added to history.

**Workflow C: Updating Asset Condition or Location**
1. Open Asset Detail page.
2. Click "Edit" on condition or location field.
3. Update value, add optional note (e.g., "screen cracked, still functional").
4. Save → change is timestamped and logged.

**Workflow D: Viewing Assignment History**
1. Open Asset Detail page.
2. Scroll to "Assignment History" section.
3. See timeline: "Assigned to John Doe on Jan 15, 2024 → Returned on Mar 20, 2024 → Assigned to Jane Smith on Mar 20, 2024."

**Workflow E: Checking Depreciation**
1. Open Asset Detail page.
2. View "Depreciation" section showing purchase price, purchase date, useful life, and current value.
3. (Optional) View depreciation curve chart showing value over time.

**Workflow F: Searching and Filtering**
1. Go to Asset List.
2. Use search bar to find asset by name or serial number.
3. Use filter dropdowns for category, assignee, condition, location, or date range.
4. Results update in real-time.

**Workflow G: Exporting Reports**
1. Go to Reports page.
2. Select report type (by category, by department, by condition).
3. Click "Export as CSV" → file downloads.

---

## Technical Requirements

### Frontend Architecture
- **Framework:** React 18+ with TypeScript
- **State Management:** TanStack Query (React Query) for server state, Zustand or Context API for local UI state
- **Styling:** Tailwind CSS with custom configuration for brand colors (blues, slate grays, teal/indigo accents)
- **Routing:** React Router v6 for navigation between pages
- **UI Components:** Headless UI or Radix UI for accessible, unstyled components; custom styling with Tailwind
- **Forms:** React Hook Form with Zod for validation
- **Tables:** TanStack Table (React Table) for searchable, filterable, sortable asset list
- **Charts:** Recharts for depreciation timeline visualization
- **Date Handling:** date-fns for date formatting and calculations
- **HTTP Client:** Supabase JS client for API calls and real-time subscriptions

### Backend Architecture (Supabase)
- **Database:** PostgreSQL with the following core tables:
  - `assets` (id, name, category_id, serial_number, purchase_date, purchase_cost, condition, location, created_at, updated_at, created_by)
  - `asset_assignments` (id, asset_id, employee_id, assigned_date, returned_date, notes, created_at)
  - `employees` (id, name, department, email, created_at)
  - `asset_categories` (id, name, default_useful_life_years, created_at)
  - `depreciation_settings` (id, method, residual_value_percent, created_at, updated_at)
  - `users` (id, email, role, created_at) — managed by Supabase Auth
  - `asset_photos` (id, asset_id, photo_url, uploaded_at) — optional, for future photo support

- **Authentication:** Supabase Auth with email/password. Admin creates accounts for team members; no public sign-up.
- **Row-Level Security (RLS):** All tables protected by RLS policies. Users can only view/edit data for their organization (single-tenant, so all users belong to one org).
- **File Storage:** Supabase Storage bucket for asset photos (optional at MVP, required for future photo feature).
- **Real-Time:** Supabase Realtime subscriptions for live updates when assets are added/edited (optional at MVP, useful for multi-user scenarios).

### Data Validation & Business Logic
- **Asset Creation:** Validate required fields (name, category, purchase date, cost). Serial number should be unique per asset.
- **Assignment Logic:** Prevent assigning an asset that's already assigned (unless previous assignment is returned). Validate employee exists.
- **Depreciation Calculation:** 
  - Formula: `Current Value = Purchase Cost × (1 - (Days Since Purchase / (Useful Life in Days)))`
  - Minimum value: residual value (default 0%, configurable).
  - Recalculate on every asset view or via scheduled job.
- **Condition Scale:** Fixed enum (Excellent, Good, Fair, Poor, Retired).
- **Timestamps:** All changes (asset creation, updates, assignments) are timestamped with user who made the change.

### Performance & Scalability
- **Database Indexing:** Index on `asset_id`, `employee_id`, `category_id`, `condition`, `location` for fast filtering.
- **Pagination:** Asset list uses pagination (50 items per page) to avoid loading thousands of records at once.
- **Lazy Loading:** Asset detail page loads assignment history and depreciation data on demand.
- **Caching:** TanStack Query caches asset list and detail data; invalidate on mutations.
- **Search Optimization:** Full-text search on asset name and serial number (PostgreSQL `tsvector` for future optimization).

### Security
- **Authentication:** Supabase Auth handles session management and token refresh.
- **Authorization:** RLS policies enforce that users can only access their organization's data.
- **HTTPS:** All traffic encrypted in transit.
- **CORS:** Supabase handles CORS; frontend only communicates with Supabase endpoints.
- **Input Sanitization:** React Hook Form and Zod validate and sanitize all inputs.
- **Audit Trail:** All changes logged with timestamp and user ID for compliance.

---

## API Integrations

### At MVP Launch
**No third-party API integrations required.** The application is self-contained within Supabase.

### Future Integrations (V2+)
- **Barcode/QR Code Generation:** Integrate with a barcode library (e.g., jsbarcode) to generate QR codes for assets; scan via device camera or barcode scanner.
- **Email Notifications:** Integrate with SendGrid or Supabase Functions to send notifications for overdue returns, upcoming warranty expirations, or maintenance reminders.
- **Slack Notifications:** Post asset alerts to a Slack channel (e.g., "Asset XYZ overdue from John Doe").
- **Google Sheets Export:** Allow direct export to Google Sheets for real-time collaboration with finance/accounting teams.
- **HR System Integration:** Connect to Workday, BambooHR, or similar to auto-sync employee list and department info.
- **Accounting Software:** Export depreciation data to QuickBooks or Xero for financial reporting.

---

## Real-Time Features

### At MVP Launch
**No real-time features required.** The tool is primarily used by a small ops team; eventual consistency (page refresh) is acceptable.

### Future Real-Time Enhancements (V2+)
- **Live Asset Updates:** When one admin edits an asset, other admins viewing the same asset see updates in real-time via Supabase Realtime subscriptions.
- **Assignment Notifications:** When an asset is assigned or returned, notify the assigned employee (if employee-facing view is added).
- **Dashboard Metrics:** Real-time update of total asset value and depreciation as new assets are added.
- **Concurrent Edit Warnings:** If two admins try to edit the same asset simultaneously, show a warning and prevent conflicts.

---

## Implementation Details

### Phase 1: MVP (Weeks 1–3)
**Goal:** Deliver a functional, single-organization asset tracker with core logging, assignment, and depreciation features.

**Week 1: Setup & Core Data Model**
- Set up Supabase project with PostgreSQL database.
- Create tables: `assets`, `asset_assignments`, `employees`, `asset_categories`, `depreciation_settings`, `users`.
- Implement Supabase Auth (email/password).
- Set up RLS policies for single-tenant access.
- Create React project with Tailwind CSS and routing.
- Build authentication flow (login, logout, admin account creation).

**Week 2: Core Features**
- **Asset Management:** Build asset list, detail page, add/edit forms. Implement search and filtering.
- **Assignment Tracking:** Build assignment form, assignment history view, unassign functionality.
- **Depreciation:** Implement depreciation calculation logic and display on asset detail page.
- **Dashboard:** Build summary metrics (total assets, assigned/unassigned, total value, depreciation).

**Week 3: Polish & Onboarding**
- **Onboarding Checklist:** Build guided setup flow for first-time admins.
- **Reports:** Build basic CSV export for asset list and depreciation summary.
- **UI Polish:** Refine styling, ensure responsive design, test accessibility.
- **Testing:** Unit tests for depreciation logic, integration tests for asset CRUD, end-to-end tests for key workflows.
- **Deployment:** Deploy to Vercel (frontend) and Supabase Cloud (backend).

### Phase 2: V2 (Post-MVP, Weeks 4–8)
- Barcode/QR code generation and scanning.
- Maintenance log and warranty tracking.
- Bulk CSV import for initial asset data.
- Role-based access control (read-only vs. admin).
- Employee-facing view ("My Assets").
- Photo attachments per asset.
- Email notifications for overdue returns and warranty expirations.
- Advanced depreciation methods (declining balance, etc.).

### Development Workflow
- **Version Control:** Git with GitHub; main branch for production, develop branch for features.
- **Branching:** Feature branches for each user story (e.g., `feature/asset-logging`, `feature/assignment-tracking`).
- **Code Review:** Pull requests reviewed by at least one other developer before merge.
- **Testing:** Write tests as features are built; aim for 80%+ code coverage on business logic.
- **Deployment:** Automated CI/CD pipeline (GitHub Actions) to run tests and deploy to Vercel on merge to main.

### Database Migrations
- Use Supabase's migration tools or Flyway for version control of schema changes.
- Test migrations in a staging environment before applying to production.
- Keep migration history for audit and rollback purposes.

---

## MVP Features

### 1. Asset Logging ✓
- Add new assets with: name, category, serial/ID, purchase date, purchase cost, condition (Excellent/Good/Fair/Poor/Retired), location, and optional notes.
- Edit any asset field with timestamp of change.
- Soft-delete or archive retired assets.
- View all assets in a searchable, filterable table.

### 2. Assignment Tracking ✓
- Assign assets to employees with timestamp and optional notes.
- View full assignment history for each asset (who had it, when, return date).
- Unassign assets (return to unassigned status).
- Bulk assign multiple assets to one employee.

### 3. Depreciation Calculator ✓
- Automatically calculate current asset value using straight-line depreciation.
- Display depreciation on asset detail page (purchase price, purchase date, useful life, current value).
- Configurable useful life by category (default: 3 years for hardware, 5 years for furniture, etc.).
- Export depreciation summary to CSV.

### 4. Dashboard ✓
- Summary metrics: total assets, assigned vs. unassigned, total asset value, total depreciation, condition breakdown.
- Quick links to add asset, view asset list, view reports.
- Onboarding checklist for first-time setup.

### 5. Asset List & Search ✓
- Searchable, filterable table of all assets.
- Filters: category, assignee, condition, location, date range.
- Sorting by any column.
- Pagination (50 items per page).

### 6. Asset Detail Page ✓
- Full profile: name, category, serial number, purchase date, cost, condition, location, notes.
- Assignment history timeline.
- Depreciation details and curve (optional chart).
- Edit and delete actions.

### 7. Configuration ✓
- **Categories:** Admin can add/edit asset categories (Hardware, Furniture, Licenses, etc.).
- **Employees:** Admin can add/edit employee list (name, department, email).
- **Depreciation Settings:** Admin can configure default useful life by category and depreciation method.

### 8. Authentication & Access Control ✓
- Email/password login via Supabase Auth.
- Admin account creation (no public sign-up).
- Simple role: admin (full access) or future read-only user.

### 9. Reports & Export ✓
- Export asset list as CSV.
- Export depreciation summary as CSV.
- Pre-built reports by category, by department, by condition.

---

## Future Features

### Phase 2 (V2) — Barcode & Scanning
- Generate QR codes for each asset (display on asset detail page, print labels).
- Barcode scanner integration (via device camera or USB barcode scanner).
- Quick asset lookup by scanning QR code.
- Check-in/check-out workflow: scan asset, select employee, confirm assignment.

### Phase 2 (V2) — Maintenance & Warranty Tracking
- Add maintenance log per asset (service date, type, cost, notes).
- Track warranty and contract expiration dates.
- Alert admins when warranty is expiring (email notification).
- Schedule maintenance reminders.

### Phase 2 (V2) — Bulk Import
- CSV upload to bulk import assets (name, category, serial, purchase date, cost, condition, location).
- CSV upload to bulk import employees.
- Validation and error reporting during import.

### Phase 2 (V2) — Role-Based Access Control
- Admin role: full access to all features.
- Read-only role: view assets and reports, but cannot edit or delete.
- Manager role: manage assets in their department only (future).

### Phase 2 (V2) — Employee-Facing View
- Employees can log in and see assets assigned to them.
- Request asset checkout (future workflow).
- Confirm receipt of assigned asset.
- Report asset issues or damage.

### Phase 2 (V2) — Photo Attachments
- Upload photos of assets (condition, serial number, etc.).
- Gallery view on asset detail page.
- Photo storage in Supabase Storage.

### Phase 2 (V2) — Notifications
- Email alerts for overdue returns (if asset not returned by expected date).
- Warranty expiration alerts.
- Maintenance due reminders.
- Slack integration for team notifications.

### Phase 3 (V3) — Advanced Features
- Depreciation methods: declining balance, units of production.
- Asset lifecycle tracking: purchase → in-use → maintenance → retired.
- Audit trail: view all changes to an asset with user and timestamp.
- Custom fields: allow admins to add custom fields per category (e.g., "GPU type" for laptops).
- Multi-location support: track assets across multiple office locations.
- Lease vs. purchase tracking: differentiate owned vs. leased assets.
- Integration with HR system (auto-sync employees).
- Integration with accounting software (export depreciation to QuickBooks).

---

## User Experience Guidelines

### Design Principles
1. **Clarity Over Aesthetics:** Data should be easy to scan and understand. Use clear typography, ample whitespace, and logical grouping.
2. **Speed of Data Entry:** Forms should be fast to fill out. Use smart defaults, auto-complete for employee names, and inline validation.
3. **Single Source of Truth:** Every asset and assignment should have one canonical view. No conflicting information.
4. **Minimal Cognitive Load:** Avoid jargon. Use simple, consistent language. Depreciation calculations should be transparent and explainable.
5. **Accessibility:** WCAG 2.1 AA compliance. Keyboard navigation, screen reader support, sufficient color contrast.

### Visual Design
- **Color Palette:**
  - Primary: Slate gray (#475569) and neutral blue (#1e40af)
  - Accent: Teal (#0d9488) for CTAs and status indicators
  - Background: White (#ffffff) with subtle gray (#f8fafc) for secondary areas
  - Text: Dark gray (#1f2937) for body, slate (#64748b) for secondary text
  - Status Colors: Green (Excellent), Blue (Good), Orange (Fair), Red (Poor), Gray (Retired)

- **Typography:**
  - Headings: Inter or system font, bold, 24px (h1), 20px (h2), 16px (h3)
  - Body: Inter or system font, regular, 14px
  - Monospace: Courier for serial numbers and IDs

- **Spacing:** 8px base unit. Use 8px, 16px, 24px, 32px for margins and padding.

- **Buttons:**
  - Primary CTA: Teal background, white text, 16px padding, rounded corners (4px)
  - Secondary: White background, slate border, slate text
  - Danger: Red background, white text (for delete actions)
  - Disabled: Gray background, gray text, cursor not-allowed

- **Tables:**
  - Zebra striping (alternating row colors) for readability
  - Hover state: light gray background
  - Sortable column headers with up/down arrow indicators
  - Sticky header on scroll

- **Forms:**
  - Labels above inputs
  - Inline validation (red text below field if error)
  - Clear placeholder text
  - Required field indicator (red asterisk)
  - Submit button at bottom, right-aligned

- **Cards:**
  - White background, subtle shadow (0 1px 3px rgba(0,0,0,0.1))
  - Rounded corners (6px)
  - Padding: 16px or 24px
  - Used for dashboard metrics, asset summary, assignment history

### Layout
- **Dashboard:** 3-column layout on desktop, 1-column on mobile. Left sidebar for navigation, main content area for metrics and quick actions.
- **Asset List:** Full-width table with sticky header. Filters in a collapsible sidebar or above table.
- **Asset Detail:** 2-column layout (left: asset info, right: assignment history and depreciation). Stack on mobile.
- **Forms:** Centered, max-width 600px. Clear section headings for multi-step forms.

### Interactions
- **Search:** Real-time filtering as user types (debounced 300ms).
- **Filtering:** Checkboxes or dropdowns for filters. Show active filter count. "Clear all filters" button.
- **Pagination:** Show current page, total items, and page size selector. "Previous" and "Next" buttons.
- **Modals:** Confirm destructive actions (delete asset) with modal dialog.
- **Notifications:** Toast notifications for success (green), error (red), or info (blue) messages. Auto-dismiss after 4 seconds.
- **Loading States:** Skeleton loaders for tables and detail pages. Spinner for form submission.
- **Hover States:** Subtle background color change on interactive elements.

### Responsive Design
- **Desktop (1024px+):** Full layout with sidebars and multi-column views.
- **Tablet (768px–1023px):** Collapsible sidebar, single-column tables with horizontal scroll.
- **Mobile (< 768px):** Full-width single-column layout. Bottom navigation or hamburger menu. Simplified forms (one field per row).

### Accessibility
- **Keyboard Navigation:** All interactive elements accessible via Tab key. Logical tab order.
- **Screen Readers:** Semantic HTML (buttons, links, form labels). ARIA labels for icons and complex components.
- **Color Contrast:** All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text).
- **Focus Indicators:** Visible focus ring on all interactive elements.
- **Form Validation:** Error messages associated with form fields via `aria-describedby`.
- **Images & Icons:** Alt text for all images. Icon-only buttons have `aria-label`.

### Onboarding
- **First-Time Setup:** Guided checklist (3–5 steps) on dashboard. Each step has a clear CTA and explanation.
- **Empty States:** When no assets exist, show a friendly message with a link to add the first asset.
- **Help Text:** Inline help icons (?) with tooltips explaining fields like "useful life" and "depreciation method".
- **Tooltips:** Hover tooltips for complex fields (e.g., "Straight-line depreciation divides the asset cost evenly over its useful life").

---

## Code Quality Standards

### General Principles
- **Readability:** Code should be self-documenting. Use clear variable and function names. Avoid abbreviations unless widely understood.
- **DRY (Don't Repeat Yourself):** Extract reusable components, hooks, and utilities. Avoid code duplication.
- **SOLID Principles:** Single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion.
- **Type Safety:** Use TypeScript strictly. No `any` types unless absolutely necessary (and documented with comments).

### React & TypeScript
- **Components:** Functional components with hooks. Use `React.FC<Props>` for type safety.
- **Props:** Define prop types with TypeScript interfaces. Use `React.ReactNode` for children.
- **State Management:** Use TanStack Query for server state, Zustand or Context API for UI state. Avoid prop drilling.
- **Hooks:** Extract custom hooks for reusable logic (e.g., `useAssets`, `useDepreciation`).
- **Memoization:** Use `React.memo` for expensive components. Use `useMemo` and `useCallback` judiciously (measure before optimizing).
- **Error Boundaries:** Implement error boundaries for graceful error handling.

### File Structure
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Buttons, modals, cards, etc.
│   ├── layout/         # Header, sidebar, footer
│   └── features/       # Feature-specific components (AssetList, AssetForm, etc.)
├── pages/              # Page components (Dashboard, AssetList, AssetDetail, etc.)
├── hooks/              # Custom React hooks
├── services/           # API calls, business logic
├── utils/              # Utility functions (formatting, validation, etc.)
├── types/              # TypeScript types and interfaces
├── styles/             # Global styles, Tailwind config
├── context/            # Context providers
└── App.tsx             # Root component
```

### Naming Conventions
- **Components:** PascalCase (e.g., `AssetList`, `AssetForm`)
- **Files:** kebab-case for files (e.g., `asset-list.tsx`, `use-assets.ts`)
- **Variables & Functions:** camelCase (e.g., `currentValue`, `calculateDepreciation`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `DEFAULT_USEFUL_LIFE`, `CONDITION_SCALE`)
- **Types/Interfaces:** PascalCase with `I` prefix for interfaces (optional, but consistent) (e.g., `Asset`, `IAssetFormProps`)

### Testing
- **Unit Tests:** Test utility functions, custom hooks, and business logic. Use Jest and React Testing Library.
- **Integration Tests:** Test component interactions and API calls. Mock Supabase with `@supabase/supabase-js` mocks.
- **E2E Tests:** Test critical user workflows (login, add asset, assign asset, view depreciation) with Playwright or Cypress.
- **Coverage:** Aim for 80%+ coverage on business logic. 60%+ on UI components.
- **Test File Naming:** `*.test.ts` or `*.test.tsx` in same directory as source file.

### Linting & Formatting
- **ESLint:** Use ESLint with React and TypeScript plugins. Enforce consistent code style.
- **Prettier:** Auto-format code on save. Config in `.prettierrc`.
- **Pre-Commit Hooks:** Use Husky to run linting and tests before commit.
- **CI/CD:** GitHub Actions to run linting, tests, and build on every PR.

### Documentation
- **Code Comments:** Comment complex logic, business rules, and non-obvious decisions. Avoid obvious comments.
- **JSDoc:** Document functions with JSDoc comments (parameters, return type, example usage).
- **README:** Document setup, development workflow, deployment, and architecture decisions.
- **API Documentation:** Document Supabase schema, RLS policies, and custom functions.

### Performance
- **Bundle Size:** Monitor bundle size with `webpack-bundle-analyzer`. Keep under 200KB gzipped for initial load.
- **Lazy Loading:** Code-split pages with `React.lazy` and `Suspense`.
- **Image Optimization:** Use `next/image` or similar for responsive image loading (if using Next.js).
- **Database Queries:** Use indexes, pagination, and lazy loading to avoid N+1 queries.
- **Caching:** Use TanStack Query to cache API responses and reduce unnecessary requests.

### Security
- **Input Validation:** Validate and sanitize all user inputs with Zod or similar.
- **X

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://diagnosticonlarquitetos.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8a4511c9-335b-4a90-be8c-4e8fd1ac5940).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
