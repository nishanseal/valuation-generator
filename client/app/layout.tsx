import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cash Flow Valuation App',
  description: 'Convert cash flow Excel files to professional PDF valuation reports',
  keywords: ['cash flow', 'valuation', 'excel', 'pdf', 'financial', 'dcf'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900/90 via-blue-900/90 to-slate-900/90">
          {children}
        </div>
      </body>
    </html>
  )
}
