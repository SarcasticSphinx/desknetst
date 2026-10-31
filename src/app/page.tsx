import { getProducts } from "@/lib/products";
import { Home } from "@/components/catalogue";
export const dynamic = "force-dynamic";
export default async function Page() {
  return <Home products={await getProducts()} />;
}
