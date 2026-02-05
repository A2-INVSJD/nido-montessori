import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nido Montessori | Centro de Estimulación Temprana y Daycare",
  description: "Centro de estimulación temprana Montessori, Daycare y Centro de tutorías en San Pedro Sula, Honduras. Cuidado integral para niños de 1 a 10 años.",
  keywords: "montessori, daycare, guardería, estimulación temprana, tutorías, San Pedro Sula, Honduras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
