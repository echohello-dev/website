import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "echoHello - Modern Web Solutions",
  description: "Building innovative web applications with Next.js, TypeScript, and modern technologies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
