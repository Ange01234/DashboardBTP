import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import LayoutContent from "@/components/layout/LayoutContent";

import localFont from 'next/font/local'

const inter = localFont({
  src: './fonts/Inter-VariableFont.ttf',
  display: 'swap',
})


export const metadata: Metadata = {
  title: "BTPDash | Gestion de Chantier",
  description: "Application professionnelle de gestion de chantier pour PME et artisans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <LayoutContent>
            {children}
          </LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
