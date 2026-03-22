import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './SidePanel.module.scss';
import type { SidePanelProps } from './SidePanelProps';

export function SidePanel({
    children,
    description,
    footer,
    kicker,
    onClose,
    title,
}: SidePanelProps) {
    const titleId = useId();
    const descriptionId = useId();
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isClosing, setIsClosing] = useState(false);

    const requestClose = useCallback((): void => {
        if (isClosing) {
            return;
        }

        setIsClosing(true);
        closeTimeoutRef.current = setTimeout(() => {
            onClose();
        }, 220);
    }, [isClosing, onClose]);
    const footerContent = typeof footer === 'function' ? footer(requestClose) : footer;

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        function handleKeyDown(event: KeyboardEvent): void {
            if (event.key === 'Escape') {
                requestClose();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [requestClose]);

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    return createPortal(
        <div className={styles.overlay}>
            <div
                aria-hidden="true"
                className={isClosing ? styles.backdropClosing : styles.backdrop}
            />

            <section
                aria-describedby={description ? descriptionId : undefined}
                aria-labelledby={titleId}
                aria-modal="true"
                className={isClosing ? styles.panelClosing : styles.panel}
                role="dialog"
            >
                <header className={styles.header}>
                    <div>
                        {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
                        <h2 className={styles.title} id={titleId}>
                            {title}
                        </h2>
                        {description ? (
                            <p className={styles.description} id={descriptionId}>
                                {description}
                            </p>
                        ) : null}
                    </div>

                    <button
                        aria-label="Close panel"
                        className={styles.closeButton}
                        onClick={requestClose}
                        type="button"
                    >
                        <svg
                            aria-hidden="true"
                            className={styles.closeIcon}
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M6 6L18 18M18 6L6 18"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeWidth="2"
                            />
                        </svg>
                    </button>
                </header>

                <div className={styles.body}>{children}</div>

                {footerContent ? <footer className={styles.footer}>{footerContent}</footer> : null}
            </section>
        </div>,
        document.body
    );
}
