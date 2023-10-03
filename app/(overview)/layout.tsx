import { HomeLayout } from '@/app/components/layout/HomeLayout';
import { PageFooter } from '@/app/components/layout/PageFooter';
import { Navbar } from '@/app/components/navbar';
import { PropsWithChildren } from 'react';

const OverviewLayout = ({ children }: PropsWithChildren) => {
    return <HomeLayout footerChildren={<Navbar center={<PageFooter />} />}>{children}</HomeLayout>;
};

export default OverviewLayout;
