import React, { useEffect, useState } from 'react';
import { useShop } from '@contexts/index';
import { Shop } from '@contexts/ShopContext';
import styles from '@styles/CoffeeLotCard.module.css';
import { ShopModal } from '@components/CoffeeMap/ShopModal';

const accent = '#8b6a4a';
const purple = '#6c4a8b';
const blue = '#4a6a8b';

const GuestAccess: React.FC = () => {
    const { shops, currentShop, setCurrentShop, refreshShops } = useShop();
    const [qrData, setQrData] = useState<{
        shareUrl: string;
        qrCode: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
        const saved = localStorage.getItem('guestAccessSidebarExpanded');
        return saved ? JSON.parse(saved) : true;
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [modalShop, setModalShop] = useState<Shop | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const maxShops = 3;

    useEffect(() => {
        if (currentShop && currentShop.qrBase64 && currentShop.shareUrl) {
            setQrData({
                shareUrl: currentShop.shareUrl,
                qrCode: currentShop.qrBase64,
            });
        } else {
            setQrData(null);
        }
    }, [currentShop]);

    const handleGenerateQr = async () => {
        if (!currentShop) return;
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(
                `/api/shops/${currentShop.shopID}/generate-qr`,
                {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (!res.ok) throw new Error('Ошибка генерации QR-кода');
            const data = await res.json();
            setQrData(data);
            await refreshShops();
        } catch (e: unknown) {
            const error = e as Error;
            setError(error.message || 'Ошибка');
        } finally {
            setLoading(false);
        }
    };

    const handleSidebarToggle = () => {
        const newExpanded = !isSidebarExpanded;
        setIsSidebarExpanded(newExpanded);
        localStorage.setItem(
            'guestAccessSidebarExpanded',
            JSON.stringify(newExpanded)
        );
    };

    const handleAddShop = () => {
        setModalMode('add');
        setModalShop(null);
        setModalOpen(true);
    };

    const handleEditShop = (shop: Shop) => {
        setModalMode('edit');
        setModalShop(shop);
        setModalOpen(true);
    };

    const handleModalApply = async (
        name: string,
        theme: 'beige' | 'purple' | 'blue'
    ) => {
        setModalLoading(true);
        const token = localStorage.getItem('authToken');
        try {
            if (modalMode === 'add') {
                await fetch('/api/shops', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name, theme }),
                });
            } else if (modalMode === 'edit' && modalShop) {
                await fetch(`/api/shops/${modalShop.shopID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name, theme }),
                });
            }
            await refreshShops();
            setModalOpen(false);
        } catch (e) {
            alert('Ошибка при сохранении кофейни');
        } finally {
            setModalLoading(false);
        }
    };

    const handleModalDelete = async () => {
        if (!modalShop) return;
        setModalLoading(true);
        const token = localStorage.getItem('authToken');
        try {
            await fetch(`/api/shops/${modalShop.shopID}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            await refreshShops();
            setModalOpen(false);
        } catch (e) {
            alert('Ошибка при удалении кофейни');
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div
            style={{ display: 'flex', height: '100vh', background: '#f5e0d1' }}
        >
            <aside
                className={styles.sidebar}
                style={{
                    width: isSidebarExpanded ? 300 : 60,
                    transition: 'width 0.2s',
                    overflowY: 'auto',
                    maxHeight: '100vh',
                    overflowX: 'hidden',
                    padding: isSidebarExpanded ? '20px 16px' : '20px 8px',
                }}
            >
                <button
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        marginBottom: 16,
                        marginLeft: 4,
                    }}
                    onClick={handleSidebarToggle}
                    aria-label={isSidebarExpanded ? 'Свернуть' : 'Развернуть'}
                >
                    <span style={{ fontSize: 24, color: accent }}>
                        {isSidebarExpanded ? '←' : '→'}
                    </span>
                </button>
                <div style={{ marginBottom: 24 }}>
                    {shops.map((shop) => (
                        <div
                            key={shop.shopID}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: isSidebarExpanded ? 12 : 0,
                                marginBottom: 8,
                                cursor: 'pointer',
                                background:
                                    currentShop?.shopID === shop.shopID
                                        ? 'rgba(139, 106, 74, 0.2)'
                                        : 'transparent',
                                borderRadius: 8,
                                padding: 4,
                                position: 'relative',
                            }}
                            onClick={() => setCurrentShop(shop)}
                        >
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    background:
                                        shop.theme === 'beige'
                                            ? accent
                                            : shop.theme === 'purple'
                                              ? purple
                                              : blue,
                                    backgroundImage: shop.image
                                        ? `url(${shop.image})`
                                        : undefined,
                                    backgroundSize: 'cover',
                                    border:
                                        currentShop?.shopID === shop.shopID
                                            ? '2px solid #8b6a4a'
                                            : '2px solid #ccc',
                                }}
                            />
                            {isSidebarExpanded && (
                                <span
                                    style={{
                                        color: '#3c1f0c',
                                        fontWeight: 500,
                                    }}
                                >
                                    {shop.name}
                                </span>
                            )}
                            {isSidebarExpanded && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditShop(shop);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        marginLeft: 'auto',
                                        color: accent,
                                        cursor: 'pointer',
                                        fontSize: 14,
                                    }}
                                    title='Редактировать'
                                >
                                    Ред.
                                </button>
                            )}
                        </div>
                    ))}
                    {shops.length < maxShops && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: isSidebarExpanded ? 12 : 0,
                                marginTop: 8,
                            }}
                        >
                            <button
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    background: 'rgba(139, 106, 74, 0.3)',
                                    color: accent,
                                    fontSize: 24,
                                    border: '2px dashed #8b6a4a',
                                    cursor: 'pointer',
                                }}
                                title={'Добавить кофейню'}
                                onClick={handleAddShop}
                            >
                                +
                            </button>
                            {isSidebarExpanded && (
                                <span style={{ color: '#3c1f0c' }}>
                                    Добавить ещё
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <ShopModal
                    open={modalOpen}
                    mode={modalMode}
                    initialName={modalShop?.name}
                    initialTheme={modalShop?.theme}
                    onApply={handleModalApply}
                    onDelete={
                        modalMode === 'edit' ? handleModalDelete : undefined
                    }
                    onClose={() => setModalOpen(false)}
                    isApplyDisabled={modalLoading}
                    isDeleteDisabled={shops.length <= 1}
                />
            </aside>
            <main
                style={{
                    flex: 1,
                    padding: '48px 0 0 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: '#f5e0d1',
                }}
            >
                <h1
                    style={{
                        fontSize: 38,
                        fontWeight: 700,
                        marginBottom: 18,
                        color: '#3c1f0c',
                        textAlign: 'center',
                    }}
                >
                    Гостевой доступ
                </h1>
                <p
                    style={{
                        marginBottom: 32,
                        maxWidth: 440,
                        textAlign: 'center',
                        color: '#3c1f0c',
                        fontSize: 18,
                    }}
                >
                    Упростите выбор для гостей. QR-код откроет карту с тем, что
                    сейчас есть в наличии – удобно и наглядно.
                </p>
                {error && (
                    <div style={{ color: 'red', marginBottom: 16 }}>
                        {error}
                    </div>
                )}
                {qrData ? (
                    <>
                        <img
                            src={qrData.qrCode}
                            alt='QR code'
                            style={{
                                width: 220,
                                height: 220,
                                marginBottom: 18,
                                borderRadius: 8,
                                boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                            }}
                        />
                        <div
                            style={{
                                marginBottom: 18,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <input
                                type='text'
                                value={qrData.shareUrl}
                                readOnly
                                style={{
                                    width: 340,
                                    padding: 10,
                                    fontSize: 17,
                                    borderRadius: 6,
                                    border: '1px solid #d4a88c',
                                    background: '#fff',
                                    color: '#3c1f0c',
                                }}
                            />
                            <button
                                onClick={() =>
                                    navigator.clipboard.writeText(
                                        qrData.shareUrl
                                    )
                                }
                                style={{
                                    background: accent,
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 6,
                                    padding: '8px 12px',
                                    fontSize: 18,
                                    cursor: 'pointer',
                                }}
                            >
                                📋
                            </button>
                        </div>
                        <button
                            onClick={handleGenerateQr}
                            disabled={loading}
                            style={{
                                background: accent,
                                color: '#fff',
                                padding: '14px 38px',
                                fontSize: 18,
                                border: 'none',
                                borderRadius: 6,
                                fontWeight: 600,
                            }}
                        >
                            {loading
                                ? 'Генерируется...'
                                : 'Сгенерировать новый QR-код'}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleGenerateQr}
                        disabled={loading || !currentShop}
                        style={{
                            background: accent,
                            color: '#fff',
                            padding: '14px 38px',
                            fontSize: 18,
                            border: 'none',
                            borderRadius: 6,
                            fontWeight: 600,
                        }}
                    >
                        {loading ? 'Генерируется...' : 'Сгенерировать QR-код'}
                    </button>
                )}
            </main>
        </div>
    );
};

export default GuestAccess;
