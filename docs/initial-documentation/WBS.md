# Work Breakdown Structure (WBS)
## IT3030 - PAF Assignment 2025 - Skill Sharing & Learning Platform

### Project Overview
A full-stack web application for skill-sharing where users can post skill demonstrations, track learning progress, create learning plans, and interact with other users through comments, likes, and follows.

### Team Structure
- **Member 1**: Authentication + Notifications + Profile
- **Member 2**: Skill-Sharing Posts + Media Upload + Likes
- **Member 3**: Comments + Follow System + User Search
- **Member 4**: Learning Progress + Learning Plans

---

### Level 1: Project Management
| WBS Code | Task | Assigned To | Duration | Dependencies |
|----------|------|-------------|----------|--------------|
| 1.1 | Project planning & setup | All members | 2 days | None |
| 1.2 | Requirements gathering | All members | 1 day | 1.1 |
| 1.3 | Technology stack decision | All members | 1 day | 1.2 |
| 1.4 | GitHub repository setup | Member 1 | 0.5 day | 1.1 |
| 1.5 | CI/CD pipeline setup | Member 1 | 0.5 day | 1.4 |

### Level 2: Backend Development - Database & Core
| WBS Code | Task | Assigned To | Duration | Dependencies |
|----------|------|-------------|----------|--------------|
| 2.1 | Database schema design | All members | 1 day | 1.3 |
| 2.2 | PostgreSQL database setup | Member 1 | 1 day | 2.1 |
| 2.3 | Flyway migration scripts | Member 1 | 1 day | 2.2 |
| 2.4 | JPA entities creation | All members | 2 days | 2.3 |
| 2.5 | Repository interfaces | All members | 1 day | 2.4 |
| 2.6 | Spring Boot project scaffold | Member 1 | 1 day | 1.3 |

### Level 3: Backend - API Endpoints per Member

#### Member 1: Auth + Notifications + Profile
| WBS Code | Task | Duration | Dependencies |
|----------|------|----------|--------------|
| 3.1.1 | AuthController & AuthService | 2 days | 2.5, 2.6 |
| 3.1.2 | JWT token generation & validation | 1 day | 3.1.1 |
| 3.1.3 | OAuth2 Google/GitHub integration | 2 days | 3.1.1 |
| 3.1.4 | User profile endpoint (GET/PUT) | 1 day | 2.5 |
| 3.1.5 | Notification endpoints (GET/PUT/DELETE) | 2 days | 2.5 |
| 3.1.6 | Security config & CORS setup | 1 day | 3.1.2 |
| 3.1.7 | Global exception handler | 0.5 day | 3.1.1 |

#### Member 2: Posts + Media + Likes
| WBS Code | Task | Duration | Dependencies |
|----------|------|----------|--------------|
| 3.2.1 | PostController & PostService | 2 days | 2.5, 2.6 |
| 3.2.2 | Media upload endpoint | 2 days | 3.2.1 |
| 3.2.3 | Feed endpoint (public + followed) | 1 day | 3.2.1 |
| 3.2.4 | Post detail with comments/likes | 1 day | 3.2.1 |
| 3.2.5 | Like/unlike endpoints | 1 day | 3.2.1 |
| 3.2.6 | Search posts by category/keyword | 1 day | 3.2.1 |

#### Member 3: Comments + Follows + Search
| WBS Code | Task | Duration | Dependencies |
|----------|------|----------|--------------|
| 3.3.1 | CommentController & CommentService | 2 days | 2.5, 2.6 |
| 3.3.2 | Follow/unfollow endpoints | 1 day | 2.5 |
| 3.3.3 | User search endpoint | 1 day | 2.5 |
| 3.3.4 | Post owner comment deletion | 0.5 day | 3.3.1 |

#### Member 4: Learning Progress + Plans
| WBS Code | Task | Duration | Dependencies |
|----------|------|----------|--------------|
| 3.4.1 | LearningProgress endpoints (CRUD) | 2 days | 2.5, 2.6 |
| 3.4.2 | LearningPlan endpoints (CRUD) | 2 days | 2.5, 2.6 |
| 3.4.3 | Plan status update & progress notes | 1 day | 3.4.2 |
| 3.4.4 | Badge awarding on plan completion | 1 day | 3.4.2 |

