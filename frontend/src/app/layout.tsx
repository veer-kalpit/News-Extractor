import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "News Extractor",
  description: "Have latest News at your Finger tips",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
