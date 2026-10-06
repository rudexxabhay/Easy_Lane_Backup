# EasyLane

EasyLane is a logistics website with a React frontend and an Express API for site content, contact requests, and administration.

## Environment Configuration

### Frontend

- `VITE_API_BASE_URL` sets the API base URL. It defaults to `/api` when the frontend and API share an origin.
- `VITE_API_URL` is a legacy fallback for `VITE_API_BASE_URL`.

Vite embeds `VITE_*` values in the browser bundle. They are public and must never contain secrets.

### Backend

- `PORT` sets the listening port; the default is `5000`.
- `NODE_ENV` controls production behavior, including secure admin cookies.
- `MONGODB_URI` sets the MongoDB connection string (`MONGO_URI` is also accepted).
- `CLIENT_URL` is the allowed frontend origin for credentialed API requests (`CLIENT_ORIGIN` is also accepted). Production requires this value.
- `ADMIN_ID`, `ADMIN_PASSWORD`, and `JWT_SECRET` configure admin authentication. Keep these private; admin authentication remains disabled until all three are set.
- `JWT_EXPIRES_IN` and `COOKIE_NAME` optionally configure admin sessions.
- `XAI_API_KEY` enables the optional xAI provider. Keep it private. `XAI_MODEL`, `XAI_BASE_URL`, and `XAI_TIMEOUT_MS` configure that provider.
- `CHATBOT_KB_MIN_SCORE` and `CHATBOT_PROVIDER_COOLDOWN_MS` configure chatbot behavior.

Safe placeholders are provided in `frontend/.env.example` and `backend/.env.example`. Actual `.env` files must remain private.

## Production Notes

Configure the frontend API base URL and the backend frontend origin for the chosen hosting arrangement. Provide the database connection and admin/provider secrets only when those features are enabled. The backend listens on the runtime-provided `PORT` when set.
