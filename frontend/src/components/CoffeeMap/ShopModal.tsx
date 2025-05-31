import React, { useState, useEffect } from 'react';

const themes = [
  { value: 'beige', color: '#8b6a4a' },
  { value: 'purple', color: '#6c4a8b' },
  { value: 'blue', color: '#4a6a8b' },
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
}) => {
  const [name, setName] = useState(initialName);
  const [theme, setTheme] = useState<'beige' | 'purple' | 'blue'>(initialTheme);

  useEffect(() => {
    setName(initialName);
    setTheme(initialTheme);
  }, [initialName, initialTheme, open]);

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.4)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#ffe2d0',
        borderRadius: 12,
        minWidth: 340,
        minHeight: 340,
        padding: 32,
        position: 'relative',
        boxShadow: '0 8px 32px rgba(60,31,12,0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#3c1f0c' }}
          aria-label="Закрыть"
        >
          ×
        </button>
        <h2 style={{ fontWeight: 600, fontSize: 22, marginBottom: 16, color: '#3c1f0c' }}>{mode === 'add' ? 'Добавить' : 'Изменить'}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: themes.find(t => t.value === theme)?.color,
              marginBottom: 12,
            }}
          />
          <div style={{ color: '#3c1f0c', fontWeight: 500, marginBottom: 8 }}>Имя</div>
          <input
            type="text"
            placeholder="Название"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: 200,
              textAlign: 'center',
              marginBottom: 16,
              background: 'none',
              border: '1px solid #d4a88c',
              borderRadius: 0,
              padding: '8px 12px',
              fontSize: 16,
              color: '#3c1f0c',
            }}
            required
          />
          <div style={{ color: '#3c1f0c', fontWeight: 500, marginBottom: 8 }}>Тема</div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            {themes.map(t => (
              <button
                key={t.value}
                type="button"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: t.color,
                  border: theme === t.value ? '3px solid #333' : '2px solid #ccc',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => setTheme(t.value as 'beige' | 'purple' | 'blue')}
                aria-label={t.value}
              />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'center' }}>
          {mode === 'edit' && (
            <button
              onClick={onDelete}
              style={{
                background: 'none',
                border: '1px solid #a67c3a',
                color: '#3c1f0c',
                padding: '10px 24px',
                borderRadius: 4,
                fontWeight: 500,
                cursor: 'pointer',
                minWidth: 100,
              }}
            >
              Удалить
            </button>
          )}
          <button
            onClick={() => onApply(name, theme)}
            disabled={isApplyDisabled || !name}
            style={{
              background: '#c19653',
              color: 'white',
              border: 'none',
              padding: '10px 24px',
              borderRadius: 4,
              fontWeight: 600,
              minWidth: 100,
              opacity: isApplyDisabled || !name ? 0.6 : 1,
              cursor: isApplyDisabled || !name ? 'not-allowed' : 'pointer',
            }}
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );
}; 