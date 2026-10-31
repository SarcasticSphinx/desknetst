import { getDb } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getDb().product.findUnique({
    where: { id },
    include: { variants: { orderBy: { price: "asc" } } },
  });
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
