import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Inter, Open_Sans, Roboto_Mono } from 'next/font/google';
import "./globals.css";

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-inter',
});

const openSans = Open_Sans({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-open-sans',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-roboto-mono',
});

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-atkinson-hyperlegible',
});

export const metadata: Metadata = {
  title: "Repair Café",
  description: "Repair Café Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${inter.variable} ${openSans.variable} ${robotoMono.variable} ${atkinsonHyperlegible.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
} 
