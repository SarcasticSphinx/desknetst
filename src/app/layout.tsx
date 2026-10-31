import type { Metadata } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "./globals.css";
import { ShopProvider } from "@/components/shop-provider";
import { Header, Footer } from "@/components/header";
export const metadata: Metadata = {
  title: {
    default: "DeskNest — Make room for better work",
    template: "%s | DeskNest",
  },
  description:
    "Thoughtful desk accessories for a calmer, more useful workspace.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ShopProvider>
          <Header />
          <div className="app-shell">
            {children}
            <Footer />
          </div>
        </ShopProvider>
      </body>
    </html>
  );
}
