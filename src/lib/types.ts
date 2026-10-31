export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  specs: unknown;
  variants: { id: string; label: string; price: number; stock: number }[];
};
