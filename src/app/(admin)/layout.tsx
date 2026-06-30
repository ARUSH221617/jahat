import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AdminShell } from "@/components/admin/admin-shell";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jahat - Educational Institute",
  description:
    "Official online platform for Jahat Educational Institute. Empowering students and cultivating elite talents with practical skills and professional training.",
  keywords: [
    "Jahat",
    "Educational Institute",
    "Elite Training",
    "Programming",
    "Web Design",
    "Office Skills",
    "Konkur Preparation",
  ],
  authors: [{ name: "Jahat Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Jahat - Educational Institute",
    description:
      "Empowering students and cultivating elite talents with practical skills and professional training",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jahat - Educational Institute",
    description:
      "Empowering students and cultivating elite talents with practical skills and professional training",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <TooltipProvider>
          <AdminShell>
              {children}
          </AdminShell>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
