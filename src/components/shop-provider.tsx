"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { addLine, changeQuantity, type CartLine } from "@/lib/cart";
import { toast, Toaster } from "@/components/ui/toast";
type ShopState = {
  cart: CartLine[];
  saved: string[];
  ready: boolean;
  add: (item: CartLine) => void;
  change: (id: string, n: number) => void;
  toggle: (id: string) => void;
  clear: () => void;
};
const Context = createContext<ShopState | null>(null);
export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]),
    [saved, setSaved] = useState<string[]>([]),
    [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("desknest-v1") ?? "{}");
      // Restore only the shapes the UI can safely display. Checkout validates again.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCart(
        Array.isArray(data.cart)
          ? data.cart.filter(
              (x: CartLine) =>
                typeof x.variantId === "string" &&
                typeof x.price === "number" &&
                Number.isInteger(x.quantity) &&
                x.quantity > 0 &&
                x.quantity <= 50,
            )
          : [],
      );
      setSaved(
        Array.isArray(data.saved)
          ? data.saved.filter((x: unknown) => typeof x === "string")
          : [],
      );
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      localStorage.setItem("desknest-v1", JSON.stringify({ cart, saved }));
  }, [cart, saved, ready]);
  const add = (item: CartLine) => {
    try {
      setCart(addLine(cart, item));
      toast.add({
        title: "Added to your cart",
        description: `${item.name} · ${item.option}`,
        type: "success",
      });
    } catch (e) {
      toast.add({
        title: e instanceof Error ? e.message : "Cannot add item",
        type: "error",
      });
    }
  };
  const change = (id: string, n: number) => {
    try {
      setCart(changeQuantity(cart, id, n));
    } catch (e) {
      toast.add({
        title: e instanceof Error ? e.message : "Check quantity",
        type: "error",
      });
    }
  };
  const toggle = (id: string) => {
    setSaved(
      saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id],
    );
    toast.add({
      title: saved.includes(id) ? "Removed from saved" : "Saved for later",
      type: "success",
    });
  };
  return (
    <Context.Provider
      value={{
        cart,
        saved,
        ready,
        add,
        change,
        toggle,
        clear: () => setCart([]),
      }}
    >
      {children}
      <Toaster />
    </Context.Provider>
  );
}
export function useShop() {
  const value = useContext(Context);
  if (!value) throw new Error("ShopProvider is missing");
  return value;
}
