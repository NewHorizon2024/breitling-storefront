"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MiniCart from "./MiniCart";

export default function Navbar() {
  const pathname = usePathname();

  const linkBase = "text-gray-600 hover:text-gray-900 transition font-medium";
  const linkActive = "text-black font-semibold border-b-2 border-black pb-1";

  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center gap-6 sm:gap-8">
        <Link href="/" className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900" aria-label="Breitling — home">
          <svg
            viewBox="0 0 220 60"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            className="h-9 w-auto"
          >
            <rect x="0" y="0" width="220" height="60" rx="12" fill="#050816" />

            <circle
              cx="35"
              cy="30"
              r="18"
              fill="none"
              stroke="#F5D06F"
              strokeWidth="2"
            />

            <path
              d="M30 20h6c3 0 5 2 5 4.5c0 2-1.3 3.4-3 3.9c1.9.5 3.5 2 3.5 4.3C41.5 35.5 39.5 37 36.5 37H30Z"
              fill="none"
              stroke="#F5D06F"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <text
              x="65"
              y="34"
              fill="#F5D06F"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              fontSize="20"
              letterSpacing="4"
            >
              BRETLING
            </text>

            <text
              x="67"
              y="47"
              fill="#8C93A5"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              fontSize="9"
              letterSpacing="3"
            >
              CHRONOGRAPH DESIGN
            </text>
          </svg>
        </Link>

        <Link
          href="/products"
          className={pathname.startsWith("/products") ? linkActive : linkBase}
        >
          Products
        </Link>

        <Link
          href="/orders"
          className={pathname.startsWith("/orders") ? linkActive : linkBase}
        >
          Orders
        </Link>
      </div>

      <MiniCart />
    </nav>
  );
}
