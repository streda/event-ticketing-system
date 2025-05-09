# Development Journal - EventLite

**Fri Apr 25, 2025**

*   **Goal:** Setup basic auth-service backend.
*   Created project structure, initialized Git & npm for auth-service.
*   Setup Express server in `server.js`.
*   Implemented `/register`, `/login` controllers (hashing, JWT).
*   Configured PostgreSQL connection (`db/index.js`) using `pg`.
*   **Decision:** Using node-pg-migrate for schema management.
*   Created first migration for `auth_schema.users`.
*   **Problem:** Ran into `dotenv` loading issues, fixed by moving `import 'dotenv/config'` to top of `server.js`.
*   **Problem:** Debugged database connection success message showing `[default/unknown]`; fixed by adjusting logging in `server.js` start function.
*   **Status:** Auth service runs, connects to DB, migration applied. Ready for direct API testing.


**Thu May 1, 2025**

*   **Goal:** Test auth endpoints & build basic frontend auth UI.
*   Tested `/register` and `/login` successfully with Postman.
*   **Decision:** Switching frontend to TypeScript using Vite `react-ts` template for better type safety & job relevance.
*   Created the React frontend App using Vite and Implemented basic Login and Register Form, installed dependencies (React, Redux, MUI, Axios, Router).
*   Refactored my app (JS components/logic into new TS structure), renamed files to `.ts`/`.tsx`.
*   Added basic MUI components (`TextField`, `Button`) to `LoginForm.tsx` and `RegisterForm.tsx`.
*   **Problem:** Debugged `RegisterForm` not looking styled; fixed by correcting component rendering in `RegisterPage.tsx`.
*   **Status:** Basic Login/Register forms rendering with MUI. Next: Wire up Redux state & API calls.


**Fri May 2, 2025**
* **Goal:** Verifying API Calls & End-to-End Flow.
* **Start Backend:**  cd services/auth-service, `npm run build`, then `npm start` OR just `npm run dev` (this will use `nodemon` and will watch every changes)
* **Start Frontend:**  cd frontend, `npm run dev`
*   **Actions:**
    *   Started `auth-service` backend (`npm run dev`). Confirmed connection to `eventlite_db`.
    *   Started `frontend` dev server (`npm run dev`).
    *   Attempted user registration via the `/register` page UI.
    *   Attempted user login via the `/login` page UI after successful registration.
    *   Implemented and tested Logout functionality.
*   **Outcome/Issues & Fixes:**
    *   **Initial Issue:** Registration failed with backend error `error: relation "users" does not exist`.
    *   **Troubleshooting:**
        *   Confirmed via `psql` that `auth_schema.users` table *does* exist in `eventlite_db` and the migration was previously logged in `pgmigrations`.
        *   Confirmed `node-pg-migrate up` reported "No migrations to run!", verifying DB schema state.
        *   Re-checked `auth-service/src/controllers/authController.ts`. Found that the SQL queries (`SELECT` and `INSERT`) were missing the `auth_schema.` prefix, incorrectly querying for `users` instead of `auth_schema.users`.
    *   **Fix 1:** Added `auth_schema.` prefix to all table references in `authController.ts` queries. Registration API call now succeeds.
    *   **Issue 2:** After successful registration API call, the success message appeared on the frontend `/register` page, but the page did not redirect to `/login` after the timeout. Console showed "Registration successful, redirecting to login..." message from `useEffect`.
    *   **Troubleshooting:** Analyzed the `useEffect` hook in `RegisterPage.tsx`. Speculated that dispatching `resetAuthStatus()` immediately within the `if (status === 'succeeded'...)` block might interfere with the state condition needed for the `setTimeout` or subsequent navigation.
    *   **Fix 2:** Modified the `useEffect` hook in `RegisterPage.tsx` to ensure the `navigate('/login')` call within the `setTimeout` executes reliably before the status reset.  Called the `dispatch(resetAuthStatus());` after successful redirection, i.e  `navigate('/login');`. Redirection now works as expected.
    *   **Feature:** Implemented Logout: Added `logout` reducer to `authSlice.ts` (clearing state & localStorage). Added conditional logic and Logout button with dispatch handler to `NavBar.tsx`. Tested successfully - UI updates, token cleared, user navigated.
*   **Status:** Core authentication flow (Register -> Redirect -> Login -> Redirect -> Logout) is working end-to-end via the UI, communicating correctly with the `auth-service` backend. Ready to proceed to API Gateway implementation.

---

**Thu May 8, 2025 (Switching to Spring Boot for Backend)** 

*   **Goal:** Switch backend implementation from Node.js/TypeScript to Java/Spring Boot for `auth-service`. Setup initial Spring Boot project structure.
*   **Actions:**
    *   **Preserved Node.js Version:** Created a new branch `feature/node-backend` from `main` to archive the working (but with proxy issue) Node.js implementation. Pushed this branch to origin.
    *   **Switched to `main` Branch:** Ensured working branch is `main`.
    *   **Cleaned Up Node.js Services:** Removed tracked files for `auth-service`, `booking-service`, `event-service`, `notification-service`, `payment-service` from the `main` branch using `git rm -rf`. Manually deleted remaining untracked files (like `services/auth-service/src/models`). Committed the removal. Pushed the cleanup commit to `origin/main`.
    *   **Generated Spring Boot Project:** Used IntelliJ IDEA's Spring Initializr (which uses start.spring.io) to generate a new Gradle-based Spring Boot project for `auth-service`.
        *   **Configuration:** Java 17, Group: `com.eventlite`, Artifact: `auth-service`, Packaging: Jar.
        *   **Initial Dependencies:** Added `Spring Web`, `Spring Security`, `Spring Data JPA`, `PostgreSQL Driver`, `Lombok`, `Validation`. *(Self-correction: Initially forgot dependencies, added them manually to `build.gradle` and reloaded Gradle project).*
    *   **Project Placement:** Corrected initial nested directory structure. Moved the generated Spring Boot project files (`build.gradle`, `src/`, `gradlew`, etc.) directly into the `Event-Ticketing-System/services/auth-service/` directory.
    *   **Updated Root `.gitignore`:** Merged common Java/Gradle ignore patterns into the main project `.gitignore` file.
    *   **Configured IntelliJ:** Fixed "Invalid VCS root mapping" error by removing the incorrect parent directory mapping in IntelliJ's Version Control settings. Configured IntelliJ to recognize and use the installed JDK 17. Enabled Annotation Processing for Lombok.
    *   **Created `User` Entity:** Defined the `User.java` class in `src/main/java/com/eventlite/authservice/entity/` using JPA annotations (`@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column`) and Lombok (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`) to map to the existing `auth_schema.users` table (including the `name` column added previously). Ensured Java types match DB column types (e.g., `Integer` for `id`).
*   **Status:** Basic Spring Boot project structure for `auth-service` is created, configured with dependencies, placed correctly in the monorepo, and committed to the `main` branch. The `User` entity representing the database table is defined. Ready to implement the `UserRepository` interface.
*   **Next:** I will Create Spring Data JPA `UserRepository`.

---