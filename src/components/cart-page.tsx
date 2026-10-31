"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingCart,
  ArrowLeft,
  LockKeyhole,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useShop } from "./shop-provider";
import { money, subtotal } from "@/lib/cart";
export function CartPage() {
  const { cart, change, ready } = useShop();
  return (
    <main className="page-wrap">
      <Link className="back-link" href="/#collection">
        <ArrowLeft size={16} />
        Keep exploring
      </Link>
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR WORKSPACE, COMING TOGETHER</span>
          <h1>Your cart.</h1>
        </div>
        <p>{cart.reduce((n, x) => n + x.quantity, 0)} good choices</p>
      </div>
      {!ready ? (
        <p>Loading your cart…</p>
      ) : !cart.length ? (
        <div className="empty">
          <ShoppingCart size={35} />
          <h2>A little room for something good.</h2>
          <p>Your cart is waiting for its first essential.</p>
          <Link className="dark-link" href="/#collection">
            Shop the collection <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {cart.map((item) => (
              <article className="cart-line" key={item.variantId}>
                <Link
                  href={`/products/${item.productId}`}
                  className="cart-photo"
                >
                  <Image src={item.image} alt={item.name} fill sizes="130px" />
                </Link>
                <div className="line-details">
                  <Link href={`/products/${item.productId}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  <p>{item.option}</p>
                  <div className="quantity">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Decrease ${item.name}`}
                      onClick={() => change(item.variantId, item.quantity - 1)}
                    >
                      <Minus />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Increase ${item.name}`}
                      disabled={item.quantity >= item.stock}
                      onClick={() => change(item.variantId, item.quantity + 1)}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
                <div className="line-end">
                  <strong>{money(item.price * item.quantity)}</strong>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => change(item.variantId, 0)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </article>
            ))}
          </div>
          <Card className="order-summary">
            <CardContent>
              <span className="eyebrow">THE SUMMARY</span>
              <h2>All good things.</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>{money(subtotal(cart))}</strong>
              </div>
              <p className="muted">Delivery is selected at checkout.</p>
              <Link href="/checkout" className="dark-link">
                Continue to checkout <ArrowRight size={17} />
              </Link>
              <p className="summary-hint">
                <LockKeyhole size={14} />
                No account needed · Pay on delivery
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
