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
   `npm --prefix frontend run dev`. The frontend defaults to
   `http://localhost:4000`; override it with `VITE_BACKEND_URL` if needed.

The storefront requires a customer account; the seller/admin area uses its
separate login. User sessions use HTTP-only cookies. Orders currently support
Cash on Delivery; online checkout is not enabled because there is no payment
endpoint.
