import { BackButton } from '@/app/components/layout/BackButton';
import { PageFooter } from '@/app/components/layout/PageFooter';
import { PageTitle } from '@/app/components/layout/PageTitle';
import { Navbar } from '@/app/components/navbar';
import { PropsWithChildren } from 'react';

const PostLayout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <Navbar start={<PageTitle />} />
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">{children}</main>
            <footer className="w-full flex items-center justify-center py-3">
                <Navbar center={<PageFooter />} start={<BackButton />} />
            </footer>
        </>
    );
};
export default PostLayout;
