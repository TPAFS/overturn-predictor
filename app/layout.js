import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Overturn Predictor",
  description:
    "Overturn Predictor is an AI tool that can help patients and providers navigating inappropriate health insurance denials. You can use it to predict the liklihood of your insurance denial being overturned on appeal.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Analytics />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
