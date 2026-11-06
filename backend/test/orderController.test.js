import assert from "node:assert/strict";
import test from "node:test";
import { placeOrderCOD } from "../controllers/orderController.js";

const invokeOrder = async (items) => {
  let status;
  let response;
  await placeOrderCOD(
    { body: { address: "64b000000000000000000010", items } },
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

test("rejects orders without items", async () => {
  const result = await invokeOrder([]);
  assert.equal(result.status, 400);
});

test("rejects orders with more than 100 distinct items", async () => {
  const items = Array.from({ length: 101 }, (_, index) => ({
    product: index.toString(16).padStart(24, "0"),
    quantity: 1,
  }));
  const result = await invokeOrder(items);
  assert.equal(result.status, 400);
});

test("rejects duplicate products in one order", async () => {
  const result = await invokeOrder([
    { product: "64b000000000000000000001", quantity: 1 },
    { product: "64b000000000000000000001", quantity: 2 },
  ]);
  assert.equal(result.status, 400);
});

test("rejects quantities above 99", async () => {
  const result = await invokeOrder([
    { product: "64b000000000000000000001", quantity: 100 },
  ]);
  assert.equal(result.status, 400);
});
