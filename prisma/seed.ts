import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});
const products = [
  {
    id: "arc-lamp",
    name: "Arc table light",
    category: "Lighting",
    description:
      "A soft pool of light for reading, planning and late-night ideas. A clean silhouette that feels at home on a smaller desk.",
    image: "/images/lamp.jpg",
    specs: {
      Style: "Table lamp",
      Shade: "Fabric shade",
      Use: "Indoor workspace",
      Finish: "Matte",
      Care: "Wipe with a dry cloth",
    },
    options: [
      ["Warm white", 249000],
      ["Neutral white", 259000],
    ],
  },
  {
    id: "type-keyboard",
    name: "Type compact keyboard",
    category: "Tech",
    description:
      "Make room for better typing. A compact keyboard layout with a satisfying feel and a smaller footprint for your everyday setup.",
    image: "/images/keyboard.jpg",
    specs: {
      Layout: "Compact",
      Connection: "USB",
      Keys: "Mechanical style",
      Use: "Study and everyday work",
      Care: "Clean with a soft brush",
    },
    options: [
      ["Linear switches", 389000],
      ["Tactile switches", 409000],
    ],
  },
  {
    id: "glide-mouse",
    name: "Glide wireless mouse",
    category: "Tech",
    description:
      "Comfortable control without the cable clutter. A simple everyday mouse for moving between assignments, spreadsheets and creative work.",
    image: "/images/mouse.jpg",
    specs: {
      Connection: "Wireless receiver",
      Shape: "Contoured",
      Controls: "Buttons and scroll wheel",
      Use: "Everyday desktop work",
      Care: "Wipe clean",
    },
    options: [
      ["Standard", 149000],
      ["Extended battery", 169000],
    ],
  },
  {
    id: "rise-stand",
    name: "Rise laptop stand",
    category: "Desk essentials",
    description:
      "Give your screen a little lift. A sturdy desk companion that brings your laptop closer to eye level and frees space underneath.",
    image: "/images/stand.jpg",
    specs: {
      Material: "Metal",
      Format: "Desktop stand",
      Use: "Laptop support",
      Placement: "Flat stable surface",
      Care: "Dry cloth",
    },
    options: [
      ["Compact", 229000],
      ["Wide", 269000],
    ],
  },
  {
    id: "studio-headphones",
    name: "Studio listening headphones",
    category: "Tech",
    description:
      "Find your focus with a comfortable pair of over-ear headphones. Made for your study soundtrack, video calls and a quieter workday.",
    image: "/images/headphones.jpg",
    specs: {
      Style: "Over ear",
      Connection: "Wired",
      Fit: "Adjustable",
      Use: "Music and calls",
      Care: "Dry cloth",
    },
    options: [
      ["Standard cable", 299000],
      ["Long cable", 319000],
    ],
  },
  {
    id: "focus-mat",
    name: "Focus desk mat",
    category: "Desk essentials",
    description:
      "A defined space for your keyboard and mouse. A soft surface that ties your everyday tools together and makes your desk feel considered.",
    image: "/images/mat.jpg",
    specs: {
      Surface: "Textured fabric",
      Shape: "Rectangular",
      Use: "Keyboard and mouse",
      Base: "Non-slip style",
      Care: "Spot clean",
    },
    options: [
      ["Medium", 99000],
      ["Large", 139000],
    ],
  },
];
for (const { options, ...product } of products) {
  await db.product.upsert({
    where: { id: product.id },
    create: product,
    update: product,
  });
  for (const [index, option] of options.entries()) {
    const [label, price] = option as [string, number];
    const id = `${product.id}-${index}`;
    await db.variant.upsert({
      where: { id },
      create: { id, productId: product.id, label, price, stock: 15 },
      update: { label, price },
    });
  }
}
console.log(
  "Seeded six products and twelve options. Existing stock preserved.",
);
await db.$disconnect();
