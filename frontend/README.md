# Grocery Delivery

## Run locally

1. Configure the backend environment with `MONGODB_URI`, `JWT_SECRET`,
   `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and the Cloudinary credentials.
2. Set `CLIENT_URL` to the exact frontend origin (for local development,
   `http://localhost:5173`). This is used for credentialed CORS and reset links;
   `FRONTEND_URL` may override the reset-link origin.
3. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`,
   and `SMTP_FROM` to enable password reset emails.
4. Run `npm --prefix backend run seed:demo-products:dry-run` to verify the
   configured database target and see how many products need insertion or
   image repair. Then run `npm --prefix backend run seed:demo-products` to
   import the 35 original frontend demo products and upload their images to
   Cloudinary. The import is safe to rerun: existing products with valid
   Cloudinary images are left alone, while missing or invalid demo image URLs
   are repaired. If Cloudinary URLs are present but their images still fail to
   load, force re-upload the demo images with
   `npm --prefix backend run seed:demo-products -- --repair-images`.
5. Start the backend with `npm --prefix backend run dev` and frontend with
   `npm --prefix frontend run dev`. The frontend uses
   `http://localhost:4000` in development. Set `VITE_BACKEND_URL` when the API
   is hosted on a different origin.

The home page is public. Product browsing, cart changes, checkout, orders, and
contact messages require a customer account. The seller/admin area uses its
separate login. User sessions use HTTP-only cookies. Orders currently support
Cash on Delivery; online checkout is not enabled because there is no payment
endpoint.

## Free deployment (Render)

The Render Blueprint in `../render.yaml` builds the frontend and backend and
serves both from one HTTPS address. This keeps login cookies first-party and
avoids needing a separate frontend domain. Keep using your existing MongoDB
and Cloudinary accounts; enter their values only in Render's environment
settings.

1. Push the repository to GitHub. Confirm `backend/.env` is not committed; it
   is ignored by Git. Do not copy its contents into the repository.
2. In Render, create a Blueprint instance using this repository and its
   `render.yaml`. It creates a free web service named `grocery-delivery`.
   Provide the requested environment values in Render's secure settings:
   - `MONGODB_URI`: your existing MongoDB connection string.
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD`: the seller/admin login; use a strong
     password of at least 12 characters.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and
     `CLOUDINARY_API_SECRET`: your existing Cloudinary credentials.
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM`: your
     email provider's SMTP settings. These are required for the API to start in
     production and enable password reset/contact email.
   Render generates `JWT_SECRET` and sets `NODE_ENV=production`. Render
   supplies the public app URL automatically, so `CLIENT_URL`, `PORT`, and
   `VITE_BACKEND_URL` do not need to be set for this single-origin deployment.
3. Wait for deployment to finish. Open the Render service's `/health` address
   (for example, `https://grocery-delivery.onrender.com/health`) and confirm it
   returns `{"success":true,"status":"ok"}`. Use the actual app URL shown in
   Render.
4. Open the service's main HTTPS address. Test the home page and a nested
   route directly, browse products, register/login, and check cart and
   seller/admin login. Also test email flows if SMTP is configured.

Render's free web service may sleep when idle, so the first request after
inactivity can be slow. Production requires a `JWT_SECRET` of at least 32
characters and an admin password of at least 12 characters. If you later
connect a custom domain or a separate frontend, set `CLIENT_URL` to that exact
HTTPS origin and add other allowed frontend origins to `CORS_ORIGINS`.
Keep credentials in host secret settings, never in Git.
