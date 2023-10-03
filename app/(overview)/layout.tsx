import { HomeLayout } from '@/components/layout/HomeLayout';
import { PageFooter } from '@/components/layout/PageFooter';
import { Navbar } from '@/components/navbar';
import { PropsWithChildren } from 'react';

const OverviewLayout = ({ children }: PropsWithChildren) => {
    return <HomeLayout footerChildren={<Navbar center={<PageFooter />} />}>{children}</HomeLayout>;
};

export default OverviewLayout;
