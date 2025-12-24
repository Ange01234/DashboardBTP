import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

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
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 lg:ml-72 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
