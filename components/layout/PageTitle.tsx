import { Link } from '@nextui-org/link';

export const PageTitle: () => JSX.Element = () => {
    return (
        <Link className="font-bold text-5xl" href="/" title="hasselmann.ch">
            <h1 className="text-default-500">hasselmann</h1>
        </Link>
    );
};
