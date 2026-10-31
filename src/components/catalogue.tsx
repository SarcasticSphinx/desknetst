"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Bookmark as Heart,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Truck,
  PackageCheck,
  ArrowDownRight,
  ScanLine,
  Command,
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
            sizes="(max-width: 700px) 90vw, 35vw"
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
        <strong>
          {money(p.variants[0].price)}
          <small> starting price</small>
        </strong>
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
            {onlySaved ? "SAVED OBJECTS" : "THE SUPPLY INDEX"}
          </span>
          <h2>{onlySaved ? "Your shortlist." : "Choose your tools."}</h2>
        </div>
        <p>
          {onlySaved
            ? "Saved in your browser. Ready when you are."
            : "Six objects. One better workspace."}
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
              placeholder="Search the supply index"
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
      <p className="result-count">{list.length} objects in view</p>
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
      <section className="studio-hero">
        <div className="hero-bar">
          <span>
            <ScanLine size={15} /> WORKSPACE SUPPLY / 001
          </span>
          <span>TOOLS FOR THE WAY YOU WORK</span>
        </div>
        <div className="hero-bento">
          <div className="hero-statement">
            <span className="hero-kicker">CLEAR SPACE. SWITCH ON.</span>
            <h1>
              Good work
              <br />
              starts <span>here.</span>
            </h1>
            <p>
              Equip your desk with objects that do more.
              <br />
              Practical tools. A setup that’s all yours.
            </p>
            <a href="#collection" className="hero-cta">
              Find your tools <ArrowDownRight size={22} />
            </a>
            <span className="hero-coordinate">
              DN — 23.8103° N / EVERYDAY OBJECTS
            </span>
          </div>
          <div className="hero-photo">
            <Image
              src="/images/mat.jpg"
              alt="A keyboard and desk tools arranged in a focused workspace"
              fill
              priority
              sizes="(max-width: 700px) 90vw, 42vw"
            />
            <div className="photo-corner">
              <Command size={24} />
            </div>
            <div className="photo-caption">
              <span>SETUP / 01</span>
              <strong>
                Make focus
                <br />
                your default.
              </strong>
            </div>
          </div>
        </div>
        <div className="service-strip">
          <span>
            <Truck size={19} />
            <strong>Delivered to your desk</strong>
            <small>Across Bangladesh</small>
          </span>
          <span>
            <PackageCheck size={19} />
            <strong>Keep checkout simple</strong>
            <small>Pay on delivery</small>
          </span>
          <span>
            <Heart size={19} />
            <strong>Build your shortlist</strong>
            <small>Save now. Decide later.</small>
          </span>
        </div>
      </section>
      <Catalogue products={products} />
      <section className="manifesto">
        <div className="manifesto-number">DN/01</div>
        <div>
          <span className="eyebrow">FUNCTION FIRST. ALWAYS.</span>
          <h2>
            Less searching.
            <br />
            More doing.
          </h2>
          <p>
            A focused collection of workspace essentials.
            <br />
            Pick the pieces that fit the way you work.
          </p>
          <a href="#collection" className="text-link">
            Back to the supply index <ArrowRight size={18} />
          </a>
        </div>
        <div className="manifesto-symbol">
          <ScanLine size={140} strokeWidth={0.8} />
        </div>
      </section>
    </main>
  );
}
