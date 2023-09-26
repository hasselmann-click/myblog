import { MarkdownNode } from '@/app/components/markdownNode';
import { getPost, getPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';

import { coldarkDark as hlStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
    return (
        <>
            <div className="flex justify-center">
                <MarkdownNode markdown={post.content} hlStyle={hlStyle} />
            </div>
        </>
    );
};
export default Page;
