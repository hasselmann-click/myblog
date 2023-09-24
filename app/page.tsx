import { getPosts } from '@/lib/posts';
import { PostDto } from '@/types';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import { Link } from '@nextui-org/link';
import NextLink from 'next/link';
import { PropsWithChildren } from 'react';
import { HiOutlinePhotograph } from 'react-icons/hi';

export default async function Home() {
    const posts = await getPosts();
    return (
        <>
            <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-2 ">
                {posts.map((post) => (
                    <PostPreview key={post.title} post={post} />
                ))}
            </div>
            <div className="mt-10 flex justify-center">
                <Link
                    href="/archive"
                    className="relative inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 pl-4 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:pointer-events-none disabled:opacity-40 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300"
                >
                    <span>View all Posts</span>
                </Link>
            </div>
        </>
    );
}

function PostPreview(props: PropsWithChildren<{ post: PostDto }>) {
    const { post } = props;
    return (
        <Card className="py-4">
            <NextLink href={`/${post.slug}`} className="block">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <h4 className="font-bold text-large">{post.title}</h4>
                    <small className="text-default-500">{post.publishedAt?.toLocaleDateString()}</small>
                </CardHeader>
                <CardBody className="overflow-visible py-2 justify-center h-full">
                    <HiOutlinePhotograph size={'auto'} />
                    <Image src={''} alt="Card background" className="object-cover rounded-xl" width={270} />
                </CardBody>
            </NextLink>
        </Card>
    );
}
