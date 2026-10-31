"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Plus,
  ArrowLeft,
  Truck,
  PackageCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <main className="page-wrap">
      <Link className="back-link" href="/#collection">
        <ArrowLeft size={16} />
        Back to the edit
      </Link>
      <div className="detail-grid">
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
              sizes="(max-width: 800px) 90vw, 50vw"
            />
            <span>
              Take a closer look <Plus size={14} />
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
        <section className="detail-copy">
          <Badge variant="outline">{p.category}</Badge>
          <h1>{p.name}</h1>
          <p className="detail-price">{money(variant.price)}</p>
          <p className="description">{p.description}</p>
          <label className="field-label" htmlFor="option">
            Make it yours <span>{variant.label}</span>
          </label>
          <div className="option-row" id="option">
            {p.variants.map((v) => (
              <Button
                key={v.id}
                variant={option === v.id ? "default" : "outline"}
                onClick={() => setOption(v.id)}
                aria-pressed={option === v.id}
              >
                {v.label}
                {option === v.id && <Check size={14} />}
              </Button>
            ))}
          </div>
          <p className="stock">
            <span className="live-dot" />
            {variant.stock > 0
              ? `${variant.stock} available for your workspace`
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
              <Heart fill={saved.includes(p.id) ? "currentColor" : "none"} />
            </Button>
          </div>
          <div className="delivery-note">
            <span>
              <Truck size={18} />
              Standard ৳60 · Express ৳120
            </span>
            <span>
              <PackageCheck size={18} />
              Cash on delivery
            </span>
          </div>
          <h2 className="spec-heading">The details, considered.</h2>
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
          <p className="fine-print">
            Sample catalogue specifications. Photograph is illustrative;
            selected options may not be pictured.
          </p>
        </section>
      </div>
    </main>
  );
}
