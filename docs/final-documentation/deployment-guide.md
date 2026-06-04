# Deployment Guide
## Skill Sharing & Learning Platform

## Prerequisites

### Required Software
- **Java 17** (JDK) - [Download](https://adoptium.net/)
- **Node.js 20+** - [Download](https://nodejs.org/)
- **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/)
- **Maven 3.8+** (or use the included Maven wrapper)
- **Git** - [Download](https://git-scm.com/)

### Optional
- **Docker Desktop** - For containerized PostgreSQL
- **IDE** (IntelliJ IDEA, VS Code)

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd skill-sharing-platform
```

---

## 2. Database Setup

### Option A: Using Local PostgreSQL

1. Install PostgreSQL 15+ on your machine
2. Create the database:
   ```bash
   psql -U postgres
   CREATE DATABASE skillshare;
   \q
   ```
3. Set environment variables (optional - defaults are used in application.yml):
   ```bash
   export DB_USERNAME=postgres
   export DB_PASSWORD=postgres
   ```

### Option B: Using Docker

```bash
docker run --name skillshare-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=skillshare \
  -p 5432:5432 \
  -d postgres:15
```

---

## 3. OAuth 2.0 Configuration

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to APIs & Services → Credentials
4. Create OAuth 2.0 Client ID (Web application)
5. Add Authorized redirect URIs:
   - `http://localhost:8080/login/oauth2/code/google`
6. Add Authorized JavaScript origins:
   - `http://localhost:3000`
7. Note your Client ID and Client Secret

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:8080/login/oauth2/code/github`
5. Note your Client ID and Client Secret

### Set Environment Variables
```bash
export GOOGLE_CLIENT_ID=your-google-client-id
export GOOGLE_CLIENT_SECRET=your-google-client-secret
export GITHUB_CLIENT_ID=your-github-client-id
export GITHUB_CLIENT_SECRET=your-github-client-secret
export JWT_SECRET=your-256-bit-secret-key-change-in-production
```

---

## 4. Backend Setup & Run

### Using Maven Wrapper (Recommended)

```bash
cd backend

# Make the wrapper executable
chmod +x mvnw

# Build the project (skip tests for quick setup)
./mvnw clean package -DskipTests

# Run the application
./mvnw spring-boot:run
```

### Using Maven (Installed)

```bash
cd backend
mvn clean package -DskipTests
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`.

### Verify Backend
```bash
curl http://localhost:8080/api/auth/user
# Should return 401 (unauthorized) - means the server is running
```

---

## 5. Frontend Setup & Run

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will start on `http://localhost:3000`.

The frontend is configured with a proxy to `http://localhost:8080` in `package.json`, so API requests are forwarded automatically.

---

## 6. Verify Full Setup

1. Open `http://localhost:3000` in your browser
2. You should see the Login/Register page
3. Create an account using email/password or login with Google/GitHub
4. After login, you can:
   - View the feed
   - Create posts with media
   - Follow users
   - Comment on posts
   - Log learning progress
   - Create learning plans
   - View notifications

---

## 7. Running Tests

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Lint & Build
```bash
cd frontend
npm run lint
npm run build
```

---

## 8. Production Deployment Considerations

For production deployment, update the following in `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://<production-db-host>:5432/skillshare
    username: <production-username>
    password: <production-password>

app:
  jwt:
    secret: <strong-256-bit-secret>
    expiration-ms: 86400000

cors:
  allowed-origins: https://your-production-domain.com

server:
  ssl:
    enabled: true
  # Add SSL certificate configuration
```

### Build for Production
```bash
# Backend
cd backend && ./mvnw clean package -DskipTests
java -jar target/skill-sharing-platform-1.0.0.jar

# Frontend
cd frontend && npm run build
# Serve the build/ folder with a static file server (nginx, etc.)
```

---

## 9. Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start - port in use | Change `server.port` in application.yml or kill process on port 8080 |
| Frontend can't connect to backend | Check proxy setting in package.json. Ensure backend is running on 8080 |
| Database connection refused | Ensure PostgreSQL is running. Check credentials in application.yml |
| OAuth login fails | Verify redirect URIs match exactly in OAuth provider settings |
| File upload fails | Check `app.upload.dir` exists and has write permissions |
| CORS errors | Ensure `cors.allowed-origins` includes `http://localhost:3000` |

---

## 10. Docker Deployment (Optional)

Create `docker-compose.yml` (not included - create if needed):

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: skillshare
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      DB_USERNAME: postgres
      DB_PASSWORD: postgres
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/skillshare
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  pgdata:
```
