# API Documentation
## Skill Sharing & Learning Platform

**Base URL**: `http://localhost:8080/api`

**Authentication**: JWT token passed as `Authorization: Bearer <token>` header.

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user with email/password.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "username": "johndoe",
    "avatarUrl": null,
    "bio": null,
    "joinDate": "2025-03-17T10:30:00",
    "provider": "EMAIL",
    "followerCount": 0,
    "followingCount": 0,
    "isFollowing": false
  }
}
```

**Errors:** 400 (validation), 409 (email/username taken)

---

### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):** Same structure as register response.

**Errors:** 400 (invalid credentials), 401 (wrong provider)

---

### GET /api/auth/user
Get the currently authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "john@example.com",
  "username": "johndoe",
  "avatarUrl": "https://...",
  "bio": "Software developer",
  "joinDate": "2025-03-17T10:30:00",
  "provider": "EMAIL",
  "followerCount": 5,
  "followingCount": 3,
  "isFollowing": false
}
```

**Errors:** 401 (unauthorized)

---

### GET /api/auth/oauth2/{provider}
Initiate OAuth login. Provider can be `google` or `github`.

**Response (200 OK):**
```json
{
  "url": "/oauth2/authorization/google"
}
```

**Actual OAuth flow:** Frontend redirects to `/oauth2/authorization/google` which triggers the Spring Security OAuth2 client flow.

---

## User Endpoints

### GET /api/users/{userId}
Get a user's public profile.

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "john@example.com",
  "username": "johndoe",
  "avatarUrl": "https://...",
  "bio": "Software developer",
  "joinDate": "2025-03-17T10:30:00",
  "provider": "EMAIL",
  "followerCount": 10,
  "followingCount": 5,
  "isFollowing": true
}
```

**Errors:** 404 (user not found)

---

### PUT /api/users/profile
Update own profile (authenticated).

**Request Body:**
```json
{
  "username": "newusername",
  "bio": "Updated bio text",
  "avatarUrl": "https://new-avatar-url.com/avatar.jpg"
}
```

**Response (200 OK):** Updated user object.

**Errors:** 400 (validation, duplicate username), 401 (unauthorized)

---

### GET /api/users/search?q={query}
Search users by username.

**Response (200 OK):**
```json
[
  {
    "id": 2,
    "username": "janedoe",
    "avatarUrl": "https://...",
    "bio": "Designer",
    "followerCount": 3,
    "followingCount": 7,
    "isFollowing": false
  }
]
```

---

### POST /api/users/{userId}/follow
Follow a user (authenticated).

**Response:** 201 Created

**Errors:** 400 (self-follow, already following, not found)

---

### DELETE /api/users/{userId}/follow
Unfollow a user (authenticated).

**Response:** 204 No Content

**Errors:** 400 (not following)

---

## Post Endpoints

### POST /api/posts
Create a new post (authenticated, multipart/form-data).

**Form Data:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| content | text | Yes | Post text content |
| skillCategory | text | No | Skill category tag |
| files | file[] | No | Up to 3 files (JPEG/PNG/MP4, max 10MB each) |

**Response (201 Created):**
```json
{
  "id": 1,
  "content": "Just completed a React tutorial!",
  "userId": 1,
  "username": "johndoe",
  "userAvatarUrl": "https://...",
  "likeCount": 0,
  "commentCount": 0,
  "likedByCurrentUser": false,
  "mediaList": [
    {
      "id": 1,
      "url": "/uploads/1/uuid.jpg",
      "type": "IMAGE",
      "durationSeconds": null
    }
  ],
  "skillCategory": "Web Development",
  "createdAt": "2025-03-17T11:00:00",
  "updatedAt": null
}
```

**Errors:** 400 (validation, file size/type), 401 (unauthorized)

---

### GET /api/posts?page=0&size=10
Get feed (public + followed users). Paginated.

**Response (200 OK):**
```json
{
  "content": [ ...post objects... ],
  "pageable": { ... },
  "totalPages": 5,
  "totalElements": 50,
  "last": false
}
```

---

### GET /api/posts/{id}
Get single post detail with comments and likes.

**Response (200 OK):**
```json
{
  "id": 1,
  "content": "Post content...",
  "userId": 1,
  "username": "johndoe",
  "userAvatarUrl": "https://...",
  "likeCount": 5,
  "likedByCurrentUser": true,
  "mediaList": [ ...media objects... ],
  "comments": [ ...comment objects... ],
  "skillCategory": "Web Development",
  "isOwner": true,
  "createdAt": "2025-03-17T11:00:00",
  "updatedAt": null
}
```

**Errors:** 404 (not found)

---

### DELETE /api/posts/{id}
Delete own post (authenticated).

**Response:** 204 No Content

**Errors:** 403 (not owner), 404 (not found)

---

### POST /api/posts/{id}/like
Like a post (authenticated).

**Response:** 201 Created

**Errors:** 400 (already liked), 404 (post not found)

---

### DELETE /api/posts/{id}/like
Unlike a post (authenticated).

**Response:** 204 No Content

**Errors:** 400 (not liked), 404 (post not found)

---

### GET /api/posts/search?skillCategory=Web&keyword=react&page=0&size=10
Search posts by skill category and/or keyword.

**Response (200 OK):** Paginated list of posts.

---

## Comment Endpoints

### POST /api/posts/{postId}/comments
Add comment to post (authenticated).

**Request Body:**
```json
{
  "content": "Great work!"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "postId": 1,
  "userId": 2,
  "username": "janedoe",
  "userAvatarUrl": "https://...",
  "content": "Great work!",
  "isOwner": true,
  "createdAt": "2025-03-17T12:00:00",
  "updatedAt": null
}
```

---

### GET /api/posts/{postId}/comments?page=0&size=10
Get comments for a post. Paginated.

**Response (200 OK):** Paginated list of comments.

---

### PUT /api/comments/{id}
Edit own comment (authenticated).

**Request Body:**
```json
{
  "content": "Updated comment text"
}
```

**Response (200 OK):** Updated comment object.

**Errors:** 403 (not owner), 404 (not found)

---

### DELETE /api/comments/{id}
Delete own comment (authenticated).

**Response:** 204 No Content

**Errors:** 403 (not owner), 404 (not found)

---

### DELETE /api/posts/{postId}/comments/{commentId}
Post owner deletes any comment on their post (authenticated).

**Response:** 204 No Content

**Errors:** 403 (not post owner), 404 (not found)

---

## Notification Endpoints

### GET /api/notifications?page=0&size=20
Get user notifications (authenticated). Paginated.

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "type": "LIKE",
      "postId": 1,
      "triggeredByUserId": 2,
      "triggeredByUsername": "janedoe",
      "triggeredByAvatarUrl": "https://...",
      "isRead": false,
      "createdAt": "2025-03-17T12:00:00"
    }
  ],
  ...
}
```

