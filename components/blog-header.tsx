"use client"

import ThemeToggle from "./theme-toggle"

export default function BlogHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight font-serif">hasselmann</h1>
        <ThemeToggle />
      </div>
    </header>
  )
}
