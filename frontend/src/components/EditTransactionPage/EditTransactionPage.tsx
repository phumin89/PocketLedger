import { Link, useNavigate, useParams } from 'react-router-dom';
import { buildTransactionEditorData } from '../../content/transaction-mock';
import type { TransactionTypeOption } from '../../content/TransactionTypeOption.ts';
import { useTransactionEditor } from '../../hooks/useTransactionEditor';
import { useTransactionsStore } from '../../hooks/useTransactionsStore';
import styles from './EditTransactionPage.module.scss';

export function EditTransactionPage() {
    const navigate = useNavigate();
    const { transactionId } = useParams();
    const { getTransactionById, updateTransaction, deleteTransaction } = useTransactionsStore();
    const transaction = transactionId !== undefined ? getTransactionById(transactionId) : undefined;
    const editorData = transaction
        ? buildTransactionEditorData(transaction)
        : {
              pageTitle: 'Edit transaction',
              description: '',
              transaction: {
                  id: 'missing',
                  title: '',
                  amount: '0',
                  type: 'EXPENSE' as const,
                  category: '',
                  occurredAt: '',
                  account: '',
                  reference: '',
                  note: '',
                  status: '',
              },
              categories: [],
              accounts: [],
              meta: {
                  createdAt: '',
                  updatedAt: '',
                  source: '',
              },
          };
    const { draft, notice, isDirty, updateField, reset, save } = useTransactionEditor(
        editorData.transaction
    );

    if (!transaction) {
        return (
            <section className={styles.page}>
                <header className={styles.header}>
                    <div>
                        <Link className={styles.backLink} to="/transactions">
                            Back to transactions
                        </Link>
                        <h1 className={styles.title}>Transaction not found</h1>
                        <p className={styles.subtitle}>
                            The selected record does not exist in the current mock store.
                        </p>
                    </div>
                </header>
            </section>
        );
    }

    function handleSave() {
        updateTransaction(draft.id, draft);
        save();
    }

    function handleDelete() {
        deleteTransaction(draft.id);
        navigate('/transactions');
    }

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div>
                    <Link className={styles.backLink} to="/transactions">
                        Back to transactions
                    </Link>
                    <h1 className={styles.title}>{editorData.pageTitle}</h1>
                    <p className={styles.subtitle}>{editorData.description}</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.ghostButton} onClick={reset} type="button">
                        Reset
                    </button>
                    <button
                        className={styles.primaryButton}
                        disabled={!isDirty}
                        onClick={handleSave}
                        type="button"
                    >
                        Save changes
                    </button>
                </div>
            </header>

            {notice ? <p className={styles.notice}>{notice}</p> : null}

            <section className={styles.grid}>
                <form className={styles.formCard}>
                    <div className={styles.formGrid}>
                        <label className={styles.field}>
                            <span>Title</span>
                            <input
                                type="text"
                                value={draft.title}
                                onChange={(event) => updateField('title', event.target.value)}
                            />
                        </label>

                        <label className={styles.field}>
                            <span>Amount</span>
                            <input
                                type="number"
                                inputMode="decimal"
                                value={draft.amount}
                                onChange={(event) => updateField('amount', event.target.value)}
                            />
                        </label>

                        <label className={styles.field}>
                            <span>Type</span>
                            <select
                                value={draft.type}
                                onChange={(event) =>
                                    updateField('type', event.target.value as TransactionTypeOption)
                                }
                            >
                                <option value="INCOME">Income</option>
                                <option value="EXPENSE">Expense</option>
                            </select>
                        </label>

                        <label className={styles.field}>
                            <span>Category</span>
                            <select
                                value={draft.category}
                                onChange={(event) => updateField('category', event.target.value)}
                            >
                                {editorData.categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className={styles.field}>
                            <span>Date</span>
                            <input
                                type="date"
                                value={draft.occurredAt}
                                onChange={(event) => updateField('occurredAt', event.target.value)}
                            />
                        </label>

                        <label className={styles.field}>
                            <span>Account</span>
                            <select
                                value={draft.account}
                                onChange={(event) => updateField('account', event.target.value)}
                            >
                                {editorData.accounts.map((account) => (
                                    <option key={account} value={account}>
                                        {account}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className={styles.field}>
                            <span>Reference</span>
                            <input
                                type="text"
                                value={draft.reference}
                                onChange={(event) => updateField('reference', event.target.value)}
                            />
                        </label>

                        <label className={styles.field}>
                            <span>Status</span>
                            <input
                                type="text"
                                value={draft.status}
                                onChange={(event) => updateField('status', event.target.value)}
                            />
                        </label>

                        <label className={styles.fieldFull}>
                            <span>Note</span>
                            <textarea
                                rows={6}
                                value={draft.note}
                                onChange={(event) => updateField('note', event.target.value)}
                            />
                        </label>
                    </div>
                </form>

                <aside className={styles.sideColumn}>
                    <article className={styles.sideCard}>
                        <p className={styles.sideKicker}>Transaction ID</p>
                        <h2 className={styles.sideTitle}>{draft.id}</h2>
                        <dl className={styles.metaList}>
                            <div>
                                <dt>Created</dt>
                                <dd>{editorData.meta.createdAt}</dd>
                            </div>
                            <div>
                                <dt>Updated</dt>
                                <dd>{editorData.meta.updatedAt}</dd>
                            </div>
                            <div>
                                <dt>Source</dt>
                                <dd>{editorData.meta.source}</dd>
                            </div>
                        </dl>
                    </article>

                    <article className={styles.sideCard}>
                        <p className={styles.sideKicker}>Quick summary</p>
                        <div className={styles.summaryValue}>
                            {Number(draft.amount || 0).toLocaleString()}
                        </div>
                        <p className={styles.summaryMeta}>
                            {draft.type === 'INCOME' ? 'Income' : 'Expense'} · {draft.category}
                        </p>
                        <p className={styles.summaryMeta}>{draft.account}</p>
                    </article>

                    <article className={styles.sideCard}>
                        <p className={styles.sideKicker}>Danger zone</p>
                        <p className={styles.sideText}>
                            Keep delete separate from save so the real command flow stays explicit.
                        </p>
                        <button
                            className={styles.deleteButton}
                            onClick={handleDelete}
                            type="button"
                        >
                            Delete transaction
                        </button>
                    </article>
                </aside>
            </section>
        </section>
    );
}
