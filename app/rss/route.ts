import { getPosts } from '@/lib/posts';
import { NextResponse } from 'next/server';
import RSS from 'rss';

// TODO use global path constants
const url = 'https://hasselmann.click';
const path = '/rss';

export const GET = async () => {
    const posts = await getPosts();
    const postsSortedByPublishedAt = posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    // I know that there is at least one post
    const feed = new RSS({
        title: 'hasselmann.click',
        description: 'A blog about my personal tech projects',
        feed_url: `${url}/${path}`,
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
