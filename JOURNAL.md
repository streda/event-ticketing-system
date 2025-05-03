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