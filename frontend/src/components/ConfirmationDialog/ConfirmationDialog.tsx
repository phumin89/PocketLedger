import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './ConfirmationDialog.module.scss';
import type { ConfirmationDialogProps } from './ConfirmationDialogProps';

const closeDurationMilliseconds = 180;

export function ConfirmationDialog({
    confirmLabel,
    description,
    isBusy = false,
    isOpen,
    onCancel,
    onConfirm,
    title,
}: ConfirmationDialogProps) {
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isRendered, setIsRendered] = useState(isOpen);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            setIsClosing(false);
            return;
        }

        if (!isRendered) {
            return;
        }

        setIsClosing(true);
        closeTimeoutRef.current = setTimeout(() => {
            setIsRendered(false);
            setIsClosing(false);
        }, closeDurationMilliseconds);
    }, [isOpen, isRendered]);

    useEffect(() => {
        if (!isRendered || isClosing) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent): void {
            if (event.key === 'Escape' && !isBusy) {
                onCancel();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isBusy, isClosing, isRendered, onCancel]);

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    if (!isRendered) {
        return null;
    }

    return createPortal(
        <section className={styles.overlay} role="presentation">
            <div className={isClosing ? styles.backdropClosing : styles.backdrop} />
            <section
                aria-modal="true"
                className={isClosing ? styles.dialogClosing : styles.dialog}
                role="alertdialog"
            >
                <div className={styles.content}>
                    <h2 className={styles.title}>{title}</h2>
                    {description ? <p className={styles.description}>{description}</p> : null}
                </div>

                <div className={styles.actions}>
                    <button
                        className={styles.cancelButton}
                        disabled={isBusy}
                        onClick={onCancel}
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        className={styles.confirmButton}
                        disabled={isBusy}
                        onClick={onConfirm}
                        type="button"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </section>
        </section>,
        document.body
    );
}
