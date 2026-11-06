import assert from "node:assert/strict";
import test from "node:test";
import jwt from "jsonwebtoken";
import { isSellerAuth } from "../controllers/sellerController.js";

process.env.JWT_SECRET = "seller-auth-test-secret";
process.env.ADMIN_EMAIL = "admin@example.com";

const invokeSellerAuth = (sellerToken) => {
  let status;
  let response;
  isSellerAuth(
    { cookies: sellerToken ? { sellerToken } : {} },
    {
      status(value) {
        status = value;
        return this;
      },
      json(value) {
        response = value;
        return this;
      },
    },
  );
  return { status, response };
};

test("returns an unauthenticated status without an error for signed-out visitors", () => {
  const result = invokeSellerAuth();
  assert.equal(result.status, 200);
  assert.deepEqual(result.response, { success: false });
});

test("returns authenticated status for a valid seller token", () => {
  const token = jwt.sign(
    { email: process.env.ADMIN_EMAIL },
    process.env.JWT_SECRET,
  );
  const result = invokeSellerAuth(token);
  assert.equal(result.status, 200);
  assert.deepEqual(result.response, { success: true });
});

test("returns unauthenticated status for an invalid token", () => {
  const result = invokeSellerAuth("invalid-token");
  assert.equal(result.status, 200);
  assert.deepEqual(result.response, { success: false });
});
