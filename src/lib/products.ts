import "server-only";
import { getDb } from "./db";
export const getProducts = () =>
  getDb().product.findMany({
    include: { variants: { orderBy: { price: "asc" } } },
    orderBy: { id: "asc" },
  });
