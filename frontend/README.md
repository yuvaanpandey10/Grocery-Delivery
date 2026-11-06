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
   configured database target, then `npm --prefix backend run seed:demo-products`
   to import the 35 original frontend demo products and upload their images to
   Cloudinary. The import is safe to rerun and does not overwrite existing
   seeded products.
5. Start the backend with `npm --prefix backend run dev` and frontend with
   `npm --prefix frontend run dev`. The frontend uses
   `http://localhost:4000` in development. Set `VITE_BACKEND_URL` when the API
   is hosted on a different origin.

The home page is public. Product browsing, cart changes, checkout, orders, and
contact messages require a customer account. The seller/admin area uses its
separate login. User sessions use HTTP-only cookies. Orders currently support
Cash on Delivery; online checkout is not enabled because there is no payment
endpoint.

## Production deployment

1. Deploy the frontend and backend behind HTTPS. Configure the frontend build
   variable `VITE_BACKEND_URL` to the public API origin. If both are served from
   one origin, the frontend falls back to that origin.
2. Set backend `NODE_ENV=production`, `MONGODB_URI`, a newly generated
   `JWT_SECRET` of at least 32 characters, `ADMIN_EMAIL`, an
   `ADMIN_PASSWORD` of at least 12 characters, all three Cloudinary variables,
   `CLIENT_URL` to the exact HTTPS frontend origin, and the SMTP variables
   listed above. Set `FRONTEND_URL` to HTTPS if overriding it, and add any
   additional frontend origins as a comma-separated `CORS_ORIGINS` value.
3. Keep production credentials in the hosting provider's secret manager. Never
   commit `.env` files. Use a separate production database and Cloudinary
   account, and rotate any credentials that have been used for development.
4. Run `npm --prefix backend test`, run `npm --prefix backend audit`, build the
   frontend with `npm --prefix frontend run build`, and verify the backend
   `/health` endpoint after deployment.

Set `SMTP_FROM` to the mailbox that should receive contact messages; password
reset emails use the same SMTP configuration. A live deployment also requires
the production database, image storage, email delivery, frontend and API
origins, and hosting platform to be configured and tested.
