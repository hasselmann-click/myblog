import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const BackButton = () => {
    return (
        <Link className="font-bold text-5xl" href="/" title="hasselmann.ch">
            <ArrowLeft />
        </Link>
    );
};
