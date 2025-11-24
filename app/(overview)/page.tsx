"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import BlogHeader from "@/components/blog-header"
import BlogFooter from "@/components/blog-footer"
import { BlogPostCard, BlogPost } from "@/components/blog-post-card"

// Mock data - replace with your actual blog data
const MOCK_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 16",
    date: "2025-11-24",
    preview:
      "Exploring the new features and improvements in Next.js 16, including Turbopack and React Compiler support.",
    tags: ["Next.js", "React", "Web Development"],
    readingTime: 8,
  },
  {
    id: "2",
    title: "The Art of Minimalist Design",
    date: "2025-11-20",
    preview: "How to create beautiful, focused interfaces by removing unnecessary elements and embracing simplicity.",
    image: "/minimalist-design.png",
    tags: ["Design", "UX"],
    readingTime: 6,
  },
  {
    id: "3",
    title: "Mastering Tailwind CSS",
    date: "2025-11-15",
    preview: "Learn advanced Tailwind techniques to build responsive, maintainable designs faster than ever.",
    image: "/tailwind-css-logo.png",
    tags: ["CSS", "Tailwind", "Web Design"],
    readingTime: 10,
  },
  {
    id: "4",
    title: "Understanding React Server Components",
    date: "2025-11-10",
    preview: "Deep dive into RSCs and how they can improve performance and developer experience in modern React apps.",
    tags: ["React", "Performance"],
    readingTime: 12,
  },
  {
    id: "5",
    title: "Building Scalable APIs",
    date: "2025-11-05",
    preview: "Best practices for designing APIs that grow with your application and maintain performance at scale.",
    image: "/api-design-concept.png",
    tags: ["Backend", "Architecture"],
    readingTime: 9,
  },
]

export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>(MOCK_POSTS.slice(0, 3))
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)

  // Simulate loading more posts
  const loadMorePosts = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    // Simulate network delay
    setTimeout(() => {
      setPosts((prev) => {
        const currentCount = prev.length
        const newPosts = MOCK_POSTS.slice(currentCount, currentCount + 3)
        if (newPosts.length === 0) {
          setHasMore(false)
        }
        return [...prev, ...newPosts]
      })
      setIsLoading(false)
    }, 500)
  }, [isLoading, hasMore])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMorePosts()
        }
      },
      { threshold: 0.1 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, loadMorePosts])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <BlogHeader />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Blog posts list */}
        <div className="space-y-8">
          {posts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} isNewest={index === 0} link="/test" />
          ))}
        </div>

        {/* Infinite scroll trigger */}
        <div ref={observerTarget} className="h-12 flex items-center justify-center mt-12">
          {isLoading && <p className="text-muted-foreground text-sm">Loading more posts...</p>}
          {!hasMore && posts.length > 0 && <p className="text-muted-foreground text-sm">No more posts</p>}
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}
