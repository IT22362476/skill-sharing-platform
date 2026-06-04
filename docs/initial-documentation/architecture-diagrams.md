# Architecture Diagrams
## Skill Sharing & Learning Platform

## 1. Overall System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        FB[React Frontend<br/>localhost:3000]
        MB[Mobile Browser]
    end

    subgraph "OAuth Providers"
        GOOGLE[Google OAuth 2.0]
        GITHUB[GitHub OAuth 2.0]
    end

    subgraph "Server Layer"
        API[Spring Boot REST API<br/>localhost:8080/api]
        WS[Static File Server<br/>localhost:8080/uploads]
    end

    subgraph "Security Layer"
        JWT[JWT Authentication Filter]
        OAUTH2[OAuth2 Login Handler]
        CORS[CORS Filter]
    end

    subgraph "Data Layer"
        PG[(PostgreSQL Database<br/>skillshare)]
        FLYWAY[Flyway Migrations]
    end

    FB -->|Axios HTTP| API
    FB -->|Redirect| OAUTH2
    OAUTH2 --> GOOGLE
    OAUTH2 --> GITHUB
    API --> JWT
    API --> CORS
    API --> WS
    API --> PG
    FLYWAY --> PG

    style FB fill:#61dafb,color:#000
    style API fill:#6db33f,color:#fff
    style PG fill:#336791,color:#fff
```

## 2. REST API Architecture

```mermaid
graph TB
    subgraph "Spring Boot Backend"
        direction TB
        
        subgraph "Controllers Layer"
            AC[AuthController<br/>/api/auth]
            UC[UserController<br/>/api/users]
            PC[PostController<br/>/api/posts]
            CC[CommentController<br/>/api/comments]
            NC[NotificationController<br/>/api/notifications]
            LC[LearningController<br/>/api/progress, /api/plans]
        end

        subgraph "Services Layer"
            AS[AuthService]
            US[UserService]
            PS[PostService]
            CS[CommentService]
            NS[NotificationService]
            LS[LearningService]
        end

        subgraph "Repositories Layer"
            UR[UserRepository]
            PR[PostRepository]
            MR[MediaRepository]
            LR[LikeRepository]
            CR[CommentRepository]
            FR[FollowRepository]
            NR[NotificationRepository]
            LPR[LearningProgressRepository]
            LPR2[LearningPlanRepository]
            BR[BadgeRepository]
        end

        subgraph "Data Models"
            U[User Entity]
            P[Post Entity]
            M[Media Entity]
            L[Like Entity]
            C[Comment Entity]
            F[Follow Entity]
            N[Notification Entity]
            LP[LearningProgress Entity]
            PL[LearningPlan Entity]
            B[Badge Entity]
        end

        subgraph "Security"
            JWT[JWT Util]
            SF[JWT Auth Filter]
            OSH[OAuth2 Success Handler]
        end

        AC --> AS
        UC --> US
        PC --> PS
        CC --> CS
        NC --> NS
        LC --> LS

        AS --> UR
        US --> UR
        US --> FR
        PS --> PR
        PS --> MR
        PS --> LR
        PS --> NR
        PS --> UR
        CS --> CR
        CS --> PR
        CS --> NR
        NS --> NR
        LS --> LPR
        LS --> LPR2
        LS --> BR
        LS --> UR

        AC --> JWT
        PC --> JWT
        SF --> JWT
        OSH --> JWT
        OSH --> UR

        PR --> P
        MR --> M
        LR --> L
        CR --> C
        FR --> F
        NR --> N
        LPR --> LP
        LPR2 --> PL
        UR --> U
        BR --> B
    end

    DB[(PostgreSQL)]
    UR --> DB
    PR --> DB
    MR --> DB
    LR --> DB
    CR --> DB
    FR --> DB
    NR --> DB
    LPR --> DB
    LPR2 --> DB
    BR --> DB
```

## 3. Frontend Component Hierarchy

```mermaid
graph TB
    subgraph "React Frontend"
        A[App.js]
        A --> TC[ThemeContext]
        A --> AUTH[AuthContext]
        A --> R[Router]
        A --> T[Toast Container]

        subgraph "Layout"
            N[Navbar]
            N --> ND[NotificationsDropdown]
        end

        subgraph "Public Pages"
            LP[LoginPage]
            FP[FeedPage]
            PDP[PostDetailPage]
            PP[ProfilePage]
            USP[UserSearchPage]
            OA[OAuthRedirectHandler]
        end

        subgraph "Protected Pages"
            CPP[CreatePostPage]
            MLP[MyLearningPage]
            CPGP[CreateProgressPage]
            CPLP[CreatePlanPage]
        end

        subgraph "Components"
            PC[PostCard]
            CS[CommentSection]
            FB[FollowButton]
            PT[ProgressTimeline]
            PLC[PlanCard]
        end

        A --> N
        R --> LP
        R --> FP
        R --> PDP
        R --> PP
        R --> USP
        R --> OA
        R --> CPP
        R --> MLP
        R --> CPGP
        R --> CPLP

        FP --> PC
        PDP --> PC
        PDP --> CS
        PP --> PC
        PP --> PT
        PP --> PLC
        PP --> FB
        USP --> FB
        MLP --> PT
        MLP --> PLC
        CPGP --> PT
    end

    subgraph "API Services"
        SAPI[api.js]
        SAPI --> AUTHAPI[authAPI]
        SAPI --> USERAPI[userAPI]
        SAPI --> POSTAPI[postAPI]
        SAPI --> COMMENTAPI[commentAPI]
        SAPI --> NOTIFAPI[notificationAPI]
        SAPI --> PROGAPI[progressAPI]
        SAPI --> PLANAPI[planAPI]
    end

    LP --> AUTHAPI
    PC --> POSTAPI
    CS --> COMMENTAPI
    FB --> USERAPI
    ND --> NOTIFAPI
    PT --> PROGAPI
    PLC --> PLANAPI
    CPP --> POSTAPI
    CPGP --> PROGAPI
    CPLP --> PLANAPI

    style A fill:#61dafb,color:#000
    style SAPI fill:#764abc,color:#fff
