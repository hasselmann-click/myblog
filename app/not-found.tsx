import { BlogPostCard } from '@/components/blog-post-card';
import { formatDate } from '@/lib/utils';

export default function FourOhFour() {
    return (
        <BlogPostCard isNewest={true} link='/' post={{ title: "404 - Not Found", preview: "The page you’re looking for doesn’t exist.", id: "404", date: formatDate(new Date()) }} />
    );
}
