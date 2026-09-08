Personal-FinanceFlow

FinanceFlow is a full-stack personal finance and expense analytics dashboard built to help users track income, expenses, categories, and monthly budgets in one place. It provides authenticated, user-specific financial data, interactive analytics, monthly trends, category-wise spending insights, and budget tracking through a React frontend backed by a Spring Boot REST API and PostgreSQL.

Live deployment

Web application: https://personal-finance-frontend-2e2h.onrender.com

Backend API: https://personal-finance-backend-ldr4.onrender.com

Source code: https://github.com/Tejashribambal19/personal-finance

The Render free backend instance can take some time to wake after inactivity. Most backend endpoints are protected with JWT authentication, so opening the backend URL directly in a browser may return an authorization response instead of a webpage.

Key features

Secure user registration and login with JWT authentication

BCrypt password hashing

User-specific data isolation for transactions, categories, budgets, and analytics

Income and expense transaction management

Create, view, update, and delete transactions

Custom income and expense categories

Monthly category-based budget creation and tracking

Total income, total expenses, and current balance calculations

Monthly income-versus-expense trend visualization

Expense breakdown by category with percentage contribution

Month-over-month expense comparison

Savings-rate calculation on the dashboard

Protected React routes for authenticated pages

Automatic JWT attachment to API requests through Axios interceptors

PostgreSQL persistence using Spring Data JPA and Hibernate

Docker Compose setup for local PostgreSQL and pgAdmin

Cloud deployment using Render and Neon PostgreSQL

Screenshots

Login



Financial dashboard



Architecture

flowchart TD
    USER[User Browser] -->|HTTPS| UI[React + Vite Frontend]
    UI -->|REST API + JWT| API[Spring Boot REST API]

    API --> AUTH[Authentication & Security]
    API --> TX[Transaction Service]
    API --> CAT[Category Service]
    API --> BUDGET[Budget Service]
    API --> ANALYTICS[Analytics Service]

    AUTH --> DB[(PostgreSQL)]
    TX --> DB
    CAT --> DB
    BUDGET --> DB
    ANALYTICS --> DB

    UI -. Production .-> RENDERUI[Render Static Site]
    API -. Production .-> RENDERAPI[Render Web Service]
    DB -. Production .-> NEON[Neon PostgreSQL]

Technology stack

Layer

Technologies

Frontend

React 19, Vite 8, React Router, Axios

UI / Charts

CSS, Lucide React, Recharts

Backend

Java 17, Spring Boot 4.1, Spring Web MVC, Spring Data JPA

Security

Spring Security, JWT, BCrypt

Data

PostgreSQL 17, Hibernate / JPA

Build

Maven, npm

Local Infrastructure

Docker Compose, PostgreSQL, pgAdmin

Deployment

Render Static Site, Render Web Service, Neon PostgreSQL

Core data model

