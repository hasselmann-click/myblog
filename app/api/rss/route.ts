import { NextApiRequest, NextApiResponse } from 'next';
import { getPosts } from '@/lib/posts';
import RSS from 'rss';
import { NextResponse } from 'next/server';

const url = 'https://hasselmann.click';

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const posts = await getPosts();
    const postsSortedByPublishedAt = posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    // I know that there is at least one post
    const feed = new RSS({
        title: 'hasselmann.click',
        description: 'A blog about my personal tech projects',
        feed_url: `${url}/api/rss`,
        site_url: url,
        // image_url: 'Your Blog Logo URL',
        copyright: 'Copyright © hasselmann.click 2023',
        pubDate: postsSortedByPublishedAt[0].publishedAt,
        generator: 'Next.js using RSS Module', // optional
        managingEditor: 'hasselmann (info@hasselmann.click)',
    });

    posts.forEach((post) => {
        feed.item({
            title: post.title,
            url: `${url}/${post.slug}`,
            // TODO add description as soon as excerpt is added to posts
            description: 'tbd..',
            date: post.publishedAt,
            author: 'hasselmann',
        });
    });

    const response = new NextResponse(feed.xml());
    response.headers.set('Content-Type', 'application/rss+xml');
    return response;
};
