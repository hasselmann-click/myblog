import fs from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import remarkPrism from 'remark-prism';

import { PostDto } from '@/types';

const postsDirectory = join(process.cwd(), 'articles');

export const getPosts: () => Promise<PostDto[]> = async () => {
    const fileNames = await fs.readdir(postsDirectory);
    const posts = fileNames.map(async (fileName) => {
        const { data, slug, content } = await parseFile(fileName);
        return { ...data, slug, content } as PostDto;
    });
    return await Promise.all(posts);
};

export const getPost: (slug: string) => Promise<PostDto | null> = async (slug) => {
    const fileNames = await fs.readdir(postsDirectory);
    const file = fileNames.find((fileName) => fileName.replace(/\.md$/, '') === slug);
    if (!file) {
        return null;
    }
    console.log(1);
    const { data, content: mdcontent } = await parseFile(file);
    console.log(2);
    const content = await markdownToHtml(mdcontent);
    console.log(3);
    return { ...data, slug, content: content } as PostDto;
};

const parseFile = async (filename: string) => {
    const slug = filename.replace(/\.md$/, '');
    const fullPath = join(postsDirectory, slug + '.md');
    console.log(fullPath);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    console.log('Read file contents');
    return { ...matter(fileContents), slug };
};

const markdownToHtml = async (markdown: string): Promise<string> => {
    // eslint-disable-next-line prettier/prettier
    const result= await unified()
        .use(remarkParse)
        .use(remarkHtml, { sanitize: false })
        // .use(remarkPrism)
        .process(markdown);
    return result.toString();
};
