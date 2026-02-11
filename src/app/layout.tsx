import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Collab Whiteboard",
  description: "Real-time collaborative whiteboard with AI features",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cream dark:bg-dark text-dark dark:text-cream">
        {children}
      </body>
    </html>
  );
}
