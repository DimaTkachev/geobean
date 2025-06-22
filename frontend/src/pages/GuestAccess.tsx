import React, { useEffect, useState } from 'react';
import { useShop } from '@contexts/index';
import { ShopContainer } from '@components/ShopContainer';
import styles from './GuestAccess.module.css';
import { Button } from '@/components/Button';
import { CopyIcon, DownloadSimpleIcon } from '@phosphor-icons/react';
import { Input } from '@/components/Input';
import { debouncedFetch } from '@/utils/api';

const GuestAccess: React.FC = () => {
    const { currentShop, refreshShops } = useShop();
    const [qrData, setQrData] = useState<{
        shareUrl: string;
        qrCode: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (currentShop && currentShop.qrBase64 && currentShop.shareUrl) {
            // Build the full guest URL from the shareUrl token
            const guestUrl = `${window.location.origin}/guest-inventory/${currentShop.shareUrl}`;
            setQrData({
                shareUrl: guestUrl,
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
            const res = await debouncedFetch(
                `/api/shops/${currentShop.shopID}/generate-qr`,
                {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (!res.ok) throw new Error('Ошибка генерации QR-кода');
            const data = await res.json();

            // API returns qrBase64 and guestUrl, use the full guestUrl for display
            setQrData({
                shareUrl: data.guestUrl,
                qrCode: data.qrBase64,
            });

            // Refresh shops to update the current shop with new QR data
            await refreshShops();
        } catch (e: unknown) {
            const error = e as Error;
            setError(error.message || 'Ошибка');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadQr = () => {
        if (!qrData || !currentShop) return;

        const link = document.createElement('a');
        link.href = qrData.qrCode;
        link.download = `qr-${currentShop.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={styles.guestAccessContainer}>
            <ShopContainer />
            <main className={styles.mainContent}>
                <h1 className={styles.title}>Гостевой доступ</h1>
                <p className={styles.subtitle}>
                    Упростите выбор для гостей. QR-код откроет карту с тем, что
                    сейчас есть в наличии – удобно и наглядно.
                </p>
                {error && <div className={styles.error}>{error}</div>}
                {qrData ? (
                    <>
                        <img
                            src={qrData.qrCode}
                            alt='QR code'
                            className={styles.qrImage}
                        />
                        <div className={styles.urlContainer}>
                            <Input value={qrData.shareUrl} readOnly />
                            <Button
                                onClick={() =>
                                    navigator.clipboard.writeText(
                                        qrData.shareUrl
                                    )
                                }
                                size='small'
                            >
                                <CopyIcon size={20} color='white' />
                            </Button>
                        </div>
                        <div className={styles.buttonContainer}>
                            <Button onClick={handleDownloadQr} type='outline'>
                                <DownloadSimpleIcon size={16} />
                                Скачать QR-код
                            </Button>
                            <Button
                                onClick={handleGenerateQr}
                                disabled={loading}
                            >
                                {loading
                                    ? 'Генерируется...'
                                    : 'Сгенерировать новый QR-код'}
                            </Button>
                        </div>
                    </>
                ) : (
                    <Button
                        onClick={handleGenerateQr}
                        disabled={loading || !currentShop}
                    >
                        {loading ? 'Генерируется...' : 'Сгенерировать QR-код'}
                    </Button>
                )}
            </main>
        </div>
    );
};

export default GuestAccess;
