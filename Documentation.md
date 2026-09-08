# Backend Task Manager API Documentation

## Overview

This service provides authenticated task management for individual users. Each task stores its owner, so protected queries and mutations only operate on tasks belonging to the signed-in user.

## Request flow

1. Register a user with `POST /api/auth/register`.
2. The API hashes the password and sets a JWT in the `token` HttpOnly cookie.
3. Send the cookie with `credentials: "include"` from browser clients.
4. Use `/api/auth/me` to confirm the current session.
5. Use the task routes to create and manage owned tasks.
6. Call `/api/auth/logout` to clear the cookie.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | HTTP port, defaults to `1198` |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign session tokens |
| `NODE_ENV` | No | Enables production cookie defaults when set to `production` |
| `CLIENT_ORIGIN` | No | Allowed browser origin, defaults to `http://localhost:5173` |
| `COOKIE_SECURE` | No | Override the cookie `secure` flag |
| `COOKIE_SAME_SITE` | No | Cookie SameSite policy, defaults to `lax` locally and `none` in production |

## Data model

### User

- `name`: required trimmed string
- `email`: required unique lowercase email
- `password`: required string, stored as a bcrypt hash
- `createdAt`, `updatedAt`: timestamps

### Task

- `title`: required trimmed string
- `description`: optional string
- `status`: `pending`, `in-progress`, or `completed`
- `priority`: `low`, `medium`, or `high`
- `dueDate`: optional date
- `user`: required reference to the owning user
- `createdAt`, `updatedAt`: timestamps

## Authentication and security

- Passwords are never returned by user endpoints.
- JWTs are stored in an HttpOnly cookie and are not exposed in JSON responses.
- Protected routes verify the token and reload the user from MongoDB.
- CORS allows credentials only from the configured client origin.
- Helmet adds common HTTP security headers.
- A global request limiter reduces repeated abuse.
- Public error responses do not expose database or token internals.

## Response behavior

Every JSON response includes `apiUrl` as its first field. Successful responses include a descriptive `message`; resource responses also include `user`, `task`, or `tasks` as appropriate.

Common status codes:

- `200`: successful read, update, delete, login, or logout
- `201`: user or task created
- `400`: invalid or incomplete input
- `401`: missing or invalid authentication cookie
- `404`: route or owned task not found
- `409`: duplicate user email
- `429`: rate limit exceeded
- `500`: unexpected server failure

## Local setup

```bash
copy .env.example .env
npm install
npm run dev
```

Start MongoDB before starting the API. The API itself is not started by documentation or setup commands.

## Author and support

**Ashish Ranjan**

Full-Stack Web Developer

- Portfolio: [ashishranjan.in](https://ashishranjan.in/)
- GitHub: [github.com/a2rp](https://github.com/a2rp)
- Email: [ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)
- Support: [a2rp-donation-page.netlify.app](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [buymeacoffee.com/a2rp](https://buymeacoffee.com/a2rp)
- Patreon: [patreon.com/a2rp](https://www.patreon.com/a2rp)
