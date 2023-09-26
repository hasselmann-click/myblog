import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export type PostDto = {
    title: string;
    slug: string;
    publishedAt: Date;
    content: string;
    imgSrc?: string;
};
