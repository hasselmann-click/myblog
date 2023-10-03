import { Link } from '@nextui-org/link';
import { HiOutlineArrowLeft } from 'react-icons/hi2';

export const BackButton = () => {
    return (
        <Link className="font-bold text-5xl" href="/" title="hasselmann.ch">
            <HiOutlineArrowLeft />
        </Link>
    );
};
