import { getDb } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CircleCheck, ArrowRight, Package, Truck } from "lucide-react";
import { money } from "@/lib/cart";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(token)) notFound();
  const order = await getDb().order.findUnique({
    where: { token },
    include: { items: true },
  });
  if (!order) notFound();
  return (
    <main className="receipt page-wrap">
      <CircleCheck className="receipt-check" size={52} strokeWidth={1} />
      <span className="eyebrow">GOOD CHOICES, CONFIRMED</span>
      <h1>
        Your workspace is
        <br />
        getting an upgrade.
      </h1>
      <p>Your demo order has been saved. Keep this page as your receipt.</p>
      <div className="receipt-meta">
        <span>
          <Package size={18} />
          Order {order.id.slice(-8).toUpperCase()}
        </span>
        <span>
          <Truck size={18} />
          {order.delivery} delivery
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Option</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.items.map((x) => (
            <TableRow key={x.id}>
              <TableCell>{x.name}</TableCell>
              <TableCell>{x.option}</TableCell>
              <TableCell>{x.quantity}</TableCell>
              <TableCell>{money(x.unitPrice * x.quantity)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="receipt-total">
        <p>
          Products <strong>{money(order.subtotal)}</strong>
        </p>
        <p>
          Delivery <strong>{money(order.shipping)}</strong>
        </p>
        <p>
          Cash on delivery <strong>{money(order.total)}</strong>
        </p>
      </div>
      <p className="fine-print">
        This is a demonstration order. No payment was taken and no real delivery
        will be arranged.
      </p>
      <Link href="/#collection" className="dark-link">
        Back to the collection <ArrowRight size={18} />
      </Link>
    </main>
  );
}
