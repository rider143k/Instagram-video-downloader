import type { Metadata } from "next";
import { DM_Sans as RootFont } from "next/font/google";
import Script from "next/script";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/features/theme/theme-provider";
import { LocaleProvider } from "@/features/i18n/locale-provider";
import { ReactQueryProvider } from "@/features/react-query/react-query-provider";

import { cn } from "@/lib/utils";
import { siteMetadata } from "@/lib/site";
import { getLocale, getMessages } from "next-intl/server";

import "./globals.css";

const geistSans = RootFont({
  variable: "--font-root-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = siteMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <meta name="google-site-verification" content="NRla5PsChZqbUDCCnMapt2nZKwnBXYI2a_bVWCDCpYc" />
      <body className={cn("antialiased overflow-x-hidden", geistSans.className)}>
        <LocaleProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <ReactQueryProvider>
              {children}
              <Toaster closeButton />
            </ReactQueryProvider>
          </ThemeProvider>
        </LocaleProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8DX31MNHSJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-8DX31MNHSJ');
          `}
        </Script>
      </body>
    </html>
  );
}
