import BlogHeader from "@/components/blog-header"
import BlogFooter from "@/components/blog-footer"
import { BlogPostCard, BlogPost } from "@/components/blog-post-card"
import { getPosts } from "@/lib/posts"

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <BlogHeader />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Blog posts list */}
        <div className="space-y-8">
          {posts
            .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
            .map((post, index) => {
              const blogPost = {
                id: post.slug,
                title: post.title,
                date: post.publishedAt.toISOString(),
                // preview: post.content,
                // tags: [],
                // readingTime: 0,
                image: post.imgSrc,
              } as BlogPost;
              return <BlogPostCard key={post.slug} post={blogPost} isNewest={index === 0} link={`/${post.slug}`} />
            })}
        </div>

      </main>

      <BlogFooter />
    </div>
  )
}
