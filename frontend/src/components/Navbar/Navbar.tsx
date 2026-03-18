import { NavLink } from 'react-router-dom';
import type { NavItem } from '../../content/home.types';
import styles from './Navbar.module.scss';

type NavbarProps = {
    items: NavItem[];
};

export function Navbar({ items }: NavbarProps) {
    return (
        <header className={styles.navbar}>
            <div className={styles.inner}>
                <NavLink className={styles.brand} to="/">
                    <span className={styles.brandMark}>PL</span>
                    <span className={styles.brandText}>
                        <strong>PocketLedger</strong>
                        <small>Finance dashboard</small>
                    </span>
                </NavLink>

                <nav className={styles.links} aria-label="Primary">
                    {items.map((item) => (
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? styles.linkActive : styles.link
                            }
                            end={item.end}
                            to={item.to}
                            key={item.label}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}
