import { BackButton } from '@/app/components/layout/BackButton';
import { HomeLayout } from '@/app/components/layout/HomeLayout';
import { PageFooter } from '@/app/components/layout/PageFooter';
import { PageTitle } from '@/app/components/layout/PageTitle';
import { Navbar } from '@/app/components/navbar';
import { PropsWithChildren } from 'react';

const PostLayout = ({ children }: PropsWithChildren) => {
    return <HomeLayout footerChildren={<Navbar center={<PageFooter />} start={<BackButton />} />}>{children}</HomeLayout>;
};
export default PostLayout;
