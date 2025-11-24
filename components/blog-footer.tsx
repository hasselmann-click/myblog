"use client"

import Link from "next/link"
import { Github, Rss } from "lucide-react"
import ThemeToggle from "./theme-toggle"

export default function BlogFooter() {
  return (
    <footer className="sticky bottom-0 border-t border-border bg-background">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="https://example.com/feed.xml"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Rss className="w-5 h-5" />
              <span className="text-sm font-medium">RSS</span>
            </Link>
            <Link
              href="https://github.com"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm font-medium">GitHub</span>
            </Link>
          </div>

          {/* Theme toggle */}
          <ThemeToggle />
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          <p>© 2025 hasselmann. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
