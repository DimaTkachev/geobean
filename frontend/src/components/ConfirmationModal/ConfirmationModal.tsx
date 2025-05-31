import React from 'react';

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
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#ffe2d0', // Light brown background
          padding: '32px', // Increased padding
          borderRadius: '12px', // Rounded corners
          textAlign: 'center',
          position: 'relative', // Needed for absolute positioning of close button
          minWidth: '300px', // Ensure minimum width
          boxShadow: '0 8px 32px rgba(60,31,12,0.15)', // Add shadow
        }}
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#3c1f0c', // Dark brown color
          }}
          aria-label="Закрыть"
        >
          ×
        </button>

        <h2 style={{ fontWeight: 600, fontSize: 22, marginBottom: 16, color: '#3c1f0c' }}>Подтвердите действие</h2>

        <p style={{ marginBottom: '24px', color: '#3c1f0c' }}>{message}</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          {/* Cancel button - styled as "Оставить" */}
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: '1px solid #a67c3a', // Light brown border
              color: '#3c1f0c', // Dark brown text
              padding: '10px 24px',
              borderRadius: 4,
              fontWeight: 500,
              cursor: 'pointer',
              minWidth: 100,
            }}
          >
            Оставить
          </button>

          {/* Confirm button - styled as "Удалить" */}
          <button
            onClick={onConfirm}
            style={{
              background: '#5a3a2a', // Dark brown background
              color: 'white',
              border: 'none',
              padding: '10px 24px',
              borderRadius: 4,
              fontWeight: 600,
              minWidth: 100,
              cursor: 'pointer',
            }}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}; 