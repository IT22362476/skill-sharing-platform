-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    avatar_url VARCHAR(1024),
    bio TEXT,
    join_date TIMESTAMP NOT NULL DEFAULT NOW(),
    provider VARCHAR(20) NOT NULL,
    provider_id VARCHAR(255)
);

CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_username ON users(username);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    like_count INTEGER DEFAULT 0,
    skill_category VARCHAR(255),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE INDEX idx_post_user_id ON posts(user_id);
CREATE INDEX idx_post_created_at ON posts(created_at);

-- Media table
CREATE TABLE IF NOT EXISTS media (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    url VARCHAR(1024) NOT NULL,
    type VARCHAR(20) NOT NULL,
    duration_seconds INTEGER
);

CREATE INDEX idx_media_post_id ON media(post_id);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE INDEX idx_like_post_id ON likes(post_id);
CREATE INDEX idx_like_user_id ON likes(user_id);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE INDEX idx_comment_post_id ON comments(post_id);
CREATE INDEX idx_comment_user_id ON comments(user_id);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
    id BIGSERIAL PRIMARY KEY,
    follower_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

CREATE INDEX idx_follow_follower ON follows(follower_id);
CREATE INDEX idx_follow_following ON follows(following_id);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
    triggered_by_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notification_user_id ON notifications(user_id);
CREATE INDEX idx_notification_created_at ON notifications(created_at);

-- Learning Progress table
CREATE TABLE IF NOT EXISTS learning_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_category VARCHAR(255),
    template_type VARCHAR(30) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_progress_user_id ON learning_progress(user_id);
CREATE INDEX idx_progress_created_at ON learning_progress(created_at);

-- Learning Plans table
CREATE TABLE IF NOT EXISTS learning_plans (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    topics JSONB DEFAULT '[]',
    resources JSONB DEFAULT '[]',
    start_date DATE,
    target_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED',
    progress_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE INDEX idx_plan_user_id ON learning_plans(user_id);

-- Badges table (Enhancement)
CREATE TABLE IF NOT EXISTS badges (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    awarded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_badge_user_id ON badges(user_id);
