import { NavbarContent, NavbarItem, Navbar as NextUINavbar } from '@nextui-org/navbar';

import { ThemeSwitch } from '@/app/components/theme-switch';
import { Props } from '@nextui-org/navbar/dist/navbar-menu-toggle';
import { PropsWithChildren } from 'react';

export const Navbar = (props: PropsWithChildren) => {
    const { children } = props;
    return (
        <NextUINavbar maxWidth="xl" position="sticky">
            <NavbarContent justify="start"></NavbarContent>
            <NavbarContent data-justify="center">{children}</NavbarContent>
            <NavbarContent justify="end">
                <ThemeSwitch />
            </NavbarContent>
        </NextUINavbar>
    );
};
