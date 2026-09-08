# Backend Task Manager API

A secure REST API for managing personal tasks. Users register and sign in with JWTs stored in HttpOnly cookies, then create and manage only their own tasks.

## Features

- User registration, login, current-user lookup, and logout
- HttpOnly cookie-based JWT authentication
- User-owned task CRUD operations
- Task status, priority, description, and due date fields
- MongoDB persistence with Mongoose validation
- CORS credentials support for a browser frontend
- Helmet security headers and request rate limiting
- Consistent `apiUrl` metadata in every JSON response
- Request and response status logging with the `[API]` prefix
- Health endpoint for service checks

## Tech stack

- Node.js and Express
- MongoDB and Mongoose
- JSON Web Tokens
- bcryptjs
- cookie-parser
- Helmet
- express-rate-limit

## Requirements

- Node.js 18 or newer
- MongoDB running locally or a reachable MongoDB deployment

## Configuration

Copy `.env.example` to `.env` and replace the placeholder values:

```env
PORT=1198
MONGO_URI=mongodb://127.0.0.1:27017/backend_task_manager_api
JWT_SECRET=replace_with_a_long_random_secret
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

Never commit `.env` or real credentials.

## Install and run

```bash
npm install
npm run dev
```

The API listens on `http://localhost:1198` by default. The server validates `MONGO_URI` and `JWT_SECRET` before starting.

## API endpoints

All protected requests use the `token` HttpOnly cookie. Browser clients must send requests with credentials enabled.

### System

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/` | No | Service information |
| GET | `/health` | No | Health status |

### Authentication

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create a user and issue a cookie |
| POST | `/api/auth/login` | No | Verify credentials and issue a cookie |
| GET | `/api/auth/me` | Yes | Return the signed-in user |
| POST | `/api/auth/logout` | No | Clear the authentication cookie |

### Tasks

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/tasks` | Yes | Create a task |
| GET | `/api/tasks` | Yes | List the signed-in user's tasks |
| GET | `/api/tasks/:id` | Yes | Read one owned task |
| PUT | `/api/tasks/:id` | Yes | Update one owned task |
| DELETE | `/api/tasks/:id` | Yes | Delete one owned task |

Task status values are `pending`, `in-progress`, and `completed`. Priority values are `low`, `medium`, and `high`.

## Response format

Every JSON response starts with the requested API path:

```json
{
  "apiUrl": "/api/tasks",
  "message": "Tasks fetched successfully",
  "tasks": []
}
```

Errors return a safe public message. Internal database and token details are logged on the server and are not returned to clients.

## Browser usage

```js
fetch("http://localhost:1198/api/tasks", {
  credentials: "include",
});
```

See [rest.http](./rest.http) for request examples.

## Author

**Ashish Ranjan**

Full-Stack Web Developer

## Links

- Portfolio: [ashishranjan.in](https://ashishranjan.in/)
- GitHub: [github.com/a2rp](https://github.com/a2rp)
- CodePen: [codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [facebook.com/theash.ashish](https://www.facebook.com/theash.ashish/)
- YouTube: [Ashish Ranjan](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- [Support page](https://a2rp-donation-page.netlify.app/)
- [Buy Me a Coffee](https://buymeacoffee.com/a2rp)
- [Patreon](https://www.patreon.com/a2rp)

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
