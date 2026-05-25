# Microservice E-commerce Project

This repo is a Node.js + TypeScript backend microservice e-commerce system built as a pnpm monorepo with Turbo.
It organizes services as separate apps, uses shared utility packages.

Tech stack:

- Node.js with ESM and TypeScript
- `pnpm` workspaces, `turbo` for workspace scripts, `prettier` formatting
- Express-style routers/controllers in each app
- Shared packages for typed payloads, HMAC middleware, and database helpers
- Prisma-style DB layering in package workspaces where appropriate

Important notes:

- `auth-service` was written by me and contains JWT auth, refresh tokens, logout, and profile retrieval.
- I also built an `api-gateway`, but this project should really focus on direct microservice communication instead.

Internal security:

- `packages/hmac-middleware` provides HMAC signing and verification for internal requests.
- Incoming internal calls use `verifyHmac` to validate `x-user-id`, `x-user-role`, `x-timestamp`, and `x-internal-signature`.
- The HMAC scheme protects internal service endpoints and prevents replay attacks with timestamp checking.
- Downstream services use `signInternalRequest(...)` when they call other services from controllers.

Services overview:

- `auth-service`: user registration, login, refresh token flow, logout, and authenticated profile (`/me`).
- `cart-service`: cart management, item add/update/remove, checkout orchestration, and internal payment/order requests.
- `inventory-service`: stock updates and product availability checks with protected internal endpoints.
- `order-service`: order creation, user order history, and admin order listing.
- `payment-service`: payment session creation and provider integration (Stripe/Iyzico style flows).
- `product-service`: product and category management with HMAC-protected admin operations.
- `notification-service`: event/alert dispatching for order/payment lifecycle events.

Repository structure:

- `apps/*`: independent service applications
- `packages/*`: shared logic like HMAC middleware, DB clients, and type definitions
