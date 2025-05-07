import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Terminal Coffee System",
  description: "Terminal Coffee System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="terminal">
      <head>
        {process.env.NODE_ENV === "development" && (
          <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-mono antialiased bg-black max-h-screen h-screen flex flex-col overflow-y-auto p-6`}
      >
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
