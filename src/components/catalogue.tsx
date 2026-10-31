"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Heart,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Truck,
  PackageCheck,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { money } from "@/lib/cart";
import { useShop } from "./shop-provider";
export function ProductCard({ product: p }: { product: Product }) {
  const { saved, toggle } = useShop();
  return (
    <article className="product-card">
      <div className="product-image">
        <Link href={`/products/${p.id}`}>
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width: 640px) 90vw, 33vw"
          />
        </Link>
        <Button
          variant="outline"
          size="icon"
          className="save-button"
          onClick={() => toggle(p.id)}
          aria-label={`${saved.includes(p.id) ? "Unsave" : "Save"} ${p.name}`}
        >
          <Heart fill={saved.includes(p.id) ? "currentColor" : "none"} />
        </Button>
        <Badge className="category-tag" variant="secondary">
          {p.category}
        </Badge>
      </div>
      <div className="product-title">
        <Link href={`/products/${p.id}`}>
          <h3>{p.name}</h3>
        </Link>
        <ArrowUpRight size={18} />
      </div>
      <div className="product-meta">
        <span>{p.variants.length} options</span>
        <strong>From {money(p.variants[0].price)}</strong>
      </div>
    </article>
  );
}
export function Catalogue({
  products,
  onlySaved = false,
}: {
  products: Product[];
  onlySaved?: boolean;
}) {
  const { saved } = useShop();
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All"),
    [sort, setSort] = useState("featured"),
    [max, setMax] = useState("all");
  const list = products
    .filter(
      (p) =>
        (!onlySaved || saved.includes(p.id)) &&
        (category === "All" || p.category === category) &&
        p.name.toLowerCase().includes(query.toLowerCase()) &&
        (max === "all" || p.variants[0].price <= Number(max)),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.variants[0].price - b.variants[0].price
        : sort === "high"
          ? b.variants[0].price - a.variants[0].price
          : sort === "name"
            ? a.name.localeCompare(b.name)
            : 0,
    );
  return (
    <section className="collection" id="collection">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            {onlySaved ? "YOUR PERSONAL EDIT" : "THE EVERYDAY COLLECTION"}
          </span>
          <h2>
            {onlySaved
              ? "Good things, kept close."
              : "Small upgrades. Better days."}
          </h2>
        </div>
        <p>
          {onlySaved
            ? "Your saved products stay here for next time."
            : "Useful by design. A joy to use."}
        </p>
      </div>
      <div className="filters">
        <div className="categories">
          {["All", "Lighting", "Tech", "Desk essentials"].map((c) => (
            <Button
              key={c}
              variant={category === c ? "default" : "ghost"}
              onClick={() => setCategory(c)}
            >
              {c}
            </Button>
          ))}
        </div>
        <div className="filter-controls">
          <div className="search">
            <Search size={16} />
            <Input
              aria-label="Search products"
              placeholder="Find your next upgrade"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <label className="select-label">
            <SlidersHorizontal size={15} />
            <select
              aria-label="Maximum price"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            >
              <option value="all">Any price</option>
              <option value="200000">Under ৳2,000</option>
              <option value="300000">Under ৳3,000</option>
            </select>
          </label>
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>
      </div>
      <p className="result-count">{list.length} considered essentials</p>
      <div className="product-grid">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {!list.length && (
        <div className="empty">
          <Search size={30} />
          <h3>{onlySaved ? "Your edit starts here" : "No matches just yet"}</h3>
          <p>
            {onlySaved
              ? "Tap a heart on any product to save it here."
              : "Try another name, category or price."}
          </p>
          <Link href="/#collection" className="text-link">
            Browse the collection <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}
export function Home({ products }: { products: Product[] }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-heading">
          <div>
            <span className="eyebrow">
              <span className="live-dot" />
              THE WORKSPACE EDIT / VOL. 01
            </span>
            <h1>
              Make room for
              <br />
              <em>better work.</em>
            </h1>
          </div>
          <div className="hero-copy">
            <p>
              Good tools. A clearer desk.
              <br />A space that feels like you.
            </p>
            <a className="dark-link" href="#collection">
              Explore the edit <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
        <div className="hero-image">
          <Image
            src="/images/hero.jpg"
            alt="A considered workspace with a laptop and everyday desk tools"
            fill
            priority
            sizes="100vw"
          />
          <div className="image-label">
            <span>01 / A SPACE TO THINK</span>
            <p>
              Your next good idea
              <br />
              starts here.
            </p>
          </div>
          <div className="image-stamp">
            <Plus size={20} />
            Designed for your everyday.
          </div>
        </div>
        <div className="trust-row">
          <span>
            <Truck size={18} />
            Delivery across Bangladesh
          </span>
          <span>
            <PackageCheck size={18} />
            Pay when it arrives
          </span>
          <span>
            <Heart size={18} />
            Keep the things you love
          </span>
        </div>
      </section>
      <Catalogue products={products} />
      <section className="manifesto">
        <span className="eyebrow">LESS, BUT BETTER.</span>
        <h2>
          A desk is more than a surface.
          <br />
          Make it your kind of space.
        </h2>
        <p>
          We bring together a small edit of everyday essentials.
          <br />
          Nothing extra. Just the things that earn their place.
        </p>
        <a className="text-link" href="#collection">
          Find your next essential <ArrowRight size={18} />
        </a>
      </section>
    </main>
  );
}
