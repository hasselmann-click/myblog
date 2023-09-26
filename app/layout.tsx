import '@/styles/globals.css';
import 'highlight.js/styles/github.css';

import { Navbar } from '@/app/components/navbar';
import { fontSans } from '@/app/config/fonts';
import { Link } from '@nextui-org/link';
import clsx from 'clsx';
import { Metadata } from 'next';
import { Providers } from '@/app/providers';
import { ThemeSwitch } from '@/app/components/theme-switch';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    // TODO optimize: metadata
    // title: {
    //     default: 'My Blog',
    //     template: `%s - ${siteConfig.name}`,
    // },
    // description: siteConfig.description,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
};

const PageTitle: () => JSX.Element = () => {
    return (
        <Link className="font-bold text-5xl" href="/" title="hasselmann.ch">
            <h1 className="text-default-500">hasselmann</h1>
        </Link>
    );
};

const PageFooter = () => {
    return (
        <Link className="gap-1 text-current" href="/tutorial" title="NextUI Tutorialpage">
            <span className="text-default-500">Powered by</span>
            <p className="text-primary">NextUI</p>
        </Link>
    );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
                <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
                    <div className="relative flex flex-col h-screen">
                        <Navbar start={<PageTitle />} />
                        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">{children}</main>
                        <footer className="w-full flex items-center justify-center py-3">
                            <Navbar center={<PageFooter />} />
                        </footer>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