erDiagram
    USERS ||--o{ CATEGORIES : owns
    USERS ||--o{ TRANSACTIONS : owns
    USERS ||--o{ BUDGETS : owns
    CATEGORIES ||--o{ TRANSACTIONS : classifies
    CATEGORIES ||--o{ BUDGETS : limits

    USERS {
        bigint id PK
        varchar name
        varchar email UK
        varchar password
        timestamp created_at
        timestamp updated_at
    }

    CATEGORIES {
        bigint id PK
        bigint user_id FK
        varchar name
        varchar type
        timestamp created_at
        timestamp updated_at
    }

    TRANSACTIONS {
        bigint id PK
        bigint user_id FK
        bigint category_id FK
        varchar type
        decimal amount
        varchar description
        date transaction_date
        timestamp created_at
        timestamp updated_at
    }

    BUDGETS {
        bigint id PK
        bigint user_id FK
        bigint category_id FK
        decimal amount
        int month
        int year
        timestamp created_at
        timestamp updated_at
    }

Authentication flow

A user registers with name, email, and password.

The backend hashes the password using BCrypt before storing it in PostgreSQL.

The user signs in through /api/auth/login.

The backend returns a signed JWT.

The frontend stores the token and attaches it to authenticated API requests as a Bearer token.

Spring Security validates the token before allowing access to transactions, categories, budgets, and analytics.

Backend services use the authenticated user identity so users can access only their own financial data.

Prerequisites

Java Development Kit 17

Node.js and npm

Docker Desktop with Docker Compose

Git

Maven does not need to be installed separately because the repository includes the Maven Wrapper.

Run the project locally

1. Clone the repository

git clone https://github.com/Tejashribambal19/personal-finance.git
cd personal-finance

2. Start PostgreSQL and pgAdmin

docker compose up -d
docker compose ps

Local services:

Service

Address

PostgreSQL

localhost:5433

pgAdmin

http://localhost:5050

Local PostgreSQL credentials:

Database: personal_finance_db
Username: finance_user
Password: finance_password
Port: 5433

pgAdmin login:

Email: admin@finance.com
Password: admin

When adding the PostgreSQL server inside the Dockerized pgAdmin interface, use:

Host: postgres
Port: 5432
Database: personal_finance_db
Username: finance_user
Password: finance_password

3. Start the Spring Boot backend

Open a new PowerShell terminal:

cd backend
.\mvnw.cmd spring-boot:run

The backend runs locally at:

http://localhost:8081

4. Configure the frontend

Open another PowerShell terminal:

cd frontend

Create a local .env file:

VITE_API_URL=http://localhost:8081/api

Do not commit the real .env file. Commit only .env.example.

5. Start the React frontend

npm install
npm run dev

Open:

http://localhost:5173

Configuration

Backend environment variables

The Spring Boot backend reads database, security, server, and CORS settings from environment variables.

Variable

Purpose

Local default

PGHOST

PostgreSQL host

localhost

PGPORT

PostgreSQL port

5433

PGDATABASE

PostgreSQL database

personal_finance_db

PGUSER

PostgreSQL username

finance_user

PGPASSWORD

PostgreSQL password

finance_password

JWT_SECRET

JWT signing secret

Development fallback only

JWT_EXPIRATION

Token lifetime in milliseconds

86400000

CORS_ALLOWED_ORIGINS

Allowed frontend origins

http://localhost:5173,http://127.0.0.1:5173

SHOW_SQL

Enable Hibernate SQL logging

false

PORT

Backend HTTP port

8081

For the Render + Neon production deployment, the database connection can also be supplied using Spring Boot's standard environment variables:

Variable

Purpose

SPRING_DATASOURCE_URL

Neon PostgreSQL JDBC URL

SPRING_DATASOURCE_USERNAME

Neon database role

SPRING_DATASOURCE_PASSWORD

Neon database password

JWT_SECRET

Production JWT signing secret

CORS_ALLOWED_ORIGINS

Production frontend URL

Never commit real passwords, Neon connection strings, JWT secrets, or production .env files.

Frontend environment variable

Variable

Purpose

Local default

VITE_API_URL

Base URL for the Spring Boot API

http://localhost:8081/api

Production value:

https://personal-finance-backend-ldr4.onrender.com/api

Main API endpoints

All endpoints except registration and login require:

Authorization: Bearer <JWT>

Authentication

Method

Endpoint

Purpose

POST

/api/auth/register

Create a new user account

POST

/api/auth/login

Authenticate a user and return a JWT

Categories

Method

Endpoint

Purpose

GET

/api/categories

List the current user's categories

POST

/api/categories

Create an income or expense category

DELETE

/api/categories/{categoryId}

Delete a category

Transactions

Method

Endpoint

Purpose

GET

/api/transactions

List the current user's transactions

GET

/api/transactions/{transactionId}

Get one transaction

POST

/api/transactions

Create a transaction

PUT

/api/transactions/{transactionId}

Update a transaction

DELETE

/api/transactions/{transactionId}

Delete a transaction

Budgets

Method

Endpoint

Purpose

GET

/api/budgets?year={year}&month={month}

List budgets for a month

POST

/api/budgets

Create a monthly category budget

PUT

/api/budgets/{budgetId}

Update a budget

DELETE

/api/budgets/{budgetId}

Delete a budget

Analytics

Method

Endpoint

Purpose

GET

/api/analytics/summary

Total income, expenses, and balance

GET

/api/analytics/category-breakdown?year={year}&month={month}

Expense totals and percentages by category

GET

/api/analytics/monthly-trend?year={year}

Monthly income, expense, and balance trend

GET

/api/analytics/monthly-comparison?year={year}&month={month}

Compare expenses with the previous month

Testing

Run backend tests:

cd backend
.\mvnw.cmd clean test

Build the backend:

.\mvnw.cmd clean package

Lint the frontend:

cd frontend
npm install
npm run lint

Build the frontend:

npm run build

Demo flow

Open the deployed FinanceFlow web application.

Create a new user account.

Sign in with the registered account.

Create income and expense categories.

Add income and expense transactions.

Open the dashboard and show total balance, income, expenses, and savings rate.

Show the income-versus-expense monthly chart.

Show the expense category breakdown.

Create a monthly category budget.

Update or delete a transaction and show the analytics refresh.

Open Neon PostgreSQL and verify that the application data is persisted in the database.

Project structure

personal-finance/
├── backend/
│   ├── src/main/java/com/finance/dashboard/
│   │   ├── config/          Spring Security and CORS configuration
│   │   ├── controller/      REST API controllers
│   │   ├── dto/             Request and response DTOs
│   │   ├── entity/          JPA entities
│   │   ├── repository/      Spring Data repositories
│   │   ├── security/        JWT authentication components
│   │   └── service/         Business and analytics logic
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── Dockerfile
│   ├── pom.xml
│   └── mvnw / mvnw.cmd
│
├── frontend/
│   ├── src/
│   │   ├── api/             Axios API client
│   │   ├── components/      Reusable UI and chart components
│   │   └── pages/           Login, dashboard, transactions, budgets, categories
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   └── screenshots/
│       ├── login.png
│       └── dashboard.png
│
├── docker-compose.yml
├── .gitignore
└── README.md

Production deployment

The production application is split into three services:

flowchart LR
    USER[Browser] --> FRONTEND[Render Static Site]
    FRONTEND -->|HTTPS REST API| BACKEND[Render Web Service]
    BACKEND -->|JDBC + SSL| DB[(Neon PostgreSQL)]

Frontend

Platform: Render Static Site

Root directory: frontend

Build command: npm install && npm run build

Publish directory: dist

API environment variable: VITE_API_URL

SPA rewrite: /* → /index.html

Backend

Platform: Render Web Service

Runtime: Docker

Root directory: backend

Java runtime: Java 17

Database connection supplied through environment variables

Production CORS restricted to the deployed frontend origin

Database

Platform: Neon

Engine: PostgreSQL

SSL-enabled connection

Application tables: users, categories, transactions, budgets

Production considerations

Replace the development JWT fallback with a strong production secret.

Keep database passwords and JWT secrets only in managed environment variables.

Rotate any credential immediately if it is exposed.

Use database migrations such as Flyway or Liquibase instead of relying on ddl-auto=update for long-term production use.

Add refresh tokens or shorter-lived access tokens for stronger authentication lifecycle management.

Add account verification, password reset, and rate limiting for public production use.

Add integration, security, and end-to-end tests.

Add structured application monitoring and alerting.

Configure regular PostgreSQL backups and recovery procedures.

Consider pagination and filtering when transaction history becomes large.

Author

Tejashri Bambal

GitHub: https://github.com/Tejashribambal19

License

This project was created as a portfolio full-stack development project. Add a license before reuse or distribution.