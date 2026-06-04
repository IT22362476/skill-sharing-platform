# Final Project Report
## Skill Sharing & Learning Platform
### IT3030 - PAF Assignment 2025

---

## 1. Project Summary

The **Skill Sharing & Learning Platform** is a full-stack web application that enables users to share their skills through multimedia posts, track their learning progress, create structured learning plans, and interact with a community of learners. The platform combines social networking features (follows, likes, comments) with educational tools (progress tracking, learning plans, skill badges) to create a comprehensive skill-sharing ecosystem.

### Key Features Implemented
- **User Authentication**: Email/password (JWT) and OAuth 2.0 (Google, GitHub)
- **Skill-Sharing Posts**: Text + up to 3 media files (images/videos)
- **Social Interactions**: Likes, comments (with edit/delete controls)
- **Follow System**: Follow/unfollow users, personalized feed
- **Learning Progress**: Template-based progress updates
- **Learning Plans**: Structured plans with topics, resources, dates, and status tracking
- **Notifications**: Like and comment notifications with read/unread management
- **User Search**: Search users by username
- **Skill Badges**: Badge awarded on plan completion (Enhancement)
- **Dark Mode**: Theme toggle persisted in localStorage (Enhancement)
- **Post Search**: Search posts by skill category or keyword (Enhancement)

### Technology Stack
| Component | Technology |
|-----------|------------|
| Backend | Java 17, Spring Boot 3.2.x, Spring Security, Spring Data JPA |
| Database | PostgreSQL 15+ with Flyway migrations |
| Frontend | React 18, MUI (Material-UI) 5, Axios |
| Authentication | JWT (email/password), OAuth 2.0 (Google, GitHub) |
| Build Tools | Maven (backend), npm (frontend) |
| CI/CD | GitHub Actions |

---

## 2. Team Contributions

### Member 1: Authentication + Notifications + Profile
- Implemented email/password registration and login with JWT
- Integrated OAuth 2.0 login for Google and GitHub
- Created user profile management (view/update)
- Built notification system with mark-as-read and delete
- Configured Spring Security, CORS, and JWT filters
- Frontend: LoginPage, ProfilePage, NotificationsDropdown, Navbar, AuthContext, ThemeContext

### Member 2: Skill-Sharing Posts + Media Upload + Likes
- Implemented post creation with multipart file upload (max 3 files)
- Built public and followed-user feed with pagination
- Created like/unlike functionality with notification triggers
- Implemented post search by skill category and keyword
- Frontend: FeedPage, CreatePostPage, PostCard, PostDetailPage

### Member 3: Comments + Follow System + User Search
- Implemented comments with CRUD operations
- Added post owner ability to delete any comment
- Built follow/unfollow system
- Created user search by username
- Frontend: CommentSection, FollowButton, UserSearchPage, UserProfilePage integration

### Member 4: Learning Progress + Learning Plans
- Implemented template-based learning progress updates
- Created structured learning plans with topics/resources/dates
- Added plan status management and progress notes
- Implemented badge awarding on plan completion
- Frontend: ProgressTimeline, PlanCard, CreateProgressPage, CreatePlanPage, MyLearningPage

---

## 3. Challenges & Solutions

### Challenge 1: Multipart File Upload
**Problem**: Handling multiple file uploads with metadata in a single request.
**Solution**: Used `multipart/form-data` with Spring Boot's `MultipartFile` array. Client sends content as form fields and files separately. Backend validates file types, sizes, and counts before saving to disk and creating media records.

### Challenge 2: OAuth 2.0 Integration
**Problem**: Different OAuth providers return different user info structures.
**Solution**: Created a unified `OAuth2SuccessHandler` that maps provider-specific attributes to a common user model. Google uses `sub` as provider ID, while GitHub uses `id`. Email extraction differs between providers.

### Challenge 3: Feed Personalization
**Problem**: Combining public posts with followed users' posts in a single paginated feed.
**Solution**: Used a JPQL query that accepts a list of followed user IDs. If the user is authenticated and has follows, the query shows those posts + public posts. Otherwise, it shows only public posts.

### Challenge 4: JSON Fields in PostgreSQL
**Problem**: Learning plan topics and resources need to be stored as arrays.
**Solution**: Used PostgreSQL JSONB columns with Jackson serialization/deserialization. The `PlanDto` handles parsing JSON strings to lists using ObjectMapper.

### Challenge 5: Optimistic UI Updates
**Problem**: Likes and follows need to feel instantaneous.
**Solution**: Frontend immediately updates the UI state before the API call completes. If the API call fails, we show a toast error and revert the state.

---

## 4. API Statistics

| Category | Endpoints |
|----------|-----------|
| Authentication | 4 endpoints |
| User Management | 5 endpoints |
| Posts & Media | 7 endpoints |
| Comments | 5 endpoints |
| Notifications | 5 endpoints |
| Learning Progress | 3 endpoints |
| Learning Plans | 3 endpoints |
| **Total** | **32 endpoints** |

---

## 5. Testing

- **Backend**: Unit tests for services and repositories using H2 in-memory database
- **Frontend**: Component testing with React Testing Library (where applicable)
- **Integration**: Manual testing of all 32 API endpoints using the frontend UI
- **CI/CD**: GitHub Actions runs backend tests and frontend linting/building on every push

---

## 6. Future Enhancements

- Real-time notifications using WebSocket (SocketJS)
- Direct messaging between users
- Video streaming with adaptive bitrate
- Gamification with leaderboards and experience points
- Mobile app using React Native
- AI-powered skill recommendations
- Scheduled email digests for unread notifications
