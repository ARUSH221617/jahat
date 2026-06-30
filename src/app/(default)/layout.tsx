import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://jahat.ir'),
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
    "Education Certificate Iran",
    "Khorramshahr Educational Workshops"
  ],
  alternates: {
    canonical: '/',
  },
  authors: [{ name: "Jahat Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Jahat - Educational Institute",
    description:
      "Empowering students and cultivating elite talents with practical skills and professional training",
    type: "website",
    siteName: "Jahat",
    locale: "en_US",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Jahat Educational Institute",
    "url": "https://jahatintl.com",
    "logo": "https://jahatintl.com/favicon.ico",
    "description": "Official online platform for Jahat Educational Institute.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Khorramshahr",
      "addressRegion": "Khuzestan",
      "addressCountry": "IR"
    },
    "sameAs": [
      "https://facebook.com/jahat",
      "https://twitter.com/jahat",
      "https://instagram.com/jahat"
    ]
  };

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
