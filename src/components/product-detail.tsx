"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bookmark,
  Plus,
  ArrowLeft,
  Truck,
  Banknote,
  Check,
  Expand,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/lib/types";
import { money } from "@/lib/cart";
import { useShop } from "./shop-provider";
export function ProductDetail({ product: p }: { product: Product }) {
  const [option, setOption] = useState(p.variants[0].id);
  const variant = p.variants.find((v) => v.id === option)!;
  const { add, toggle, saved } = useShop();
  const specs =
    p.specs && typeof p.specs === "object" ? Object.entries(p.specs) : [];
  return (
    <main className="page-wrap product-page">
      <div className="product-topline">
        <Link className="back-link" href="/#collection">
          <ArrowLeft size={16} />
          Supply index
        </Link>
        <span className="eyebrow">
          {p.category} / {p.id.toUpperCase()}
        </span>
      </div>
      <div className="product-heading">
        <h1>{p.name}</h1>
        <ArrowDownRight size={42} strokeWidth={1.2} />
      </div>
      <div className="product-stage">
        <Dialog>
          <DialogTrigger
            className="detail-image"
            aria-label={`Enlarge ${p.name}`}
          >
            <Image
              src={p.image}
              alt={p.name}
              fill
              priority
              sizes="(max-width: 800px) 90vw, 45vw"
            />
            <span>
              <Expand size={15} />
              Expand image
            </span>
          </DialogTrigger>
          <DialogContent className="photo-dialog">
            <DialogTitle>{p.name}</DialogTitle>
            <div>
              <Image
                src={p.image}
                alt={p.name}
                width={1000}
                height={900}
                style={{
                  maxHeight: "75vh",
                  width: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
        <section className="purchase-panel">
          <span className="eyebrow">CONFIGURE YOUR OBJECT</span>
          <p className="detail-price">{money(variant.price)}</p>
          <p className="description">{p.description}</p>
          <div className="option-title">
            <span>01 / Choose your option</span>
            <strong>{variant.label}</strong>
          </div>
          <div className="option-row">
            {p.variants.map((v) => (
              <Button
                key={v.id}
                variant="outline"
                className={option === v.id ? "option selected" : "option"}
                onClick={() => setOption(v.id)}
                aria-pressed={option === v.id}
              >
                {v.label}
                {option === v.id && <Check size={14} />}
              </Button>
            ))}
          </div>
          <p className="stock">
            <span className="status-dot" />
            {variant.stock > 0
              ? `${variant.stock} in stock`
              : "Currently unavailable"}
          </p>
          <div className="purchase-row">
            <Button
              className="primary-button"
              disabled={variant.stock === 0}
              onClick={() =>
                add({
                  variantId: variant.id,
                  productId: p.id,
                  name: p.name,
                  option: variant.label,
                  image: p.image,
                  price: variant.price,
                  stock: variant.stock,
                  quantity: 1,
                })
              }
            >
              <Plus />
              Add to cart
            </Button>
            <Button
              variant="outline"
              className="wish-action"
              onClick={() => toggle(p.id)}
              aria-label={
                saved.includes(p.id) ? "Remove from saved" : "Save product"
              }
            >
              <Bookmark fill={saved.includes(p.id) ? "currentColor" : "none"} />
            </Button>
          </div>
          <div className="delivery-note">
            <span>
              <Truck size={18} />
              Delivery from ৳60
            </span>
            <span>
              <Banknote size={18} />
              Pay on arrival
            </span>
          </div>
        </section>
      </div>
      <section className="spec-section">
        <div>
          <span className="eyebrow">OBJECT NOTES / 02</span>
          <h2>The useful details.</h2>
          <p>The specifications for your next desk upgrade.</p>
          <p className="fine-print">
            Sample catalogue specifications. Photograph is illustrative;
            selected options may not be pictured.
          </p>
        </div>
        <Table>
          <TableBody>
            {specs.map(([k, v]) => (
              <TableRow key={k}>
                <TableCell>{k}</TableCell>
                <TableCell>{String(v)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
