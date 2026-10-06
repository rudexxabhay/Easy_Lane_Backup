# EasyLane

EasyLane is a logistics landing website with a React frontend and an Express API for site content, contact requests, and administration.

## Deployment Overview

This repository contains both a Vite-built frontend and a separate Node.js backend. The repository does not define an Azure deployment target. A suitable Azure arrangement is to host the frontend as an Azure Static Web App and the API as an Azure App Service, with MongoDB configured for persistent application data.

The frontend calls the API using `VITE_API_BASE_URL` (or the fallback `VITE_API_URL`). Configure the production frontend to use the deployed API URL, including its `/api` base path.

## Repository Structure

- `frontend/` — React/Vite website; production build output is `frontend/dist/`.
- `backend/` — Express API; entry point is `src/server.js`.

## Azure Requirements

- **Frontend:** Azure Static Web Apps is a recommended fit for the Vite static build. This is not configured in the repository today.
- **Backend:** Azure App Service configured for Node.js. The repository does not pin a Node.js version; select a supported version compatible with the dependencies.
- **Data:** MongoDB is used by the backend. Provide a MongoDB-compatible service and network access from the API host.
- **Source control:** Connect the repository and select the deployment branch approved by the project owner. No GitHub Actions workflow or Azure deployment settings are present in the repository.
- **Domain:** No production domain or DNS settings are defined. Configure a custom domain and HTTPS in Azure only if one is provided by the project owner.

## Environment Variables

Set frontend variables in the Static Web App build configuration. Set backend variables in the App Service configuration. Store sensitive values in Azure application settings or a connected secret store; never commit them to the repository.

| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_API_BASE_URL` | Frontend API base URL; include `/api`. | Yes for a separately hosted API |
| `VITE_API_URL` | Alternate frontend API base URL used when `VITE_API_BASE_URL` is unset. | No |
| `PORT` | Backend listening port; Azure App Service may provide this at runtime. | Set by host or configure |
| `NODE_ENV` | Enables production-specific backend settings, including secure admin cookies. | Set to `production` |
| `MONGODB_URI` | MongoDB connection for persistent application data. `MONGO_URI` is also accepted as an alias. | Yes for database-backed features |
| `CLIENT_URL` | Allowed frontend origin for credentialed API requests. `CLIENT_ORIGIN` is also accepted as an alias. | Yes when frontend and API use different origins |
| `ADMIN_ID` | Admin sign-in identifier. | Yes to enable admin authentication |
| `ADMIN_PASSWORD` | Admin sign-in password. | Yes to enable admin authentication |
| `JWT_SECRET` | Secret used to sign admin sessions. | Yes to enable admin authentication |
| `JWT_EXPIRES_IN` | Admin session lifetime. | No |
| `COOKIE_NAME` | Name used for the admin session cookie. | No |
| `XAI_API_KEY` | Enables the optional xAI chatbot provider integration. | No |
| `XAI_MODEL` | xAI model selection. | No |
| `XAI_BASE_URL` | xAI API base URL. | No |
| `XAI_TIMEOUT_MS` | Timeout for xAI requests. | No |
| `CHATBOT_KB_MIN_SCORE` | Chatbot knowledge matching threshold. | No |
| `CHATBOT_PROVIDER_COOLDOWN_MS` | Chatbot provider retry cooldown. | No |

`VITE_API_BASE_URL` and `VITE_API_URL` are embedded into the frontend at build time. They are public configuration, not secret storage. Do not put credentials or private keys in either variable.

## Azure Deployment Guide

The steps below describe a recommended split deployment because the repository has separate frontend and backend applications. Azure resources, production workflows, and a deployment branch must be selected by the deployment owner; none are specified in the repository.

1. **Create the frontend resource.** Create or select an Azure Static Web App and connect the EasyLane repository. Choose the owner-approved branch for deployment.
2. **Configure the frontend build.** Set the app location to `frontend`, leave the API location unset, and set the output location to `dist`. Use the Vite production build defined by `frontend/package.json`. Add `VITE_API_BASE_URL` in the Static Web App build configuration, pointing to the deployed API's `/api` base URL.
3. **Create the API resource.** Create an Azure App Service using the Node.js runtime. Deploy the contents of `backend/`; the server entry point is `src/server.js` and the package manifest defines the production start script. The repository does not specify a Node runtime version or App Service startup override.
4. **Configure backend settings.** Add the required database, allowed frontend origin, and admin authentication settings in App Service configuration. Add xAI settings only if that integration is required. Keep passwords, connection strings, and signing secrets in secure Azure settings.
5. **Connect frontend and API.** Set the frontend API base URL to the deployed API origin plus `/api`, and set the backend allowed origin to the deployed frontend origin. Confirm CORS and credentialed admin sign-in work across the two hosts.
6. **Set deployment triggers.** Configure each Azure resource to deploy from the selected repository branch. No workflow currently exists in the repository, so use the Azure service's repository integration or add a deployment workflow through the project owner's normal process.
7. **Confirm the deployment.** Wait for both resources to report a successful deployment, then use the Static Web App URL and App Service API health endpoint to verify availability.

## Post-Deployment Verification

- The website URL opens and the landing page renders.
- Images, icons, and fonts load; check the page at mobile and desktop widths.
- The frontend can reach the API, including site content and public settings.
- Demo and contact submissions complete successfully.
- Admin sign-in works if admin features are being deployed.
- HTTPS is active on both Azure URLs; verify any custom domain after DNS is configured.

## Important Notes

- `frontend/vercel.json` contains a Vercel single-page-app rewrite. It is not Azure deployment configuration; confirm equivalent SPA route fallback behavior for the chosen Azure frontend host.
- The backend can start without MongoDB, but database-backed features will not have persistent storage in that state.
- xAI integration settings are optional and should only be configured if the deployment will use that provider.
- The repository has no pinned Node.js runtime version, Azure resource configuration, Azure workflow, production domain, or confirmed deployment branch.
