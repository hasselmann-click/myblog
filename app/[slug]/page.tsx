import { getPost, getPosts } from '@/lib/posts';
import { NextPage } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

type Params = {
    slug: string;
};
type Props = {
    params: Params;
};

/**
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export const generateStaticParams = async (): Promise<Params[]> => {
    const posts = await getPosts();
    return posts.map((post) => ({ slug: post.slug }));
};

const Page = async (props: Props) => {
    const {
        params: { slug },
    } = props;
    const post = await getPost(slug);
    if (!post) {
        notFound();
    }
    // return <div dangerouslySetInnerHTML={{ __html: post.content }}></div>;
    return (
        <article className="prose lg:prose-xl  dark:prose-invert prose-a:text-blue-600 prose-zinc">
            <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>
    );
};
export default Page;
