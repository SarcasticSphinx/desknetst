"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Truck,
  PackageCheck,
  LoaderCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useShop } from "./shop-provider";
import { money, subtotal } from "@/lib/cart";
export function CheckoutPage() {
  const { cart, clear, ready } = useShop();
  const router = useRouter();
  const [delivery, setDelivery] = useState<"standard" | "express">("standard"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const key = useRef<string | null>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    key.current ??= crypto.randomUUID();
    const form = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form.get("customer"),
          phone: form.get("phone"),
          address: form.get("address"),
          delivery,
          requestKey: key.current,
          items: cart.map(({ variantId, quantity }) => ({
            variantId,
            quantity,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      clear();
      router.push(`/orders/${data.token}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again");
      setBusy(false);
    }
  }
  return (
    <main className="page-wrap">
      <Link className="back-link" href="/cart">
        <ArrowLeft size={16} />
        Back to cart
      </Link>
      <div className="section-heading">
        <div>
          <span className="eyebrow">ONE LAST LITTLE STEP</span>
          <h1>Make it yours.</h1>
        </div>
        <p>Guest checkout · Cash on delivery</p>
      </div>
      {!ready ? (
        <p>Loading…</p>
      ) : !cart.length && !busy ? (
        <div className="empty">
          <h2>Your cart is empty.</h2>
          <Link href="/#collection" className="text-link">
            Find your essentials <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <form onSubmit={submit} className="checkout-form">
            <h2>Where should it go?</h2>
            <label htmlFor="customer">Full name</label>
            <Input
              id="customer"
              name="customer"
              placeholder="Your name"
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
            />
            <label htmlFor="phone">Phone number</label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="01XXXXXXXXX"
              required
              minLength={7}
              maxLength={20}
              autoComplete="tel"
            />
            <label htmlFor="address">Delivery address</label>
            <textarea
              id="address"
              name="address"
              placeholder="House, road, area and city"
              required
              minLength={10}
              maxLength={300}
              autoComplete="street-address"
            />
            <h2>Choose your pace.</h2>
            <div className="delivery-options">
              {(
                [
                  ["standard", "Standard delivery", "3–5 working days", 6000],
                  ["express", "Express delivery", "1–2 working days", 12000],
                ] as const
              ).map(([id, title, time, fee]) => (
                <label
                  key={id}
                  className={
                    delivery === id
                      ? "delivery-option selected"
                      : "delivery-option"
                  }
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={id}
                    checked={delivery === id}
                    onChange={() => setDelivery(id)}
                  />
                  <Truck size={20} />
                  <span>
                    <strong>{title}</strong>
                    <small>{time}</small>
                  </span>
                  <strong>{money(fee)}</strong>
                </label>
              ))}
            </div>
            <div className="cod-note">
              <PackageCheck size={21} />
              <div>
                <strong>Pay when your order arrives</strong>
                <p>No online payment or account required.</p>
              </div>
            </div>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="primary-button" disabled={busy}>
              {busy ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Placing your order…
                </>
              ) : (
                <>
                  Place order <ArrowRight size={18} />
                </>
              )}
            </Button>
            <p className="fine-print">
              Demonstration store. Delivery times and products are examples; no
              real shipment is arranged.
            </p>
          </form>
          <Card className="order-summary">
            <CardContent>
              <span className="eyebrow">YOUR EDIT</span>
              <h2>Almost on your desk.</h2>
              {cart.map((x) => (
                <div className="checkout-line" key={x.variantId}>
                  <span>
                    {x.name}
                    <small>
                      {x.option} · Qty {x.quantity}
                    </small>
                  </span>
                  <strong>{money(x.price * x.quantity)}</strong>
                </div>
              ))}
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{money(subtotal(cart))}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span>{money(delivery === "express" ? 12000 : 6000)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <strong>
                  {money(
                    subtotal(cart) + (delivery === "express" ? 12000 : 6000),
                  )}
                </strong>
              </div>
              <p className="fine-print">
                Prices and stock are checked again when you place the order.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
