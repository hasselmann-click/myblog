import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"

export interface BlogPost {
  id: string
  title: string
  date: string
  preview?: string
  image?: string
  tags?: string[]
  readingTime?: number
}

interface BlogPostCardProps {
  post: BlogPost
  isNewest?: boolean
  link: string
}

export function BlogPostCard({ post, isNewest = false, link }: BlogPostCardProps) {
  const formattedDate = formatDate(new Date(post.date))

  return (
    <article
      className={`group cursor-pointer transition-all duration-300 p-6 ${isNewest ? "bg-accent/30 border border-accent rounded-lg" : "p-0"
        }`}
    >
      <div className="space-y-4">
        {/* Image */}
        {post.image && (
          <div className="relative w-full h-48 sm:h-56 overflow-hidden rounded-lg bg-muted">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Content */}
        <div className={`space-y-3 ${!post.image && isNewest ? "pt-2" : ""}`}>
          {/* Title */}
          <h2
            className={`font-serif font-bold transition-colors group-hover:text-primary ${isNewest ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
              }`}
          >
            <Link href={link}>{post.title}</Link>
          </h2>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <time dateTime={post.date}>{formattedDate}</time>
            {post.readingTime && (
              <>
                <span>•</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
          </div>

          {/* Preview */}
          {post.preview && <p className="text-foreground/80 line-clamp-2 sm:line-clamp-3">{post.preview}</p>}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
