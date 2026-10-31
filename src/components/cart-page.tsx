"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBasket as ShoppingCart,
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
    <main className="page-wrap basket-page">
      <Link className="back-link" href="/#collection">
        <ArrowLeft size={16} />
        Keep exploring
      </Link>
      <div className="section-heading">
        <div>
          <span className="eyebrow">BASKET / REVIEW YOUR OBJECTS</span>
          <h1>Ready for your desk?</h1>
        </div>
        <p>{cart.reduce((n, x) => n + x.quantity, 0)} items in your basket</p>
      </div>
      {!ready ? (
        <p>Loading your cart…</p>
      ) : !cart.length ? (
        <div className="empty">
          <ShoppingCart size={35} />
          <h2>Your basket is clear.</h2>
          <p>Find the tools you want to work with.</p>
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
              <span className="eyebrow">ORDER TOTAL / BDT</span>
              <h2>The numbers.</h2>
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
