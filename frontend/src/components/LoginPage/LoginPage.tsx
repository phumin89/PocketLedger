import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import type { ILoginPageProps } from './Contracts/ILoginPageProps';
import styles from './LoginPage.module.scss';

export function LoginPage({ onLoginSuccess }: ILoginPageProps) {
    const navigate = useNavigate();
    const { error, isSubmitting, login } = useLogin();
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const loginResponse = await login({
            password,
            username,
        });

        if (!loginResponse) {
            return;
        }

        await onLoginSuccess();
        navigate('/');
    }

    return (
        <section className={styles.page}>
            <article className={styles.card}>
                <h1 className={styles.title}>Welcome back</h1>
                <p className={styles.description}>
                    Pocket ledger helps you plan your finances with more clarity.
                </p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.field}>
                        <span className={styles.label}>Username</span>
                        <input
                            autoComplete="username"
                            className={styles.input}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="Enter your username"
                            required
                            type="text"
                            value={username}
                        />
                    </label>

                    <label className={styles.field}>
                        <span className={styles.label}>Password</span>
                        <input
                            autoComplete="current-password"
                            className={styles.input}
                            minLength={8}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            required
                            type="password"
                            value={password}
                        />
                    </label>

                    {error ? <p className={styles.error}>{error}</p> : null}

                    <button className={styles.submitButton} disabled={isSubmitting} type="submit">
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </article>
        </section>
    );
}