---

### GET /api/notifications/unread-count
Get unread notification count (authenticated).

**Response (200 OK):**
```json
{
  "count": 3
}
```

---

### PUT /api/notifications/{id}/read
Mark notification as read (authenticated).

**Response:** 200 OK

**Errors:** 403 (not owner), 404 (not found)

---

### PUT /api/notifications/read-all
Mark all notifications as read (authenticated).

**Response:** 200 OK

---

### DELETE /api/notifications/{id}
Delete a notification (authenticated).

**Response:** 204 No Content

---

## Learning Progress Endpoints

### POST /api/progress
Create progress update (authenticated).

**Request Body:**
```json
{
  "templateType": "COMPLETED_TUTORIAL",
  "skillCategory": "Web Development",
  "content": "Completed React tutorial on building a todo app"
}
```

Template types: `COMPLETED_TUTORIAL`, `NEW_SKILL`, `TIME_SPENT`

**Response (201 Created):**
```json
{
  "id": 1,
  "userId": 1,
  "username": "johndoe",
  "skillCategory": "Web Development",
  "templateType": "COMPLETED_TUTORIAL",
  "content": "Completed React tutorial on building a todo app",
  "createdAt": "2025-03-17T14:00:00"
}
```

---

### GET /api/progress/user/{userId}?page=0&size=10
Get user's progress updates. Paginated.

---

### DELETE /api/progress/{id}
Delete own progress update (authenticated).

**Response:** 204 No Content

---

## Learning Plan Endpoints

### POST /api/plans
Create a learning plan (authenticated).

**Request Body:**
```json
{
  "title": "Learn Full-Stack Web Development",
  "description": "A comprehensive plan to become a full-stack developer",
  "topics": ["HTML", "CSS", "JavaScript", "React", "Node.js", "PostgreSQL"],
  "resources": ["https://react.dev", "https://nodejs.org"],
  "startDate": "2025-03-17",
  "targetDate": "2025-06-17"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "userId": 1,
  "username": "johndoe",
  "title": "Learn Full-Stack Web Development",
  "description": "A comprehensive plan...",
  "topics": ["HTML", "CSS", "JavaScript", "React", "Node.js", "PostgreSQL"],
  "resources": ["https://react.dev", "https://nodejs.org"],
  "startDate": "2025-03-17",
  "targetDate": "2025-06-17",
  "status": "NOT_STARTED",
  "progressNotes": null,
  "createdAt": "2025-03-17T15:00:00",
  "updatedAt": null
}
```

---

### GET /api/plans/user/{userId}
Get user's learning plans.

**Response (200 OK):** Array of plan objects.

---

### PUT /api/plans/{id}
Update plan status and progress notes (authenticated).

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "progressNotes": "Completed HTML and CSS modules. Starting JavaScript next."
}
```

Status values: `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`

**Response (200 OK):** Updated plan object (with badge if newly completed).

---

## Error Response Format

All errors return:

```json
{
  "status": 400,
  "message": "Validation failed",
  "timestamp": "2025-03-17T10:00:00",
  "errors": ["Email is required", "Password must be at least 6 characters"]
}
```

## HTTP Status Codes Summary

| Method | Success | Client Error | Server Error |
|--------|---------|--------------|--------------|
| GET | 200 OK | 400, 401, 404 | 500 |
| POST | 201 Created | 400, 401, 409 | 500 |
| PUT | 200 OK | 400, 401, 403, 404 | 500 |
| DELETE | 204 No Content | 401, 403, 404 | 500 |
