# Watch Project — Full-Stack Watch Catalog & Inventory System
VIST HERE ---> https://watch-project-website-eosin.vercel.app/

A full-stack web application for managing and showcasing a personal watch inventory.

The system provides a public-facing watch catalog alongside a protected administrative dashboard for adding, editing, selling, and removing watches. The application is built with React and Spring Boot, uses PostgreSQL for persistent storage, JWT-based authentication for administrator access, and is deployed using Vercel, Render, and Supabase.

## Features

### Public Catalog

* Browse available watches
* View detailed watch information
* View watch specifications and condition/accessory information
* View pricing information
* Browse featured and recently published watches
* Responsive web interface
* Client-side navigation using React Router

### Admin Dashboard

* Protected administrator login
* JWT-based authentication
* Add new watches
* Edit existing watches
* Mark watches as sold
* Delete watches
* View inventory
* Manage watch documentation and accessories
* Manage fields including:

  * Brand
  * Model name
  * Reference number
  * Category
  * Purchase price
  * Target selling price
  * Status
  * Image URL
  * Description
  * Published date
  * Sold date
  * Inner box
  * Outer box
  * Manuals
  * Card and papers
  * Hangtags
  * Full links
  * Missing links
  * Wrist size

## Technology Stack

### Frontend

* React
* Vite
* React Router
* Framer Motion
* JavaScript / JSX
* CSS

### Backend

* Java
* Spring Boot
* Spring Web
* Spring Security
* Spring Data JPA
* Hibernate
* JWT authentication
* Maven

### Database

* PostgreSQL
* Supabase

### Deployment

* Vercel — frontend hosting
* Render — Spring Boot backend hosting
* Supabase — production PostgreSQL database
* Docker — backend containerization
* GitHub — source control and deployment trigger

## System Architecture

The application follows a client-server architecture.

The frontend and backend are deployed separately.

```text
User
 |
 v
Vercel
React + Vite Frontend
 |
 | HTTPS / REST API
 v
Render
Spring Boot Backend
 |
 | JDBC / JPA
 v
Supabase
PostgreSQL Database
```

GitHub acts as the source-code repository and deployment trigger.

```text
GitHub
 |
 +--> Vercel
 |    React/Vite production build
 |
 +--> Render
      Dockerized Spring Boot application
```

The browser communicates with the Spring Boot API rather than directly accessing the PostgreSQL database.

This keeps database credentials and database operations on the server side.

## Frontend Architecture

The frontend is a React single-page application.

React Router handles application navigation and provides routes such as:

* `/`
* `/catalog`
* `/about`
* `/admin/login`
* `/admin`

The frontend communicates with the backend through REST API requests.

The production API URL is supplied through the Vite environment variable:

```text
VITE_API_URL
```

For local development, the frontend communicates with the local Spring Boot server.

For production, it communicates with the Render deployment.

This prevents the deployed application from attempting to access `localhost`.

### SPA Routing

Because the application uses React Router, Vercel needs to redirect unknown frontend routes back to `index.html`.

This is handled by:

```text
frontend/vercel.json
```

with a rewrite configuration that allows routes such as `/admin/login` to be handled by React Router instead of returning a Vercel 404.

## Backend Architecture

The backend is built using Spring Boot and follows a layered architecture.

```text
HTTP Request
     |
     v
Controller
     |
     v
Service / Business Logic
     |
     v
Repository
     |
     v
JPA / Hibernate
     |
     v
PostgreSQL
```

### Controllers

Controllers expose REST API endpoints to the frontend.

Examples include:

```text
GET    /api/watches
GET    /api/watches/latest
POST   /api/watches
PUT    /api/watches/{id}
PATCH  /api/watches/{id}/sold
DELETE /api/watches/{id}
POST   /api/auth/login
```

Public endpoints are used by the catalog, while administrative modification endpoints require administrator authentication.

### Entities / Models

`Watch.java` represents a watch in the application.

It maps the Java watch object to the PostgreSQL `watches` table.

The entity contains information about:

* Watch identification
* Brand and model
* Reference number
* Category
* Pricing
* Inventory status
* Images
* Description
* Publication and sold dates
* Included accessories
* Documentation
* Wrist size

### Repository

`WatchRepository.java` provides database access through Spring Data JPA.

For example, the application uses repository methods to retrieve watches ordered by publication date.

Hibernate translates these operations into SQL queries executed against PostgreSQL.

## Authentication and Security

The administrative dashboard is protected using Spring Security and JWT authentication.

The login flow is:

```text
Admin
 |
 v
React Login Form
 |
 | POST /api/auth/login
 v
Spring Boot
 |
 v
Authentication
 |
 v
JWT Token
 |
 v
React
 |
 v
Authenticated Admin Requests
```

The JWT is subsequently supplied with protected requests.

The backend's JWT authentication filter validates incoming tokens and establishes the authenticated user's role.

Administrative endpoints require the `ADMIN` role.

Examples:

