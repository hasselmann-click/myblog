import { getPosts } from '@/lib/posts';
import { PostDto } from '@/types';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import NextLink from 'next/link';
import { PropsWithChildren } from 'react';

export default async function Home() {
    const posts = await getPosts();
    const postsOrdered = posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
    return (
        <>
            <div className="flex justify-center">
                {postsOrdered.slice(0, 1).map((post) => (
                    <PostPreview key={post.title} post={post} isFirst={true} />
                ))}
            </div>
            <div className="mt-10 grid gap-10 md:grid-cols-1 lg:gap-10 xl:grid-cols-1 justify-items-center">
                {postsOrdered.slice(1).map((post) => (
                    <PostPreview key={post.title} post={post} />
                ))}
            </div>
        </>
    );
}

// apparently french canadians are the only ones with a sensible dateformat: yyyy-MM-dd
const formatLocale = 'fr-CA';
const newDateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
};

function PostPreview(props: PropsWithChildren<{ post: PostDto; isFirst?: boolean }>) {
    const { post, isFirst } = props;
    const cardClass = isFirst ? 'max-w-[600px]' : 'max-w-[500px]';
    return (
        <Card className={`${cardClass} p-4 w-full`} shadow="md">
            <NextLink href={`/${post.slug}`} className="block flex flex-col">
                <CardHeader className="pb-0 pt-2 px-4 items-start">
                    <h4 className="font-bold text-large">{post.title}</h4>
                </CardHeader>
                <CardBody className="items-center">{/* <PostPreviewImage src={post.imgSrc} /> */}</CardBody>
                <CardFooter className="items-start">
                    <small className="text-default-500">{post.publishedAt.toLocaleString(formatLocale, newDateOptions)}</small>
                </CardFooter>
            </NextLink>
        </Card>
    );
}

const PostPreviewImage = (props: { src?: string }) => {
    const { src } = props;
    if (!src) return null;
    return (
        <Image src={src} alt="thumbnail" fallbackSrc={'./images/image_icon.svg'} className="object-cover rounded-xl max-h-[200px] w-full" />
    );
};
