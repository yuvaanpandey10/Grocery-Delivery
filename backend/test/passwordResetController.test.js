import assert from "node:assert/strict";
import test from "node:test";
import User from "../models/user.js";
import { requestPasswordReset } from "../controllers/userController.js";

const invokePasswordReset = async (email) => {
  let status;
  let response;
  await requestPasswordReset(
    { body: { email } },
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

test("provides a local reset link when development email is not configured", async (t) => {
  const environment = [
    "NODE_ENV",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
    "FRONTEND_URL",
    "CLIENT_URL",
  ];
  const previousEnvironment = Object.fromEntries(
    environment.map((key) => [key, process.env[key]]),
  );
  t.after(() => {
    environment.forEach((key) => {
      if (previousEnvironment[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = previousEnvironment[key];
      }
    });
  });

  process.env.NODE_ENV = "development";
  environment
    .filter((key) => key.startsWith("SMTP_"))
    .forEach((key) => delete process.env[key]);

  const user = {
    email: "shopper@example.com",
    async save() {},
  };
  t.mock.method(User, "findOne", async () => user);

  const result = await invokePasswordReset(user.email);

  assert.equal(result.status, 200);
  assert.equal(result.response.success, true);
  assert.equal(result.response.developmentOnly, true);
  assert.match(result.response.resetUrl, /^\/reset-password\/[A-Za-z0-9_-]{43}$/);
  assert.ok(user.passwordResetTokenHash);
  assert.ok(user.passwordResetExpires instanceof Date);
});
