import type { NavItem } from './home.types';

export const navItems: NavItem[] = [
    {
        label: 'Overview',
        to: '/',
        end: true,
    },
    {
        label: 'Dashboard',
        to: '/dashboard',
    },
    {
        label: 'Transactions',
        to: '/transactions',
    },
    {
        label: 'Reports',
        to: '/reports',
    },
];
