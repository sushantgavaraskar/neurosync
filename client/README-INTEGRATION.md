# NeuroSync Frontend Integration

Environment variables:

```
VITE_API_BASE_URL=http://localhost:4000/api
```

At runtime, you can also override by setting `window.__API_BASE_URL__` before app mounts.

Auth:
- Client decodes JWT to populate user from `sub`, `email`, and `workspaceId` claims
- Tokens are stored at `localStorage` keys: `neurosync_access_token`, `neurosync_refresh_token`

Endpoints used:
- POST `${VITE_API_BASE_URL}/auth/login`
- POST `${VITE_API_BASE_URL}/auth/refresh`
- GET  `${VITE_API_BASE_URL}/search?q=...`
- POST `${VITE_API_BASE_URL}/ask`
- POST `${VITE_API_BASE_URL}/files/upload` (FormData: `file`)


