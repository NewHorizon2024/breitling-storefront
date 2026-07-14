import { CartProvider } from "./_components/CartContext";
import Navbar from "./_components/Navbar";
import AnnouncementBar from "./_components/AnnouncementBar";
import "./globals.css";
import { type ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Breitling Storefront",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">Skip to content</a>

        <CartProvider>
          <AnnouncementBar />
          <header
            aria-label="Main navigation"
            className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70"
          >
            <Navbar />
          </header>
          <main id="main" tabIndex={-1}>{children}</main>
          <Toaster
            position="top-right"
            toastOptions={{
              className:
                "rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl",
              success: {
                iconTheme: {
                  primary: "#111827",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#b91c1c",
                  secondary: "#fff",
                },
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
