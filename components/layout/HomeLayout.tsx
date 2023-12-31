import { PageTitle } from '@/components/layout/PageTitle';
import { Navbar } from '@/components/navbar';
import { PropsWithChildren, ReactNode } from 'react';

export const HomeLayout = ({ children, footerChildren }: PropsWithChildren<{ footerChildren: ReactNode }>) => (
    <>
        <Navbar start={<PageTitle />} />
        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">{children}</main>
        <footer className="w-full flex items-center justify-center py-3">{footerChildren}</footer>
    </>
);
