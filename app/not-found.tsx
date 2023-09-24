import { Card, CardFooter, CardHeader } from '@nextui-org/card';
import { Link } from '@nextui-org/link';

export default function FourOhFour() {
    return (
        <Card>
            <CardHeader className="justify-center">
                <h1 className="lg:text-7xl text-4xl">404</h1>
                <div className="border-l-2 h-8 mx-7 my-auto" /> {/* Making my own divider... */}
                <h2>The page you’re looking for doesn’t exist.</h2>
            </CardHeader>
            <CardFooter className="justify-center">
                <Link href="/">Go Home</Link>
            </CardFooter>
        </Card>
    );
}
