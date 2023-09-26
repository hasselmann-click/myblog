import { NavbarContent, Navbar as NextUINavbar } from '@nextui-org/navbar';

import { ThemeSwitch } from '@/app/components/theme-switch';
import { PropsWithChildren, ReactNode } from 'react';

export const Navbar = (props: { start?: ReactNode; center?: ReactNode; end?: ReactNode }) => {
    const { start, center, end } = props;
    return (
        <NextUINavbar maxWidth="xl" position="sticky">
            <NavbarContent justify="start">{start}</NavbarContent>
            <NavbarContent justify="center">{center}</NavbarContent>
            <NavbarContent justify="end">
                {end}
                <ThemeSwitch />
            </NavbarContent>
        </NextUINavbar>
    );
};
