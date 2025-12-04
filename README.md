# Healthcare Portal

A secure wellness and preventive care platform connecting patients with healthcare providers. Built for real-world healthcare workflows with a focus on privacy, compliance, and user experience.

## Overview

This portal enables patients to track wellness goals and manage their health journey while giving healthcare providers visibility into patient compliance and preventive care needs. The system emphasizes data security, role-based access, and intuitive interfaces for both patient and provider workflows.

**Core Capabilities:**

- Secure authentication with role-based access (patients and providers)
- Personal wellness goal tracking with visual progress indicators
- Preventive care reminders and health tips
- Provider dashboard for monitoring patient compliance
- Audit logging for data access and security compliance

## Architecture

The application follows a modern three-tier architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                     USER BROWSER                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  REACT.JS FRONTEND                      │
│                    (Vercel)                             │
│  - Components (Dashboard, Profile, Goals)               │
│  - Firebase Client SDK                                  │
│  - Auth Context (manages user state)                    │
└─────────────────────────────────────────────────────────┘
          │                              │
          │                              │
          ▼                              ▼
┌──────────────────────┐    ┌──────────────────────────┐
│  FIREBASE AUTH       │    │  EXPRESS.JS BACKEND      │
│  (Firebase)          │    │  (Railway)               │
│                      │    │                          │
│  - Email/Password    │    │  - REST API Endpoints    │
│  - User Management   │    │  - Firebase Admin SDK    │
│  - ID Token          │◄───│  - Token Verification    │
│    Generation        │    │  - Business Logic        │
└──────────────────────┘    └──────────────────────────┘
                                       │
                                       ▼
                          ┌──────────────────────────┐
                          │  FIRESTORE DATABASE      │
                          │  (Firebase)              │
                          │                          │
                          │  Collections:            │
                          │  - users                 │
                          │  - goals                 │
                          │  - reminders             │
                          │  - healthTips            │
                          └──────────────────────────┘
```

**Design Principles:**

- **Security First** - JWT authentication, encrypted data flow, HIPAA-inspired access controls
- **Separation of Concerns** - Independent frontend, backend, and data layers for scalability
- **Stateless API** - RESTful design enabling horizontal scaling
- **Role-Based Access** - Granular permissions for patients vs providers
- **Audit Trail** - Comprehensive logging for compliance and security monitoring

## Tech Stack

### Frontend

- **React.js** - Component-based UI with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **CSS Modules** - Scoped styling

### Backend

- **Node.js + Express** - API server
- **Firebase Admin SDK** - Database and auth management
- **JWT** - Stateless session management
- **Helmet** - Security headers
- **Morgan** - Request logging

### Database & Auth

- **Firebase Firestore** - NoSQL database with real-time capabilities
- **Firebase Authentication** - User management and verification

### DevOps

- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting

## Project Structure

```bash
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API service layer
│   │   └── utils/          # Helper functions
│   └── public/
│
├── backend/
│   ├── routes/             # API route handlers
│   ├── middleware/         # Auth, validation, logging
│   ├── services/           # Business logic layer
│   ├── config/             # Configuration files
│   └── utils/              # Helper functions
│
└── .github/
    └── workflows/          # CI/CD automation
```

## Key Features

### Patient Experience

- Dashboard with wellness metrics (steps, active time, sleep)
- Goal logging and progress tracking
- Preventive care reminders
- Profile management with health information
- Daily health tips

### Provider Experience

- Patient list with compliance status
- Individual patient goal tracking
- Quick access to patient health profiles
- Compliance overview dashboard

### Security & Compliance

- Password hashing and secure session management
- Data access logging
- User consent management
- Secure data transmission
- Environment-based configuration for sensitive credentials

## API Design

RESTful endpoints with predictable resource-based URLs:

```bash
# Authentication
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/verify

# Patient Resources
GET    /api/patients/profile
PUT    /api/patients/profile
GET    /api/patients/dashboard
POST   /api/patients/goals
GET    /api/patients/goals

# Provider Resources
GET    /api/providers/patients
GET    /api/providers/patients/:id
GET    /api/providers/compliance

# Public Resources
GET    /api/health-info
```

## Development Status

Currently in MVP phase with core authentication, dashboards, and goal tracking implemented. Focus on delivering a functional, secure foundation for healthcare data management.

---

💻 Developed for HCLTech Hackathon
❤️ Built by Team : **AuraOverFlow**
