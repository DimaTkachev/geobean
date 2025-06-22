import React from 'react';
import styles from './ConfirmationModal.module.css';

interface ConfirmationModalProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    message,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button
                    onClick={onCancel}
                    className={styles.closeButton}
                    aria-label='Закрыть'
                >
                    ×
                </button>

                <h2 className={styles.title}>Подтвердите действие</h2>

                <p className={styles.message}>{message}</p>

                <div className={styles.buttonContainer}>
                    <button onClick={onCancel} className={styles.cancelButton}>
                        Оставить
                    </button>

                    <button
                        onClick={onConfirm}
                        className={styles.confirmButton}
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    );
};
