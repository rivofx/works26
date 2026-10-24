import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/store/cart-provider";
import { Header } from "@/components/store/header";
import { VideoBackground } from "@/components/store/video-background";

export const metadata: Metadata = {
  metadataBase: new URL("https://cobrax3s.com"),
  title: {
    default: "CobraX3S | Unleash Your Style",
    template: "%s | CobraX3S"
  },
  description: "Premium futuristic streetwear hoodies, tees, sweaters, and limited drops from CobraX3S.",
  openGraph: {
    title: "CobraX3S",
    description: "Unleash Your Style with premium luxury streetwear.",
    images: ["/products/cobrax3s-shadow-core-hoodie.png"],
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <CartProvider>
          <VideoBackground />
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
