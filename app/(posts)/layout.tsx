import { BackButton } from '@/components/layout/BackButton';
import { HomeLayout } from '@/components/layout/HomeLayout';
import { PageFooter } from '@/components/layout/PageFooter';
import { Navbar } from '@/components/navbar';
import { PropsWithChildren } from 'react';

const PostLayout = ({ children }: PropsWithChildren) => {
    return <HomeLayout footerChildren={<Navbar center={<PageFooter />} start={<BackButton />} />}>{children}</HomeLayout>;
};
export default PostLayout;
