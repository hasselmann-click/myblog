import { NextPage } from 'next';
import { notFound } from 'next/navigation';

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
    // TODO fetch slugs for articles
    console.log('Static params');
    const slugs = await Promise.resolve(['test1', 'test2']);
    return slugs.map((slug) => ({ slug: slug }));
};

const Page: NextPage<Props> = async (props) => {
    const {
        params: { slug },
    } = props;
    const content = await Promise.resolve(slug + ' contentz');

    // TODO fetch content for article
    // if no content available, return to home page
    if (!content || !['test1', 'test2'].includes(slug)) {
        notFound();
    }
    return <div>{content}</div>;
};
export default Page;