### Level 4: Frontend Development

#### Member 1: Auth UI + Profile + Notifications
| WBS Code | Task | Duration | Dependencies |
|----------|------|----------|--------------|
| 4.1.1 | React project scaffold & routing | 1 day | 3.1.6 |
| 4.1.2 | AuthContext (login state management) | 1 day | 4.1.1 |
| 4.1.3 | LoginPage (OAuth + email/password) | 1 day | 4.1.2, 3.1.3 |
| 4.1.4 | OAuth redirect handler | 0.5 day | 4.1.3 |
| 4.1.5 | ProfilePage (view/edit) | 2 days | 4.1.2, 3.1.4 |
| 4.1.6 | NotificationsDropdown component | 1 day | 4.1.2, 3.1.5 |
| 4.1.7 | Navbar with auth state | 1 day | 4.1.2 |

#### Member 2: Feed + Post UI
| WBS Code | Task | Duration | Dependencies |
|----------|------|----------|--------------|
| 4.2.1 | FeedPage with infinite scroll | 2 days | 4.1.1, 3.2.3 |
| 4.2.2 | PostCard component | 1 day | 4.2.1 |
| 4.2.3 | CreatePostPage with drag-drop upload | 2 days | 4.1.2, 3.2.1 |
| 4.2.4 | PostDetailPage | 1 day | 4.2.2, 3.2.4 |

#### Member 3: Comments + Social UI
| WBS Code | Task | Duration | Dependencies |
|----------|------|----------|--------------|
| 4.3.1 | CommentSection component | 2 days | 4.1.2, 3.3.1 |
| 4.3.2 | FollowButton component | 1 day | 4.1.2, 3.3.2 |
| 4.3.3 | UserSearchPage | 1 day | 4.1.2, 3.3.3 |
| 4.3.4 | UserProfilePage (public view) | 2 days | 4.3.2, 3.1.4 |

#### Member 4: Learning UI
| WBS Code | Task | Duration | Dependencies |
|----------|------|----------|--------------|
| 4.4.1 | ProgressTimeline component | 1 day | 4.1.2, 3.4.1 |
| 4.4.2 | CreateProgressPage (templates) | 1 day | 4.4.1 |
| 4.4.3 | PlanCard component | 1 day | 4.1.2, 3.4.2 |
| 4.4.4 | CreatePlanPage (multi-step form) | 2 days | 4.4.3 |
| 4.4.5 | MyLearningPage (dashboard) | 1 day | 4.4.1, 4.4.3 |

### Level 5: Testing & Documentation
| WBS Code | Task | Assigned To | Duration | Dependencies |
|----------|------|-------------|----------|--------------|
| 5.1 | Backend unit tests | All members | 2 days | 3.x.x |
| 5.2 | Frontend testing | All members | 1 day | 4.x.x |
| 5.3 | API integration testing | All members | 2 days | 3.x.x |
| 5.4 | Initial documentation | All members | 2 days | 1.2 |
| 5.5 | Final documentation | All members | 3 days | 5.3 |
| 5.6 | Deployment guide | Member 1 | 1 day | 5.3 |

### Level 6: Enhancements (Extra Marks)
| WBS Code | Task | Assigned To | Duration | Dependencies |
|----------|------|-------------|----------|--------------|
| 6.1 | Skill badges on plan completion | Member 4 | 1 day | 3.4.2 |
| 6.2 | Search posts by skill/keyword | Member 2 | 1 day | 3.2.1 |
| 6.3 | Dark mode toggle | Member 1 | 0.5 day | 4.1.1 |
| 6.4 | Export learning plan as PDF | Member 4 | 1 day | 4.4.4 |

---

### Milestones
| Milestone | Description | Due Date |
|-----------|-------------|----------|
| M1 | Project setup & repository created | March 10 |
| M2 | Initial documentation (WBS, requirements, diagrams) | March 17 |
| M3 | Backend API complete (all endpoints) | April 7 |
| M4 | Frontend UI complete (all pages) | April 18 |
| M5 | Integration testing & bug fixes | April 25 |
| M6 | Final documentation & deployment guide | May 2 |
