import Markdown from 'markdown-to-jsx';
import { CSSProperties } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism';

export const MarkdownNode = (props: { markdown: string; hlStyle: { [key: string]: CSSProperties } }) => {
    const { markdown, hlStyle } = props;
    return (
        <article className="prose lg:prose-xl  dark:prose-invert prose-a:text-blue-600 prose-zinc">
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
