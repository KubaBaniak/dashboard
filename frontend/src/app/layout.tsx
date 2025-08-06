import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import AppLayout from "@/components/layouts/AppLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sales Admin Dashboard",
  description: "Manage products, clients, orders and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="font-sans antialiased">
        <QueryProvider>
          <SidebarProvider>
            <AppLayout>{children}</AppLayout>
            <Toaster />
          </SidebarProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
