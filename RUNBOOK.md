# Runbook - Full Stack Calculator Microservices Application

## With this runbook, developers can confidently configure, run, and deploy the frontend independently.

## URL Repository
https://github.com/jabrahamocampo/calculator-frontend.git

## 1. Overview
   This document describes how to run, configure, and deploy the **Calculator Frontend** application. It includes environment variables, database dependencies, migrations (if applicable), seed data, and rolling deployment steps.

----------------------------------------------------

## Note: If you want to run the app using Docker please refer to https://github.com/jabrahamocampo/calculator-backend/RUNBOOK.md 

## 2. Installation in localhost
   1. Clone the repository  
      git clone https://github.com/jabrahamocampo/calculator-frontend.git
      cd calculator-frontend

      Install dependencies
      npm install

   2. Environment Variables
      Go to calculator-frontend and create file `.env`
      
      #Up with npm run dev (api-gateway), it works with Docker too.
      VITE_API_URL=http://localhost:8080/api/v1 

   3. Run the application in development mode: npm run dev
   4. Make sure also backend application is runing too, to do so please refer to https://github.com/jabrahamocampo/calculator-backend in README.md and RUNBOOK.md files and follow the instructions. 

   5. The application will runs at: `http://localhost:5173/`

----------------------------------------------------

## 3. Migrations
   The frontend does not require database migrations.  
   All persistent data is handled in the backend services and PostgreSQL database.

----------------------------------------------------

## 3. Seed Data
   The frontend does not manage its own seed data.  
   Seed data is managed through backend migrations (e.g., default admin user, sample operations).  

   To test locally, ensure backend services are seeded properly before connecting the frontend.

----------------------------------------------------

## 4. Rolling Deploy Steps

### Local Development
1. Clone repository:
   
   git clone https://github.com/jabrahamocampo/calculator-frontend.git
   cd calculator-frontend
   
2. Install dependencies: npm install
   
3. Run locally: npm run dev
   
4. App runs at: `http://localhost:5173/`

----------------------------------------------------

## 5. Wanna run some tests? Please follow the instruction:
- Unit Test: This test verifies the functionality of a single, isolated piece of code (usually a function, method, or class) to ensure it behaves correctly on its own.
    In order to execute unit test and execute test coverage in each do the following:
    1.- Go to frontend root service directory: cd frontend
    2.- Execute command: npm run test:unit
    3.- Execute command: npm run test:coverage 

- Smoke Test: This test it to check that the most critical functionalities of the application are working.
    1.- Before start make sure all backend services and database are up and running.
    2.- Go to frontend root service directory: cd frontend
    3.- Execute command: npm run test:smoke
             
- End-to-end (E2E): This test verifies the complete workflow of the application from start to finish, ensuring all  integrated components work together as expected. 
    1.- Before start make sure all backend services and database are up and running.
    2.- Go to frontend root service directory: cd frontend
    3.- Execute command: npm run test:e2e
    

----------------------------------------------------
![Frontend CI](https://github.com/jabrahamocampo/calculator-frontend/actions/workflows/frontend-ci.yml/badge.svg)


