import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "./providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "degentle",
  description: "degentle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Web3Provider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </Web3Provider>
  );
}
