import assert from "node:assert/strict";
import test from "node:test";
import { buildStripeLineItems } from "../controllers/stripeController.js";

test("builds Stripe line items and calculates the 2% tax in cents", () => {
  const result = buildStripeLineItems(
    [
      { product: "product-1", quantity: 2 },
      { product: "product-2", quantity: 1 },
    ],
    [
      { _id: "product-1", name: "Apples", offerPrice: 3.5 },
      { _id: "product-2", name: "Bread", offerPrice: 2.25 },
    ],
  );

  assert.equal(result.amount, 9.44);
  assert.deepEqual(
    result.lineItems.map((item) => item.price_data.unit_amount),
    [350, 225, 19],
  );
  assert.equal(result.lineItems[2].price_data.product_data.name, "Tax (2%)");
});

test("rejects product prices below one cent", () => {
  assert.throws(
    () =>
      buildStripeLineItems(
        [{ product: "product-1", quantity: 1 }],
        [{ _id: "product-1", name: "Invalid", offerPrice: 0 }],
      ),
    /at least one cent/,
  );
});
