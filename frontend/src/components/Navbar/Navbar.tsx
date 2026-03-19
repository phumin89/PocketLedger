import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.scss';
import type { NavbarProps } from './NavbarProps';

export function Navbar({ items }: NavbarProps) {
    return (
        <header className={styles.navbar}>
            <div className={styles.inner}>
                <NavLink className={styles.brand} to="/">
                    <img
                        alt=""
                        aria-hidden="true"
                        className={styles.brandMark}
                        src="/brand-mark.svg"
                    />
                    <span className={styles.brandText}>
                        <strong>Pocket ledger</strong>
                        <small>Personal money tracker</small>
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
