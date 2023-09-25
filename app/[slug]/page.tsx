import { getPost, getPosts } from '@/lib/posts';
import Markdown from 'markdown-to-jsx';
import { notFound } from 'next/navigation';

import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

/**
 * Code highlight component for markdown-to-jsx.
 * MTJ uses <pre><code/></pre> for code blocks, but <SyntaxHighlighter/> adds a <pre/>
 * itself. Thus overriding the <pre/> component is necessary, otherwise it's rendered twice.
 */
const PreTagCodeHighlighter = ({ children, ...preRest }: any) => {
    if ('type' in children && children['type'] === 'code') {
        const { className, children: codeChildren } = children.props;
        const language = className.replace('lang-', '');
        return (
            <SyntaxHighlighter language={language} style={atomDark}>
                {codeChildren}
            </SyntaxHighlighter>
        );
    }
    return <pre {...preRest}>{children}</pre>;
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
        <article className="prose lg:prose-xl  dark:prose-invert prose-a:text-blue-600 prose-zinc">
            <Markdown
                options={{
                    overrides: {
                        pre: PreTagCodeHighlighter,
                    },
                }}
            >
                {post.content}
            </Markdown>
        </article>
    );
};
export default Page;