```

## 4. Database Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Post : creates
    User ||--o{ Like : gives
    User ||--o{ Comment : writes
    User ||--o{ Follow : follows
    User ||--o{ Follow : "is followed by"
    User ||--o{ Notification : receives
    User ||--o{ LearningProgress : logs
    User ||--o{ LearningPlan : creates
    User ||--o{ Badge : earns

    Post ||--o{ Media : contains
    Post ||--o{ Like : has
    Post ||--o{ Comment : has

    User {
        bigint id PK
        varchar email UK
        varchar username UK
        varchar password "nullable for OAuth"
        varchar avatar_url
        text bio
        timestamp join_date
        enum provider "GOOGLE | GITHUB | EMAIL"
        varchar provider_id
    }

    Post {
        bigint id PK
        text content
        bigint user_id FK
        int like_count
        varchar skill_category
        boolean is_public
        timestamp created_at
        timestamp updated_at
    }

    Media {
        bigint id PK
        bigint post_id FK
        varchar url
        enum type "IMAGE | VIDEO"
        int duration_seconds
    }

    Like {
        bigint id PK
        bigint post_id FK
        bigint user_id FK
        timestamp created_at
        "UK(post_id, user_id)"
    }

    Comment {
        bigint id PK
        bigint post_id FK
        bigint user_id FK
        text content
        timestamp created_at
        timestamp updated_at
    }

    Follow {
        bigint id PK
        bigint follower_id FK
        bigint following_id FK
        timestamp created_at
        "UK(follower_id, following_id)"
    }

    Notification {
        bigint id PK
        bigint user_id FK
        enum type "LIKE | COMMENT"
        bigint post_id FK
        bigint triggered_by_user_id FK
        boolean is_read
        timestamp created_at
    }

    LearningProgress {
        bigint id PK
        bigint user_id FK
        varchar skill_category
        enum template_type "COMPLETED_TUTORIAL | NEW_SKILL | TIME_SPENT"
        text content
        timestamp created_at
    }

    LearningPlan {
        bigint id PK
        bigint user_id FK
        varchar title
        text description
        jsonb topics
        jsonb resources
        date start_date
        date target_date
        enum status "NOT_STARTED | IN_PROGRESS | COMPLETED"
        text progress_notes
        timestamp created_at
        timestamp updated_at
    }

    Badge {
        bigint id PK
        bigint user_id FK
        varchar name
        text description
        timestamp awarded_at
    }
```

## 5. Authentication Flow

```mermaid
sequenceDiagram
    participant U as User/Browser
    participant F as React Frontend
    participant B as Spring Boot Backend
    participant O as OAuth Provider
    participant DB as PostgreSQL

    Note over U,DB: Email/Password Flow
    U->>F: Enter email & password
    F->>B: POST /api/auth/login
    B->>DB: Find user by email
    B->>B: Verify BCrypt password
    B->>B: Generate JWT token
    B-->>F: Return { token, user }
    F->>F: Store token in localStorage
    F->>F: Set user in AuthContext

    Note over U,DB: OAuth Flow
    U->>F: Click "Login with Google"
    F->>B: GET /api/auth/oauth2/google
    B-->>F: Return OAuth URL
    F->>O: Redirect to Google consent
    O->>F: Redirect back with auth code
    F->>B: Backend handles OAuth callback
    B->>O: Exchange code for access token
    B->>O: Fetch user info
    B->>DB: Find/create local user
    B->>B: Generate JWT token
    B-->>F: Redirect to /oauth2/redirect?token=...
    F->>F: Store token, load user

    Note over U,DB: Authenticated Requests
    F->>B: GET /api/posts (Authorization: Bearer JWT)
    B->>B: JWT filter validates token
    B-->>F: 200 OK with data
```

## 6. CI/CD Pipeline

```mermaid
graph LR
    PUSH[Push to main/PR] --> CHECKOUT[Checkout Code]
    CHECKOUT --> BACKEND[Backend Job]
    CHECKOUT --> FRONTEND[Frontend Job]
    
    subgraph "Backend"
        BACKEND --> JDK[Set up JDK 17]
        JDK --> POSTGRES[Start PostgreSQL Service]
        POSTGRES --> MVN[mvn test]
        MVN --> BRESULT{Pass/Fail}
    end

    subgraph "Frontend"
        FRONTEND --> NODE[Set up Node.js 20]
        NODE --> INSTALL[npm ci]
        INSTALL --> LINT[npm run lint]
        LINT --> BUILD[npm run build]
        BUILD --> FRESULT{Pass/Fail}
    end

    BRESULT -->|Pass| MERGE[Ready to Merge]
    FRESULT -->|Pass| MERGE
    BRESULT -->|Fail| BLOCK[Block Merge]
    FRESULT -->|Fail| BLOCK
```
