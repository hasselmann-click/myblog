import { MarkdownNode } from '@/components/markdownNode';

import * as styles from 'react-syntax-highlighter/dist/esm/styles/prism';

const testMd = `
\`\`\`typescript
async function logMovies() {
  const response = await fetch("http://example.com/movies.json");
  const movies = await response.json();
  console.log(movies);
}
\`\`\`
`;

// https://github.com/react-syntax-highlighter/react-syntax-highlighter/tree/master/src/styles/prism
const Page = () => {
    return (
        <>
            <h3>a11yDark</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.a11yDark} />
            <h3>atomDark</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.atomDark} />
            <h3>base16AteliersulphurpoolLight</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.base16AteliersulphurpoolLight} />
            <h3>cb</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.cb} />
            <h3>coldarkCold</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.coldarkCold} />
            <h3>coldarkDark</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.coldarkDark} />
            <h3>coy</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.coy} />
            <h3>darcula</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.darcula} />
            <h3>dark</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.dark} />
            <h3>dracula</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.dracula} />
            <h3>duotoneDark</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.duotoneDark} />
            <h3>duotoneEarth</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.duotoneEarth} />
            <h3>duotoneForest</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.duotoneForest} />
            <h3>duotoneLight</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.duotoneLight} />
            <h3>duotoneSea</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.duotoneSea} />
            <h3>duotoneSpace</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.duotoneSpace} />
            <h3>funky</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.funky} />
            <h3>ghcolors</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.ghcolors} />
            <h3>gruvboxDark</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.gruvboxDark} />
            <h3>gruvboxLight</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.gruvboxLight} />
            <h3>hopscotch</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.hopscotch} />
            <h3>materialDark</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.materialDark} />
            <h3>materialLight</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.materialLight} />
            <h3>materialOceanic</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.materialOceanic} />
            <h3>nord</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.nord} />
            <h3>okaidia</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.okaidia} />
            <h3>oneDark</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.oneDark} />
            <h3>oneLight</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.oneLight} />
            <h3>pojoaque</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.pojoaque} />
            <h3>prism</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.prism} />
            <h3>shadesOfPurple</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.shadesOfPurple} />
            <h3>solarizedlight</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.solarizedlight} />
            <h3>synthwave84</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.synthwave84} />
            <h3>tomorrow</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.tomorrow} />
            <h3>twilight</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.twilight} />
            <h3>vs</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.vs} />
            <h3>vscDarkPlus</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.vscDarkPlus} />
            <h3>xonokai</h3>
            <MarkdownNode markdown={testMd} hlStyle={styles.xonokai} />
        </>
    );
};

export default Page;
