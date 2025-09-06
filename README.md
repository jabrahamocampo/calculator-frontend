#  Full Stack Calculator Microservice Application 

This is the frontend of the Calculator application, built with React.js as a **Single Page Application (SPA)**.
## Production URL
The production application is live at: **https://calculator-seven-wine-91.vercel.app**

------------------------------------------------------------------
## Features Overview
## Frontend (React.js + Vite)
- Authentication & Authorization
   1. JWT login and registration.
   2. Global auth context (AuthContext) to persist sessions.
   3. Axios interceptor (useAxiosAuth) automatically attaching Authorization and correlationId headers.

- UI/UX
   1. Modern and responsive dashboard accessible on desktop, tablet, and mobile.
   2. Math operations form with real-time validations (positive/negative numbers, commas, decimals).
   3. UserRecordsTable to display operation history.
   4. Soft delete support, hiding records while preserving history.
   5. Instant feedback on errors and results.

- Developer Experience
   1. Vite for ultra-fast builds.
   2. Jest/Vitest for unit testing React components.
   3. Coverage reports on frontend code.
   4. Hot reload in development.

- Testing & QA
   1. Unit Tests: Validation of critical functions (auth.service, math logic, React components).
   2. Integration Tests: End-to-end flow between services (Auth ↔ Balance ↔ Operation ↔ Record).
   3. Smoke Tests: Basic validation of key endpoints after deployment.
   4. E2E Tests: Full simulation of user flow from frontend to backend with database.
   5. Coverage Reports: Ensuring high-quality, maintainable code.

- Infrastructure & DevOps
   1. Docker containerization for all services.
   2. Makefile for simplified build, run, and test commands.
   3. GitHub Actions (CI/CD) with:
   4. Unit, integration, and E2E test execution.
   5. Coverage artifact upload.
   6. README badges for CI and coverage status.
   7. Environment-specific variables for dev, test, and prod.

- AWS S3 Integration:
   1. Secure upload and retrieval of files using signed URLs.
   2. Direct communication between the backend and S3 bucket.
   3. Ensures scalable and reliable storage for user-related assets.

- Client Value
   1. Built with modern, scalable architecture aligned with industry standards.
   2. Robust security with JWT, password hashing, and account validation.
   3. Advanced observability with correlation IDs.
   4. Solid business workflow: authentication, operations execution, dynamic balance management, and historical records.
   5. Responsive and user-friendly frontend, optimized for all devices.
   6. Cloud-ready with Docker, CI/CD, and AWS S3 integration for file storage.

------------------------------------------------------------------

## How to Run Locally. Please refer to RUNBOOK.md file
## What is an SPA?
An SPA loads a single HTML page and dynamically updates the content without reloading the entire page.  
**Advantages:**  
- Faster and smoother user experience.  
- Less resource consumption by avoiding full page reloads.  
- Better real-time interaction.
## Technologies Used
React.js
Axios for backend calls
React Router for SPA navigation
Context API for state management

## Project Architecture 
┌─────────────┐     ┌───────────────┐     ┌──────────────────┐
│             │     │               │     │                  │
│   Frontend  │────>│  API Gateway  │────>│  Auth Service    │
│  (Vercel)   │     │  (Render)     │     │                  │
│             │     │               │     └──────────┬───────┘
└─────────────┘     └───────┬───────┘                │
                            │                        │
                            │───────────>┌─────-─────┴─────────┐
                            │            │  Balance Service    │
                            │            │                     │
                            │            └────────┬────────--──┘
                            │                     │
                            │───────────>┌────────┴──────────┐
                            │            │ Operation Service │
                            │            │                   │
                            │            └──────────┬────────┘
                            │                       │
                            └───────────>┌────---───┴────────┐
                                         │  Record Service   │
                                         │                   │
                                         └──────────┬────────┘
                                                    │
                                                    ▼
                                         ┌──────────────────┐
                                         │  PostgreSQL DB   │
                                         │  calculator_db   │
                                         └──────────────────┘



## Production URL
The application is deployed and available at:  
https://calculator-seven-wine-91.vercel.app/






