import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SideDrawer from "@/components/interface/SideDrawer";
import MainView from "@/components/interface/MainView";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sheo - Sharing Videos Simplified ✨",
  description: "A video sharing app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${inter.className} duration-500 grid grid-cols-24 h-screen overflow-hidden`}>
        <SideDrawer />
        <MainView>{children}</MainView>
        <Toaster />
      </body>
    </html>
  );
}
