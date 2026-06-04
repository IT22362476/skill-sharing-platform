# Skill Sharing & Learning Platform 🎓

**IT3030 - PAF Assignment 2025**

A full-stack web application for sharing skills, tracking learning progress, creating learning plans, and connecting with fellow learners.

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-6DB33F?logo=springboot)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)
![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=java)
![MUI](https://img.shields.io/badge/MUI-5-007FFF?logo=mui)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Team Structure](#-team-structure)
- [Quick Start](#-quick-start)
- [API Overview](#-api-overview)
- [Documentation](#-documentation)
- [Enhancements](#-enhancements)
- [Project Structure](#-project-structure)

---

## ✨ Features

### Core Features
- **User Authentication** - Email/password registration & login with JWT, plus OAuth 2.0 login via Google and GitHub
- **Skill-Sharing Posts** - Create posts with text content and up to 3 media files (images or short videos)
- **Social Feed** - Browse public posts or view a personalized feed from users you follow
- **Likes & Comments** - Interact with posts through likes and comments (with edit/delete controls)
- **Follow System** - Follow/unfollow other users to curate your feed
- **User Search** - Find other users by username
- **Learning Progress** - Log your learning activities using predefined templates
- **Learning Plans** - Create structured learning plans with topics, resources, and deadlines
- **Notifications** - Stay updated when someone likes or comments on your post

### Enhancements (Extra Credit)
- 🏆 **Skill Badges** - Earn badges when completing learning plans
- 🔍 **Search Posts** - Find posts by skill category or keyword
- 🌙 **Dark Mode** - Toggle between light and dark themes (persisted in localStorage)
- 📄 **Export Plans** - Learning plans can be exported as PDF (via jsPDF)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 17, Spring Boot 3.2.1, Spring Security, Spring Data JPA |
| **Database** | PostgreSQL 15+, Flyway Migrations |
| **Frontend** | React 18, Material-UI 5, Axios, React Router v6 |
| **Auth** | JWT (email/password), OAuth 2.0 (Google, GitHub) |
| **Build** | Maven (backend), npm (frontend) |
| **CI/CD** | GitHub Actions |

---

## 👥 Team Structure

| Member | Responsibilities | API Endpoints | Components |
|--------|-----------------|---------------|------------|
| **Member 1** | Auth, Notifications, Profile | 5 | LoginPage, ProfilePage, NotificationsDropdown |
| **Member 2** | Posts, Media Upload, Likes | 6 | FeedPage, CreatePostPage, PostCard, PostDetailPage |
| **Member 3** | Comments, Follows, User Search | 7 | CommentSection, FollowButton, UserSearchPage |
| **Member 4** | Learning Progress, Learning Plans | 6 | ProgressTimeline, PlanCard, MyLearningPage |

---

## 🚀 Quick Start

### Prerequisites
- Java 17 JDK
- Node.js 20+
- PostgreSQL 15+

### 1. Clone & Setup Database
```bash
git clone <repository-url>
cd skill-sharing-platform

# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE skillshare;"
```

### 2. Configure OAuth (Optional for full features)
Set environment variables in your shell or IDE:
```bash
# OAuth 2.0 credentials - MUST be configured in application.yml
# Google Cloud Console: https://console.cloud.google.com/
# GitHub Developer Settings: https://github.com/settings/developers
export GOOGLE_CLIENT_ID=your-google-client-id
export GOOGLE_CLIENT_SECRET=your-google-client-secret
export GITHUB_CLIENT_ID=your-github-client-id
export GITHUB_CLIENT_SECRET=your-github-client-secret
export JWT_SECRET=your-256-bit-secret-key
```

### 3. Start Backend
```bash
cd backend
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### 5. Open Application
Navigate to **http://localhost:3000** and register/login!

---

## 📡 API Overview

| Category | Base Path | Endpoints |
|----------|-----------|-----------|
| Auth | `/api/auth` | POST register, POST login, GET user, GET oauth2/{provider} |
| Users | `/api/users` | GET {id}, PUT profile, GET search, POST/DELETE {id}/follow |
| Posts | `/api/posts` | POST create, GET feed, GET {id}, DELETE {id}, POST/DELETE {id}/like, GET search |
| Comments | `/api` | POST posts/{id}/comments, PUT/DELETE comments/{id}, DELETE posts/{pid}/comments/{cid} |
| Notifications | `/api/notifications` | GET list, GET unread-count, PUT {id}/read, PUT read-all, DELETE {id} |
| Progress | `/api/progress` | POST create, GET user/{id}, DELETE {id} |
| Plans | `/api/plans` | POST create, GET user/{id}, PUT {id} |

**Full API documentation**: [docs/final-documentation/api-documentation.md](docs/final-documentation/api-documentation.md)

---

## 📚 Documentation

| Document | Location |
|----------|----------|
| Work Breakdown Structure | [docs/initial-documentation/WBS.md](docs/initial-documentation/WBS.md) |
| Functional Requirements | [docs/initial-documentation/functional-requirements.md](docs/initial-documentation/functional-requirements.md) |
| Non-Functional Requirements | [docs/initial-documentation/nonfunctional-requirements.md](docs/initial-documentation/nonfunctional-requirements.md) |
| Architecture Diagrams | [docs/initial-documentation/architecture-diagrams.md](docs/initial-documentation/architecture-diagrams.md) |
| Final Report | [docs/final-documentation/final-report.md](docs/final-documentation/final-report.md) |
| API Documentation | [docs/final-documentation/api-documentation.md](docs/final-documentation/api-documentation.md) |
| Deployment Guide | [docs/final-documentation/deployment-guide.md](docs/final-documentation/deployment-guide.md) |
| Testing Report | [docs/final-documentation/testing-report.md](docs/final-documentation/testing-report.md) |
| AI Disclosure | [docs/final-documentation/AI-disclosure.md](docs/final-documentation/AI-disclosure.md) |

---

## 🏆 Enhancements

1. **Skill Badges** - Badge entity and repository, awarded when a learning plan is completed (`LearningService.awardBadgeIfEligible()`)
2. **Search Posts** - `GET /api/posts/search` with skillCategory and keyword query params
3. **Dark Mode Toggle** - ThemeContext with MUI theme switching, persisted in localStorage
4. **Export Plan as PDF** - Uses `jspdf` library (included in package.json)

---

## 📁 Project Structure

```
skill-sharing-platform/
├── backend/                 # Spring Boot REST API
├── frontend/                # React Client Application
├── docs/                    # Documentation
├── .github/workflows/       # GitHub Actions CI
└── README.md
```

---

## 📝 License

This project is created for educational purposes as part of IT3030 - PAF Assignment 2025.
