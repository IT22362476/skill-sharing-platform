# Functional Requirements
## Skill Sharing & Learning Platform

### FR1: Authentication
| ID | Requirement | Priority |
|----|-------------|----------|
| FR1.1 | Users shall be able to register with email and password | High |
| FR1.2 | Users shall be able to log in with email/password using JWT tokens | High |
| FR1.3 | Users shall be able to log in via Google OAuth 2.0 | High |
| FR1.4 | Users shall be able to log in via GitHub OAuth 2.0 | High |
| FR1.5 | JWT tokens shall expire after 24 hours | Medium |
| FR1.6 | Passwords shall be stored using BCrypt encryption | High |
| FR1.7 | OAuth users shall have local accounts created/retrieved automatically | High |

### FR2: User Profile
| ID | Requirement | Priority |
|----|-------------|----------|
| FR2.1 | Users shall have a public profile with username, avatar, bio, and join date | High |
| FR2.2 | Users shall be able to update their username, bio, and avatar | High |
| FR2.3 | Public profiles shall display the user's posts, progress updates, and learning plans | Medium |

### FR3: Skill-Sharing Posts
| ID | Requirement | Priority |
|----|-------------|----------|
| FR3.1 | Users shall be able to create posts with text content | High |
| FR3.2 | Users shall be able to upload up to 3 media files per post (JPEG, PNG, MP4) | High |
| FR3.3 | Each media file shall not exceed 10MB | High |
| FR3.4 | Video uploads shall be limited to 30 seconds duration | Medium |
| FR3.5 | Posts shall be displayed in a public feed | High |
| FR3.6 | Posts shall be displayed in a "followed users" feed | High |
| FR3.7 | Users shall be able to delete their own posts | High |
| FR3.8 | Posts shall support an optional skill category | Low |

### FR4: Likes
| ID | Requirement | Priority |
|----|-------------|----------|
| FR4.1 | Users shall be able to like any post | High |
| FR4.2 | Users shall be able to unlike any post they previously liked | High |
| FR4.3 | Like count shall be displayed on each post | Medium |
| FR4.4 | Users shall only be able to like a post once | High |

### FR5: Comments
| ID | Requirement | Priority |
|----|-------------|----------|
| FR5.1 | Users shall be able to add comments on posts | High |
| FR5.2 | Users shall be able to edit their own comments | High |
| FR5.3 | Users shall be able to delete their own comments | High |
| FR5.4 | Post owners shall be able to delete any comment on their own posts | High |
| FR5.5 | Comments shall be displayed in chronological order | Medium |

### FR6: Follow System
| ID | Requirement | Priority |
|----|-------------|----------|
| FR6.1 | Users shall be able to follow other users | High |
| FR6.2 | Users shall be able to unfollow users they follow | High |
| FR6.3 | Users shall not be able to follow themselves | Medium |
| FR6.4 | Follower and following counts shall be displayed on profiles | Medium |

### FR7: User Search
| ID | Requirement | Priority |
|----|-------------|----------|
| FR7.1 | Users shall be able to search for other users by username | High |
| FR7.2 | Search results shall be displayed with follow/unfollow buttons | Medium |
| FR7.3 | Search shall be case-insensitive | Medium |

### FR8: Notifications
| ID | Requirement | Priority |
|----|-------------|----------|
| FR8.1 | Users shall receive a notification when someone likes their post | High |
| FR8.2 | Users shall receive a notification when someone comments on their post | High |
| FR8.3 | Notifications shall include type, post reference, triggering user, and timestamp | High |
| FR8.4 | Users shall be able to mark notifications as read/unread | Medium |
| FR8.5 | Users shall be able to delete notifications | Medium |
| FR8.6 | Unread notification count shall be shown on the bell icon | Medium |

### FR9: Learning Progress
| ID | Requirement | Priority |
|----|-------------|----------|
| FR9.1 | Users shall be able to post progress updates using predefined templates | High |
| FR9.2 | Supported templates: "Completed Tutorial", "Learned New Skill", "Time Spent" | High |
| FR9.3 | Each progress update shall be linked to a skill category | Medium |
| FR9.4 | Users shall be able to delete their progress updates | Medium |
| FR9.5 | Progress updates shall be displayed on user profiles in chronological order | Medium |

### FR10: Learning Plans
| ID | Requirement | Priority |
|----|-------------|----------|
| FR10.1 | Users shall be able to create structured learning plans | High |
| FR10.2 | Learning plans shall include: title, description, topics, resources, dates | High |
| FR10.3 | Plans shall have a status: Not Started, In Progress, Completed | High |
| FR10.4 | Users shall be able to update plan status and add progress notes | High |
| FR10.5 | Plans shall be displayed on user profiles | Medium |

### FR11: Notifications (Poll-based)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR11.1 | Notifications shall be fetched via API polling | Medium |
| FR11.2 | The notification bell icon shall display the count of unread notifications | Medium |
| FR11.3 | Clicking a notification shall navigate to the related post | Medium |

### FR12: Enhancements (Extra Credit)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR12.1 | Users shall earn skill badges when completing learning plans | Low |
| FR12.2 | Users shall be able to search posts by skill category or keyword | Low |
| FR12.3 | The application shall support dark mode with persistent localStorage setting | Low |
| FR12.4 | Users shall be able to export learning plans as PDF | Low |
