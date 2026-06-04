# Non-Functional Requirements
## Skill Sharing & Learning Platform

### NFR1: REST Constraints
| ID | Requirement | Details |
|----|-------------|---------|
| NFR1.1 | **Stateless** | Each API request must contain all necessary information. Server does not store client session state. JWT tokens are used for authentication state on the client side |
| NFR1.2 | **Uniform Interface** | All endpoints follow consistent naming conventions (/api/resource/{id}), use standard HTTP methods (GET, POST, PUT, DELETE), and return consistent JSON response structures |
| NFR1.3 | **Cacheable** | GET endpoints for feed, posts, and profiles should support caching headers to improve performance |
| NFR1.4 | **Layered System** | Architecture enforces separation: Controller → Service → Repository → Database. The frontend and backend are separate layers communicating via HTTP |

### NFR2: Security
| ID | Requirement | Details |
|----|-------------|---------|
| NFR2.1 | **Password Encryption** | All user passwords are encrypted using BCrypt with a minimum strength of 10 rounds |
| NFR2.2 | **JWT Token Security** | JWT tokens are signed with HMAC-SHA256. Tokens expire after 24 hours (configurable). Tokens are transmitted via Authorization: Bearer header |
| NFR2.3 | **OAuth 2.0** | OAuth2 login uses the Authorization Code flow with PKCE. Client secrets are stored server-side only |
| NFR2.4 | **Input Validation** | All DTOs are validated using @Valid annotations with appropriate constraints (@NotBlank, @Email, @Size, etc.) |
| NFR2.5 | **SQL Injection Prevention** | All database queries use JPA/Spring Data with parameterized queries. No raw SQL concatenation |
| NFR2.6 | **CORS** | Cross-Origin Resource Sharing is configured to only allow requests from http://localhost:3000 |
| NFR2.7 | **HTTPS** | In production, all traffic must be served over HTTPS |

### NFR3: Performance
| ID | Requirement | Details |
|----|-------------|---------|
| NFR3.1 | **Pagination** | All list endpoints support pagination with page, size, and sort parameters. Default page size is 10-20 items |
| NFR3.2 | **Database Indexes** | Indexes on commonly queried columns: user_id, post_id, follower_id, following_id, created_at |
| NFR3.3 | **File Size Limit** | Media uploads are limited to 10MB per file, max 3 files per post |
| NFR3.4 | **Response Time** | API responses should complete within 500ms for read operations and 2s for write operations (under normal load) |

### NFR4: Scalability
| ID | Requirement | Details |
|----|-------------|---------|
| NFR4.1 | **Horizontal Scaling** | The backend is stateless, allowing multiple instances behind a load balancer |
| NFR4.2 | **Database Connection Pooling** | HikariCP is configured for efficient database connection management |
| NFR4.3 | **Static File Serving** | Uploaded media files are served directly without going through the application logic layer |

### NFR5: Reliability & Availability
| ID | Requirement | Details |
|----|-------------|---------|
| NFR5.1 | **Error Handling** | All exceptions are caught by a global exception handler returning consistent JSON error responses |
| NFR5.2 | **Graceful Degradation** | If the backend is unavailable, the frontend should display appropriate error messages without crashing |
| NFR5.3 | **Validation Messages** | All validation errors return descriptive messages in the user's language |

### NFR6: Maintainability
| ID | Requirement | Details |
|----|-------------|---------|
| NFR6.1 | **Code Organization** | Backend follows standard Spring Boot layered architecture (Controller, Service, Repository, Entity, DTO) |
| NFR6.2 | **Component-Based Frontend** | Frontend is organized into reusable components with clear separation of concerns |
| NFR6.3 | **API Documentation** | All endpoints are documented with request/response examples |
| NFR6.4 | **Version Control** | Git with feature branches, meaningful commit messages, and pull request reviews |

### NFR7: Usability
| ID | Requirement | Details |
|----|-------------|---------|
| NFR7.1 | **Mobile Responsive** | The frontend UI must be responsive and work on mobile devices (320px+) |
| NFR7.2 | **Loading States** | All data-fetching operations must show loading indicators |
| NFR7.3 | **Error Feedback** | User actions must provide feedback via toast notifications for success/error states |
| NFR7.4 | **Optimistic Updates** | Likes and follows should update optimistically in the UI before server confirmation |
| NFR7.5 | **Dark Mode** | Users can toggle between light and dark themes. Preference is persisted in localStorage |

### NFR8: Code Quality
| ID | Requirement | Details |
|----|-------------|---------|
| NFR8.1 | **Java Conventions** | Follow standard Java naming conventions (camelCase, PascalCase, UPPER_SNAKE_CASE) |
| NFR8.2 | **ESLint** | Frontend code must pass ESLint checks with the standard React plugin configuration |
| NFR8.3 | **Prettier** | Frontend code should follow Prettier formatting rules |
| NFR8.4 | **DRY Principle** | Avoid code duplication. Extract common functionality into reusable services/utilities |

### NFR9: Development Workflow
| ID | Requirement | Details |
|----|-------------|---------|
| NFR9.1 | **CI/CD** | GitHub Actions runs backend tests and frontend linting/building on every push to main and pull requests |
| NFR9.2 | **Feature Branches** | All development work must be done on feature branches before merging to main via pull requests |
| NFR9.3 | **Database Migrations** | Schema changes must go through Flyway migration scripts for version-controlled database evolution |

### NFR10: Technology Stack
| ID | Technology | Version |
|----|------------|---------|
| NFR10.1 | Java | 17 |
| NFR10.2 | Spring Boot | 3.2.x |
| NFR10.3 | PostgreSQL | 15+ |
| NFR10.4 | React | 18+ |
| NFR10.5 | MUI (Material-UI) | 5.x |
| NFR10.6 | Node.js | 20+ |
| NFR10.7 | Maven | 3.8+ |
