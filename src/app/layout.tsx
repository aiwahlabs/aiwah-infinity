import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./responsive.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ClientOnly } from "@/components/ClientOnlyProvider";
import { ResponsiveWarning } from "@/components/ResponsiveWarning";
import { NavigationLoadingProvider } from "@/components/NavigationLoadingProvider";
import { ColorModeScript } from "@chakra-ui/react";
import { PerformanceTracker } from "@/components/PerformanceTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Infinity",
  description: "Built with Next.js and Supabase",
  viewport: {
    width: "device-width",
    initialScale: 1,
    minimumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" style={{ colorScheme: "dark" }}>
      <head>
        <ColorModeScript initialColorMode="dark" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        <ClientOnly>
          <ThemeProvider>
            <NavigationLoadingProvider>
              <AuthProvider>
                <PerformanceTracker />
                {children}
                <ResponsiveWarning />
              </AuthProvider>
            </NavigationLoadingProvider>
          </ThemeProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
