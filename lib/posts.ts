import { PostDto } from '@/types';
import fs from 'fs/promises';
import matter from 'gray-matter';
import { join } from 'path';

// TODO scan articles always and additionally testarticles in dev
const articleDir = process.env.ARTICLE_DIRECTORY || 'articles';
const postsDirectory = join(process.cwd(), articleDir);

export const getPosts: () => Promise<PostDto[]> = async () => {
    const fileNames = await fs.readdir(postsDirectory);
    const posts = fileNames.map(async (fileName) => {
        const { data, slug, content } = await parseFile(fileName);
        const publishedAt = new Date(data.publishedAt);
        return { ...data, slug, content, publishedAt } as PostDto;
    });
    return await Promise.all(posts);
};

export const getPost: (slug: string) => Promise<PostDto | null> = async (slug) => {
    const fileNames = await fs.readdir(postsDirectory);
    const file = fileNames.find((fileName) => fileName.replace(/\.md$/, '') === slug);
    if (!file) {
        return null;
    }
    const { data, content: mdcontent } = await parseFile(file);
    const publishedAt = new Date(data.publishedAt);
    return { ...data, slug, content: mdcontent, publishedAt } as PostDto;
};

const parseFile = async (filename: string) => {
    const slug = filename.replace(/\.md$/, '');
    const fullPath = join(postsDirectory, slug + '.md');
    console.log(fullPath);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    return { ...matter(fileContents), slug };
};
