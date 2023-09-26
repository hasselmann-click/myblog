import Markdown from 'markdown-to-jsx';
import { CSSProperties } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism';
import Head from 'next/head';

export const MarkdownNode = (props: { markdown: string; hlStyle: { [key: string]: CSSProperties } }) => {
    const { markdown, hlStyle } = props;
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
            </Head>
            <article
                className={`
            prose 
            max-w-prose
            dark:prose-invert
            prose-a:text-blue-600 
            prose-zinc 

            sm:prose-sm
            sm:text-sm
            sm:min-w-0

            md:max-w-prose
            md:text-lg
            
            lg:prose-xl`}
                style={{ maxWidth: '100%' }}
            >
                <Markdown
                    options={{
                        overrides: {
                            pre: {
                                component: PreTagCodeHighlighter,
                                props: { hlStyle },
                            },
                        },
                    }}
                >
                    {markdown}
                </Markdown>
            </article>
        </>
    );
};

/**
 * Code highlight component for markdown-to-jsx.
 * MTJ uses <pre><code/></pre> for code blocks, but <SyntaxHighlighter/> adds a <pre/>
 * itself. Thus overriding the <pre/> component is necessary, otherwise it's rendered twice.
 */
const PreTagCodeHighlighter = ({ children, hlStyle, ...preRest }: any) => {
    if ('type' in children && children['type'] === 'code') {
        const { className, children: codeChildren } = children.props;
        const language = className.replace('lang-', '');
        return (
            <SyntaxHighlighter language={language} style={hlStyle}>
                {codeChildren}
            </SyntaxHighlighter>
        );
    }
    return <pre {...preRest}>{children}</pre>;
};
