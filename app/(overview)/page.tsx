import { getPosts } from '@/lib/posts';
import { PostDto } from '@/types';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import NextLink from 'next/link';
import { PropsWithChildren } from 'react';
import { HiOutlinePhoto } from 'react-icons/hi2';
import { HomeLayout } from '../components/layout/HomeLayout';

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
            <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-2 justify-items-center">
                {postsOrdered.slice(1).map((post) => (
                    <PostPreview key={post.title} post={post} />
                ))}
            </div>
        </>
    );
}

function PostPreview(props: PropsWithChildren<{ post: PostDto; isFirst?: boolean }>) {
    const { post, isFirst } = props;
    return (
        <Card className={`p-4 max-h-[400px] max-w-[400px] w-full`} shadow="md">
            <NextLink href={`/${post.slug}`} className="block">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <h4 className="font-bold text-large">{post.title}</h4>
                    <small className="text-default-500">{post.publishedAt.toString()}</small>
                </CardHeader>
                <CardBody className="items-center h-full">
                    {/* <PostPreviewImage src={undefined} /> */}
                    <PostPreviewImage src={post.imgSrc} />
                </CardBody>
            </NextLink>
        </Card>
    );
}

const PostPreviewImage = (props: { src?: string }) => {
    const { src } = props;
    if (!src) return <HiOutlinePhoto size={200} />;
    return <Image src={src} alt="thumbnail" className="object-cover rounded-xl max-h-[200px] w-full" />;
};
