import { GithubIcon, RssIcon } from '@/components/icons';
import { Link } from '@nextui-org/link';

const PATH_RSS = '/rss';
const PATH_GH = 'https://github.com/hasselmann-click/myblog';

export const PageFooter = () => {
    return (
        <>
            <Link href={PATH_RSS}>
                <RssIcon />
                <small style={{ paddingTop: '6px' }}>RSS</small>
            </Link>
            <Link href={PATH_GH}>
                <GithubIcon />
                <small style={{ paddingTop: '6px' }}>Github</small>
            </Link>
        </>
    );
};