```text
POST /api/watches       -> ADMIN
PUT /api/watches/{id}   -> ADMIN
PATCH /api/watches/{id} -> ADMIN
DELETE /api/watches/{id} -> ADMIN
```

Public watch retrieval endpoints do not require administrator authentication.

### Administrator Account

The current implementation uses environment variables for the administrator credentials rather than storing administrator accounts in the PostgreSQL database.

Relevant production configuration includes:

```text
ADMIN_USERNAME
ADMIN_PASSWORD_HASH
JWT_SECRET
```

This means a separate `users` table is not required for the current single-administrator implementation.

A future multi-user version could replace this approach with persistent user accounts and role management.

## CORS

Because the frontend and backend are hosted on different domains, the backend requires Cross-Origin Resource Sharing configuration.

The backend uses the `FRONTEND_URL` environment variable to identify the allowed frontend origin.

Production configuration:

```text
FRONTEND_URL=https://watch-project-website-eosin.vercel.app
```

This allows the Vercel frontend to communicate with the Render backend while avoiding a wildcard `*` origin.

## Database

The application uses PostgreSQL as its relational database.

The production database is hosted by Supabase.

The primary inventory table is:

```text
watches
```

Hibernate/JPA handles the mapping between Java entities and PostgreSQL records.

The backend does not expose the database directly to the browser.

Instead:

```text
React
  |
  v
Spring Boot API
  |
  v
JPA / Hibernate
  |
  v
PostgreSQL
```

Database credentials are supplied through environment variables rather than committed to the Git repository.

## Docker

The Spring Boot backend is containerized using Docker.

Docker is not required by Spring Boot itself. It is used as a deployment mechanism to provide a consistent runtime environment for the backend.

The deployment process is conceptually:

```text
Java / Spring Boot Source
        |
        v
      Maven
        |
        v
Spring Boot JAR
        |
        v
Docker Image
        |
        v
Render
        |
        v
Running Backend
```

The project uses a multi-stage Docker build.

The build stage contains the tools required to compile the application, while the final runtime stage contains the Java runtime and compiled application.

This keeps the production container more focused than using the complete build environment at runtime.

## Deployment

The production application is split across three primary services.

### Frontend — Vercel

The React/Vite frontend is deployed to Vercel.

Production URL:

https://watch-project-website-eosin.vercel.app/

The Vercel project uses the `frontend` directory as the frontend root.

When changes are pushed to the GitHub `main` branch, Vercel can automatically build and deploy the frontend.

The production build runs:

```text
npm run build
```

which executes:

```text
vite build
```

### Backend — Render

The Spring Boot backend is deployed to Render.

Backend URL:

https://watch-project-website.onrender.com

Render builds and runs the backend using the project's Docker configuration.

The backend listens on the port provided by the Render environment.

### Database — Supabase

The production PostgreSQL database is hosted by Supabase.

Render connects to the Supabase PostgreSQL database using environment variables.

The database connection is not exposed to the frontend.

## Environment Configuration

Sensitive production configuration is not hardcoded into the application.

Examples include:

```text
DATABASE_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
ADMIN_USERNAME
ADMIN_PASSWORD_HASH
FRONTEND_URL
```

Frontend configuration uses:

```text
VITE_API_URL
```

Environment files containing secrets are excluded from source control where appropriate.

This allows the same application code to run in both local development and production environments without changing source code for credentials or deployment-specific values.

## Testing

The backend includes automated tests using Spring Boot's testing infrastructure.

The project was tested locally using an H2 in-memory database for automated database-related tests.

The test suite completed successfully with:

```text
27 tests
0 failures
```

The tests include controller and backend behavior testing, including administrative watch operations.

Automated tests are separate from production database data and do not require the production Supabase database.

### Manual Production Testing

The deployed application was also tested through the production environment.

Testing included:

* Vercel production build
* Direct frontend access
* React Router routes
* `/admin/login`
* Frontend-to-Render API communication
* Backend `/api/watches` endpoint
* PostgreSQL connectivity
* Supabase database connectivity
* Admin authentication
* CORS configuration
* Production environment variables

During deployment, a CORS issue was identified between Vercel and Render and resolved by configuring the backend's `FRONTEND_URL` environment variable.

A Vercel SPA routing issue was also identified and resolved using `frontend/vercel.json`.

## Project Structure

The project is divided into frontend and backend components.

```text
Watch-Project/
|
├── frontend/
│   ├── src/
│   │   ├── Admin.jsx
│   │   ├── Admin.css
│   │   ├── AdminLogin.jsx
│   │   ├── AdminLogin.css
│   │   ├── ...
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── .env
│   ├── .env.production
│   ├── package.json
│   ├── vite.config.*
│   └── vercel.json
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── watchproject/
│   │   │       ├── auth/
│   │   │       │   └── AdminAuthenticationService.java
│   │   │       ├── controller/
│   │   │       │   └── AdminWatchController.java
│   │   │       ├── security/
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   └── JwtAuthenticationFilter.java
│   │   │       ├── model/
│   │   │       │   └── Watch.java
│   │   │       └── repository/
│   │   │           └── WatchRepository.java
│   │   │
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│       └── java/
│
├── Dockerfile
├── pom.xml
└── README.md
```

