import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BudgetTracker - Personal Finance Management Made Simple",
    template: "%s | BudgetTracker",
  },
  description:
    "Take control of your finances with BudgetTracker. Track income, expenses, and spending patterns with beautiful charts, insightful analytics, and powerful budgeting tools. Free personal finance management app.",
  keywords: [
    "budget tracker",
    "personal finance",
    "expense tracking",
    "income tracking",
    "financial management",
    "budgeting app",
    "money management",
    "spending tracker",
    "financial analytics",
    "expense categories",
    "budget planning",
    "financial goals",
  ],
  authors: [{ name: "Harshit Sharda" }],
  creator: "Harshit Sharda",
  publisher: "Harshit Sharda",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://budget-tracker-x.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://budget-tracker-x.vercel.app",
    title: "BudgetTracker - Personal Finance Management Made Simple",
    description:
      "Take control of your finances with BudgetTracker. Track income, expenses, and spending patterns with beautiful charts, insightful analytics, and powerful budgeting tools.",
    siteName: "BudgetTracker",
    images: [
      {
        url: "https://budget-tracker-x.vercel.app/screenshots/dashboard-overview.png",
        width: 1200,
        height: 630,
        alt: "BudgetTracker Dashboard Overview",
      },
      {
        url: "https://budget-tracker-x.vercel.app/screenshots/dashboard-monthly.png",
        width: 1200,
        height: 630,
        alt: "BudgetTracker Monthly Dashboard",
      },
      {
        url: "https://budget-tracker-x.vercel.app/screenshots/dashboard-range.png",
        width: 1200,
        height: 630,
        alt: "BudgetTracker Range-based Dashboard",
      },
      {
        url: "https://budget-tracker-x.vercel.app/screenshots/profile.png",
        width: 1200,
        height: 630,
        alt: "BudgetTracker Profile Management",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "_RhmxzHL8rh5-h1g8L-S3eYZgp4Zctilt9M08pfSdKM",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicon-32x32.png", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ProfileProvider>{children}</ProfileProvider>
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10B981",
                secondary: "#fff",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#EF4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
