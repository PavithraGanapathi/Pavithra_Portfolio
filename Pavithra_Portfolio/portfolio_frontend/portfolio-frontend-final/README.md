# Portfolio Frontend — Spring Boot Compatible

This frontend is configured for the Spring Boot backend shown in the supplied controllers.

## Backend API contract used

- `POST /api/admin/login`
- `GET /api/projects`
- `POST /api/projects`
- `DELETE /api/projects/{id}`
- `POST /api/contacts`
- `GET /api/contacts`

The project JSON fields are:

- `title`
- `description`
- `techStack`
- `githubLink`
- `imageUrl`

Contact JSON fields are:

- `name`
- `email`
- `message`

## Run locally

1. Start the Spring Boot backend on port `8080`.
2. Serve this folder with a local static server (for example VS Code Live Server).
3. Open `index.html` through that server.
4. Open `admin.html` for the admin page.

## Change backend URL

Edit only:

`js/config.js`

Example:

```js
const API_BASE = "http://localhost:8080/api";
```

Do not open the HTML directly with `file://` if your browser blocks requests; use a local HTTP server.

## Important security note

The supplied backend login controller returns a plain `String` and does not expose a session/JWT token. Therefore the frontend login screen is only a UI gate. It does not provide real API authorization. For a production deployment, add backend authentication/authorization.