## Key Backend Files

### `Watch.java`

Defines the watch entity and maps it to the PostgreSQL `watches` table.

### `WatchRepository.java`

Provides database access through Spring Data JPA.

### `AdminWatchController.java`

Handles administrative inventory operations such as creating, updating, selling, and deleting watches.

### `AdminAuthenticationService.java`

Handles administrator authentication logic.

### `JwtAuthenticationFilter.java`

Processes JWT tokens attached to incoming requests and establishes authenticated users in Spring Security.

### `SecurityConfig.java`

Configures:

* CORS
* CSRF behavior
* Stateless sessions
* Public endpoints
* Protected endpoints
* Role-based authorization
* JWT filter integration

### `application.properties`

Contains Spring Boot application configuration and references environment variables for production database and security configuration.

### `pom.xml`

Defines Maven dependencies and build configuration for the Spring Boot backend.

### `Dockerfile`

Defines how the backend is compiled and packaged into a Docker container for deployment.

## Key Frontend Files

### `AdminLogin.jsx`

Provides the administrator login interface and sends authentication requests to the backend.

### `Admin.jsx`

Provides the administrator inventory management interface.

### `AdminLogin.css`

Styles the administrator login interface.

### `Admin.css`

Styles the administrator dashboard.

### `vercel.json`

Configures SPA rewrites so React Router routes work correctly when accessed directly.

## API Overview

### Public Endpoints

```text
GET /api/watches
GET /api/watches/latest
GET /api/watches/{id}
```

These endpoints provide watch information to the public catalog.

### Authentication

```text
POST /api/auth/login
```

Authenticates the administrator and returns a JWT on successful authentication.

### Administrative Endpoints

```text
GET    /api/watches/admin/all
POST   /api/watches
PUT    /api/watches/{id}
PATCH  /api/watches/{id}/sold
DELETE /api/watches/{id}
```

Administrative endpoints require the appropriate JWT authentication and `ADMIN` role.

## Production URLs

### Public Website

https://watch-project-website-eosin.vercel.app/

### Admin Login

https://watch-project-website-eosin.vercel.app/admin/login

### Backend API

https://watch-project-website.onrender.com

The backend URL is primarily intended for API communication and development/debugging rather than normal public browsing.

## Deployment Lessons

Several real-world deployment issues were encountered and resolved during development.

### Case-Sensitive File Systems

The frontend initially referenced:

```text
AdminLogin.css
```

while the file's casing differed in the local Windows environment.

The application worked locally because Windows is generally case-insensitive with filenames, but the Linux-based Vercel build environment is case-sensitive.

This caused the production build to fail until the filename was corrected.

### React SPA Routing

Directly visiting:

```text
/admin/login
```

initially resulted in a Vercel 404 because the server attempted to find a physical `/admin/login` file.

The issue was resolved with a Vercel rewrite to `index.html`, allowing React Router to handle the route.

### Production CORS

The browser initially blocked:

```text
Vercel frontend
        |
        v
Render backend
```

because the backend did not have the production Vercel origin configured.

The issue was resolved by setting:

```text
FRONTEND_URL=https://watch-project-website-eosin.vercel.app
```

in the Render environment.

These issues highlighted differences between local development and production environments and reinforced the importance of testing the actual deployed application.

## Current Limitations

This project is designed as a personal watch catalog and inventory system rather than a large-scale commercial marketplace.

Current limitations include:

* Single administrator configuration
* No customer account system
* No payment processing
* No order management system
* No automated image storage/CDN pipeline
* No automated database migration/seeding workflow for inventory data
* Production deployment depends on free-tier hosting limitations
* Render free instances may sleep after inactivity, resulting in slower initial requests

These limitations are intentional relative to the current scope of the project.

## Future Improvements

Potential future improvements include:

* Multi-user authentication
* Persistent user accounts and roles
* Image upload and object storage
* Automated database migrations
* Inventory import/export
* Search and advanced filtering
* Sales history and analytics
* Customer inquiry management
* Automated CI testing
* Improved monitoring and logging
* Custom domain
* Production-grade database backup strategy

## Conclusion

This project demonstrates a complete full-stack development and deployment workflow.

It combines:

* React frontend development
* REST API development
* Java and Spring Boot
* PostgreSQL database design
* JPA/Hibernate
* Spring Security
* JWT authentication
* Role-based authorization
* CORS configuration
* Docker containerization
* Git/GitHub version control
* Vercel frontend deployment
* Render backend deployment
* Supabase PostgreSQL hosting
* Automated backend testing
* Production debugging

The resulting architecture separates the presentation layer, application/API layer, and persistence layer while keeping production credentials and database access on the server side.
