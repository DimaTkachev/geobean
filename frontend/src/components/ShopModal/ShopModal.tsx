import React, { useState, useEffect } from 'react';
import { ConfirmationModal } from '@components/ConfirmationModal';
import styles from './ShopModal.module.css';
import { XIcon } from '@phosphor-icons/react';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

const themes = [
    { value: 'beige', color: 'var(--brown-60)' },
    { value: 'purple', color: 'var(--purple-60)' },
    { value: 'blue', color: 'var(--blue-60)' },
];

interface ShopModalProps {
    open: boolean;
    mode: 'add' | 'edit';
    initialName?: string;
    initialTheme?: 'beige' | 'purple' | 'blue';
    onApply: (name: string, theme: 'beige' | 'purple' | 'blue') => void;
    onDelete?: () => void;
    onClose: () => void;
    isApplyDisabled?: boolean;
    isDeleteDisabled?: boolean;
}

export const ShopModal: React.FC<ShopModalProps> = ({
    open,
    mode,
    initialName = '',
    initialTheme = 'beige',
    onApply,
    onDelete,
    onClose,
    isApplyDisabled,
    isDeleteDisabled,
}) => {
    const [name, setName] = useState(initialName);
    const [theme, setTheme] = useState<'beige' | 'purple' | 'blue'>(
        initialTheme
    );
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    useEffect(() => {
        setName(initialName);
        setTheme(initialTheme);
    }, [initialName, initialTheme, open]);

    if (!open) return null;

    const handleDeleteClick = () => {
        setShowConfirmationModal(true);
    };

    const handleConfirmDelete = () => {
        onDelete?.();
        setShowConfirmationModal(false);
        onClose();
    };

    const handleCancelDelete = () => {
        setShowConfirmationModal(false);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button
                    onClick={onClose}
                    className={styles.closeButton}
                    aria-label='Закрыть'
                >
                    <XIcon size={20} weight='bold' color='var(--brown-100)' />
                </button>
                <h2 className={styles.title}>
                    {mode === 'add'
                        ? 'Добавить кофейню'
                        : 'Редактировать кофейню'}
                </h2>
                <div className={styles.formSection}>
                    <div
                        className={styles.themePreview}
                        style={{
                            background: themes.find((t) => t.value === theme)
                                ?.color,
                        }}
                    />
                    <label className={styles.label}>Название</label>
                    <Input
                        type='text'
                        placeholder='Введите название'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.nameInput}
                        required
                    />
                    <div className={styles.label}>Тема</div>
                    <div className={styles.themeButtons}>
                        {themes.map((t) => (
                            <button
                                key={t.value}
                                type='button'
                                className={`${styles.themeButton} ${
                                    theme === t.value
                                        ? styles.themeButtonSelected
                                        : ''
                                }`}
                                style={{ background: t.color }}
                                onClick={() =>
                                    setTheme(
                                        t.value as 'beige' | 'purple' | 'blue'
                                    )
                                }
                                aria-label={t.value}
                            />
                        ))}
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    {mode === 'edit' && (
                        <Button
                            onClick={handleDeleteClick}
                            disabled={isDeleteDisabled}
                            type='outline'
                        >
                            Удалить
                        </Button>
                    )}
                    <Button
                        onClick={() => onApply(name, theme)}
                        disabled={isApplyDisabled || !name}
                    >
                        Применить
                    </Button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showConfirmationModal}
                message='Вы уверены, что хотите удалить данный магазин?'
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};
