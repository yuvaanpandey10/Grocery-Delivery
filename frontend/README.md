# Grocery Delivery Frontend

## Run locally

1. Start the backend from `backend` with `npm run dev`.
2. Start the frontend from `frontend` with `npm run dev`.
3. The frontend defaults to `http://localhost:4000` for the API. To use a
   different backend URL, set `VITE_BACKEND_URL` in `frontend/.env`.
4. For a frontend hosted on a different origin, set `CLIENT_URL` in
   `backend/.env` to that exact origin so credentialed API requests are allowed.

The backend needs its database and Cloudinary environment variables configured.
User and seller sessions use HTTP-only cookies. Orders currently support Cash on
Delivery; online checkout is not enabled because there is no payment endpoint.
