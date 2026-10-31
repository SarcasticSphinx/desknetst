"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Grid2X2,
  Bookmark,
  ShoppingBasket,
  MoveUpRight,
  ScanLine,
} from "lucide-react";
import { useShop } from "./shop-provider";
export function Header() {
  const { cart, saved } = useShop();
  const pathname = usePathname();
  const count = cart.reduce((n, x) => n + x.quantity, 0);
  const links = [
    {
      href: "/#collection",
      label: "Explore",
      number: "01",
      icon: Grid2X2,
      active: pathname === "/" || pathname.startsWith("/products"),
    },
    {
      href: "/wishlist",
      label: "Saved",
      number: "02",
      icon: Bookmark,
      active: pathname === "/wishlist",
      count: saved.length,
    },
    {
      href: "/cart",
      label: "Basket",
      number: "03",
      icon: ShoppingBasket,
      active: pathname === "/cart" || pathname === "/checkout",
      count,
    },
  ];
  return (
    <aside className="site-rail">
      <Link href="/" className="brand" aria-label="DeskNest home">
        <span className="brand-mark">
          <ScanLine size={25} />
        </span>
        <span>
          desk<span className="brand-light">nest</span>
          <small>WORKSPACE SUPPLY</small>
        </span>
      </Link>
      <div className="rail-edition">
        INDEPENDENT TOOLS
        <br />
        FOR EVERYDAY WORK.
      </div>
      <nav aria-label="Main navigation">
        {links.map(({ href, label, number, icon: Icon, active, count }) => (
          <Link
            key={href}
            href={href}
            className={active ? "rail-link active" : "rail-link"}
            aria-current={active ? "page" : undefined}
          >
            <span className="nav-number">{number}</span>
            <Icon size={20} />
            <span>{label}</span>
            {count !== undefined && <small>{count}</small>}
          </Link>
        ))}
      </nav>
      <div className="rail-bottom">
        <div className="rail-note">
          <span className="status-dot" />
          YOUR DESK. YOUR SYSTEM.
        </div>
        <p>
          Practical pieces.
          <br />A different kind of workspace.
        </p>
        <Link href="/#approach">
          About the collection <MoveUpRight size={15} />
        </Link>
        <div className="rail-country">BDT / BANGLADESH</div>
      </div>
    </aside>
  );
}
export function Footer() {
  return (
    <footer id="approach">
      <div className="footer-top">
        <span className="footer-wordmark">
          desknest<span> / SUPPLY</span>
        </span>
        <p>
          Objects that work.
          <br />
          Space to do your thing.
        </p>
        <Link href="/#collection" className="footer-link">
          Back to collection <MoveUpRight size={18} />
        </Link>
      </div>
      <div className="footer-bottom">
        <span>A student demonstration store.</span>
        <span>Illustrative photography · Cash on delivery</span>
        <span>DESIGNED AROUND YOUR DAY.</span>
      </div>
    </footer>
  );
}
