import { describe, expect, it } from "vitest";
import { addLine, changeQuantity, subtotal } from "./cart";
const item = { variantId: "v1", productId: "p1", name: "Lamp", option: "Warm", image: "/lamp.jpg", price: 10000, stock: 3, quantity: 1 };
describe("cart", () => {
 it("adds a new option", () => expect(addLine([], item)).toEqual([item]));
 it("merges repeated options", () => expect(addLine([item], item)[0].quantity).toBe(2));
 it("keeps different options separate", () => expect(addLine([item], {...item,variantId:"v2"})).toHaveLength(2));
 it("rejects stock overflow", () => expect(() => addLine([{...item,quantity:3}],item)).toThrow("stock"));
 it("removes zero quantity", () => expect(changeQuantity([item],"v1",0)).toEqual([]));
 it("rejects invalid quantities", () => { for(const n of [-1,1.5,Infinity,4]) expect(()=>changeQuantity([item],"v1",n)).toThrow(); });
 it("does not mutate existing lines", () => {addLine([item],item);expect(item.quantity).toBe(1);});
 it("totals integer paisa", () => expect(subtotal([{...item,quantity:2}])).toBe(20000));
 it("totals empty cart", () => expect(subtotal([])).toBe(0));
});
