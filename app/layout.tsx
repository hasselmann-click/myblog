import '@/styles/globals.css';
import 'highlight.js/styles/github.css';

import { fontSans } from '@/config/fonts';
import { Providers } from '@/app/providers';
import clsx from 'clsx';
import { Metadata } from 'next';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="alternate" type="application/rss+xml" href="/rss" title="RSS feed for hasselmann.click" />
            </head>
            <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
                <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
                    <div className="relative flex flex-col h-screen">{children}</div>
                </Providers>
            </body>
        </html>
    );
}
