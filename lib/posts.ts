import fs from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { PostDto } from '@/types';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

// TODO dynamically import languages to highlight
// - declare language in frontmatter
// - register dynamically with hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('javascript', javascript);
const md = new MarkdownIt({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (_) {}
        }

        return ''; // use external default escaping
    },
});

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
    const { data, content: mdcontent } = await parseFile(file);
    // const content = await markdownToHtml(mdcontent);
    return { ...data, slug, content: mdcontent } as PostDto;
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
    return md.render(markdown);
};
