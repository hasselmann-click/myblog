import { RssFilledIcon } from '@/components/icons';
import { Link } from '@nextui-org/link';

const PATH = '/rss';

export const PageFooter = () => {
    return (
        <>
            <Link href={PATH}>
                <RssFilledIcon />
                <small style={{ paddingTop: '6px' }}>RSS</small>
            </Link>
        </>
    );
};
