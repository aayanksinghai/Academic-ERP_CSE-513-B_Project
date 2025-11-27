# Academic ERP - Organization Management System

## 📋 Project Overview

The **Academic ERP** is a full-stack web application designed to manage academic administrative processes. This specific module focuses on **Organization Registration and Management** for the Outreach Department.

The system implements strict **Role-Based Access Control (RBAC)**. While authentication is handled via **Google OAuth2**, authorization is determined by the internal employee database. Only employees belonging to the **"Outreach"** department are granted access to create, update, or delete organization records.

## 🚀 Tech Stack

### Backend
* **Framework:** Java Spring Boot
* **Build Tool:** Maven
* **Database:** MySQL
* **Security:** Spring Security, OAuth2 Client (Google), JWT (JSON Web Tokens)
* **ORM:** Spring Data JPA / Hibernate

### Frontend
* **Framework:** React (v19)
* **Build Tool:** Vite
* **Language:** TypeScript
* **Styling:** Bootstrap 5, React Bootstrap, Custom CSS
* **Routing:** React Router DOM

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
* **Java JDK 17** or higher (Project uses JDK 21 settings)
* **Node.js** (v18 or higher) and npm
* **MySQL Server**

---

## 🛠️ Installation & Setup

### 1. Database Setup
1.  Open your MySQL Workbench or terminal.
2.  Create a database named `academic_erp`:
    ```sql
    CREATE DATABASE academic_erp;
    ```
3.  **Crucial Step:** You must populate the `employees` table for login to work. The system authenticates via Google but authorizes via the DB.
    Run the script located at: `database/scripts/sample_employees.sql`.
    
    *Make sure to insert your specific Google email address into this script with the department set to **'Outreach'** to gain full access.*

### 2. Backend Configuration
1.  Navigate to the backend directory:
    ```bash
    cd backend/academicerp
    ```
2.  Open `src/main/resources/application.properties`.
3.  **Database:** Update `spring.datasource.username` and `password` with your MySQL credentials.
4.  **Google OAuth:** You need a Google Cloud Project.
    * Create credentials for an **OAuth 2.0 Client ID**.
    * Set **Authorized Redirect URI** to: `http://localhost:8080/login/oauth2/code/google`
    * Update the following lines in `application.properties`:
        ```properties
        spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
        spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
        ```
5.  Run the backend:
    ```bash
    ./mvnw spring-boot:run
    ```
    The server will start on `http://localhost:8080`.

### 3. Frontend Configuration
1.  Navigate to the frontend directory:
    ```bash
    cd frontend/academicerp-frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    The application will start on `http://localhost:5173`.

---

## 📖 Usage Guide

### Authentication Flow
1.  Navigate to `http://localhost:5173`.
2.  Click **"Continue with Google"**.
3.  **Validation Logic:**
    * The system checks if the email from Google exists in the `employees` table.
    * **If Email Not Found:** Login fails (Access Denied).
    * **If Found but not 'Outreach':** User is redirected to a "Restricted Welcome" page (Read-only/No access to forms).
    * **If Found AND 'Outreach':** User is granted a JWT token and redirected to the Organization Dashboard.

### Organization Management (Outreach Only)
* **Dashboard:** View a list of all registered organizations.
* **Search:** Real-time filtering by Organization Name, Address, or HR Name.
* **Create:** Click "New Organisation" to register a company and its HR contact details.
    * *Note:* HR Email must be unique.
* **Update:** Edit existing organization details.
* **Delete:** Remove an organization from the system.

---

## 🛡️ Security Features
* **JWT Authentication:** Stateless authentication for API requests.
* **Route Protection:** Frontend routes (`/organisations`) are protected by `OutreachRoute` wrappers.
* **Backend Validation:** API endpoints are secured using `@PreAuthorize("hasRole('OUTREACH')")`.

## 🤝 Contributing
1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.