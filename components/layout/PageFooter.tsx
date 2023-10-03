import { Link } from '@nextui-org/link';

export const PageFooter = () => {
    return (
        <Link className="gap-1 text-current" href="/tutorial" title="NextUI Tutorialpage">
            <span className="text-default-500">Powered by</span>
            <p className="text-primary">NextUI</p>
        </Link>
    );
};
