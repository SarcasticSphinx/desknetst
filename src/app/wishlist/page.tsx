import { getProducts } from "@/lib/products";
import { Catalogue } from "@/components/catalogue";
export const dynamic = "force-dynamic";
export default async function Page() {
  return (
    <main>
      <Catalogue products={await getProducts()} onlySaved />
    </main>
  );
}
