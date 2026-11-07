# Grocery Delivery

A full-stack grocery shopping website built with React and Express. Customers
can browse products, manage a cart and account, and place cash-on-delivery
orders. The project also includes a seller area for managing products and
orders.

## Features

- Product browsing by category and product details
- Customer registration, login, password reset, cart, addresses, and orders
- Seller login, product management, and order management
- Product image storage with Cloudinary
- MongoDB-backed data
- Responsive React frontend and Express API

## Tech stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, MongoDB with Mongoose
- Services: MongoDB Atlas, Cloudinary, SMTP email

## Deploy

The repository includes a Render Blueprint in [`render.yaml`](./render.yaml)
to build and host the frontend and backend from one service.

1. Push this repository to GitHub.
2. In Render, choose **New → Blueprint** and select this repository.
3. Add the required environment variables when prompted. Use your MongoDB and
   Cloudinary credentials, set the seller/admin email and a strong password,
   provide SMTP settings for email features, and add your Stripe test secret
   key for online checkout. Render generates `JWT_SECRET`.
4. Deploy, then check the app's `/health` endpoint and open the service URL.

See the [frontend README](./frontend/README.md) for deployment details and
local development instructions. Never commit `.env` files or credentials.

## Notes

- Stripe Checkout supports test/live modes when configured with a matching
  Stripe secret key. Cash on Delivery is also available.
- Render's free web service may sleep when idle, so the first request after
  inactivity can be slow.
