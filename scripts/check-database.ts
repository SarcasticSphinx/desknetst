import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getDb } from "../src/lib/db";
import { placeOrder } from "../src/lib/checkout";
import { orderStore } from "../src/lib/order-store";
const db = getDb();
const before = await db.variant.findUniqueOrThrow({
  where: { id: "arc-lamp-0" },
});
const ordersBefore = await db.order.count();
await assert.rejects(
  () =>
    placeOrder(
      {
        customer: "Demo Rollback",
        phone: "01700000000",
        address: "Demonstration test address, Rajshahi",
        delivery: "standard",
        requestKey: randomUUID(),
        items: [
          { variantId: "arc-lamp-0", quantity: 1 },
          { variantId: "type-keyboard-0", quantity: 50 },
        ],
      },
      orderStore,
    ),
  /stock/,
);
const after = await db.variant.findUniqueOrThrow({
  where: { id: "arc-lamp-0" },
});
assert.equal(after.stock, before.stock);
assert.equal(await db.order.count(), ordersBefore);
console.log("PASS: insufficient stock rejects checkout.");
console.log("PASS: earlier stock change rolls back.");
console.log("PASS: failed checkout creates no order.");
console.log(
  `Database contains ${await db.product.count()} products and ${await db.variant.count()} options.`,
);
await db.$disconnect();
