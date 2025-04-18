"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ReduxProvider } from "@/lib/redux/provider";
import MainLayout from "@/components/layout/MainLayout";
import "./globals.css";

// Metadata needs to be in a separate file since it can't be used with "use client"
// We'll create a separate metadata.ts file for this

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
