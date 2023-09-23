import { Link } from "@nextui-org/link";
import { Providers } from "./providers";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body>
            <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
                <main>
                    {children}
                </main>
                <footer>
                   
                    <Link 
                        href="/tutorial"
                        title="NextUI Tutorialpage"
                        >
                    <span>Powered by</span>
                    <p>NextUI</p>
                        </Link>
                </footer>
                </Providers>
            </body>
            </html>
    );}
