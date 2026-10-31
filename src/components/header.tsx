"use client";
import Link from "next/link";
import { Armchair, Heart, ShoppingCart, ArrowUpRight } from "lucide-react";
import { useShop } from "./shop-provider";
export function Header() {
  const { cart, saved } = useShop();
  return (
    <>
      <div className="announcement">
        A little more focus. A little less clutter. <ArrowUpRight size={12} />
      </div>
      <header className="header">
        <Link href="/" className="brand" aria-label="DeskNest home">
          <Armchair size={27} strokeWidth={1.8} />
          desknest<span>®</span>
        </Link>
        <nav>
          <Link href="/#collection">Shop the edit</Link>
          <Link href="/#approach">Our approach</Link>
        </nav>
        <div className="header-actions">
          <Link
            href="/wishlist"
            aria-label={`Saved products (${saved.length})`}
          >
            <Heart size={20} />
            <span className="desktop-label">Saved</span>
            <small>{saved.length}</small>
          </Link>
          <Link
            href="/cart"
            aria-label={`Cart (${cart.reduce((n, x) => n + x.quantity, 0)})`}
          >
            <ShoppingCart size={20} />
            <span className="desktop-label">Cart</span>
            <small>{cart.reduce((n, x) => n + x.quantity, 0)}</small>
          </Link>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer id="approach">
      <div>
        <Link href="/" className="brand">
          <Armchair size={26} />
          desknest
        </Link>
        <p>Thoughtful things for the place you make things.</p>
      </div>
      <p>
        A student demonstration store.
        <br />
        Illustrative photography · Cash on delivery
      </p>
      <span>Less clutter. More possibility.</span>
    </footer>
  );
}
