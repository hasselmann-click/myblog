import { Link } from '@nextui-org/link';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import { HiOutlinePhotograph } from 'react-icons/hi';

type PostDto = {
    id: string;
    title: string;
    slug: string;
    publishedAt?: Date;
};
export default function Home() {
    const posts: PostDto[] = [
        { id: '1', title: 'test1', slug: 'test1', publishedAt: new Date() },
        { id: '2', title: 'test2', slug: 'test2', publishedAt: new Date() },
        { id: '3', title: 'test3', slug: 'test3', publishedAt: new Date() },
    ];
    return (
        <Container>
            <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-2 ">
                {posts.map((post) => (
                    <PostPreview key={post.id} post={post} />
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
        </Container>
    );
}

function Container(props: PropsWithChildren<{ large?: boolean; alt?: boolean; className?: string }>) {
    return (
        <div
            className={clsx(
                'container px-8 mx-auto xl:px-5',
                props.large ? ' max-w-screen-xl' : ' max-w-screen-lg',
                !props.alt && 'py-5 lg:py-8',
                props.className,
            )}
        >
            {props.children}
        </div>
    );
}

function PostPreview(props: PropsWithChildren<{ post: PostDto }>) {
    const { post } = props;
    return (
        <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">{post.title}</h4>
                <small className="text-default-500">{post.publishedAt?.toLocaleDateString()}</small>
            </CardHeader>
            <CardBody className="overflow-visible py-2 justify-center h-full">
                <HiOutlinePhotograph size={'auto'} />
                <Image src={''} alt="Card background" className="object-cover rounded-xl" width={270} />
            </CardBody>
        </Card>
    );
}
