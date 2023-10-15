import { Link } from '@nextui-org/link';
import { RssFilledIcon } from '../icons';

export const PageFooter = () => {
    return (
        <>
            <Link href="/api/rss">
                <RssFilledIcon />
                <small style={{ paddingTop: '6px' }}>RSS</small>
            </Link>
        </>
    );
};
