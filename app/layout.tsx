import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sentiment Analysis Dashboard",
  description: "AI-powered sentiment analysis and content processing",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-mono antialiased">{children}</body>
    </html>
  )
}
