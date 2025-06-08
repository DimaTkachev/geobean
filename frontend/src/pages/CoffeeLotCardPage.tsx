import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth, useShop } from '@contexts/index';
import { Tooltip } from '@components/Tooltip/Tooltip';
import { ShopModal } from '@components/CoffeeMap/ShopModal';
import styles from '@styles/CoffeeLotCard.module.css';
import { Shop } from '@/contexts/ShopContext';

interface CoffeeLot {
    lotID: number;
    name: string;
    image: string | null;
    supplier: string;
    supplierLink: string | null;
    country: string;
    region: string;
    height: string;
    qRate: number;
    processingMethod: string;
    flavorNotes: string[];
    description: string;
    weight: string;
    roasting: string;
    price: number;
    shopId: number;
}

interface AttributeInfo {
    [key: string]: string;
}

export const CoffeeLotCardPage: React.FC = () => {
    const { lotID } = useParams<{ lotID: string }>();
    const { user } = useAuth();
    const { currentShop, setCurrentShop, refreshShops, shops } = useShop();
    const [coffeeLot, setCoffeeLot] = useState<CoffeeLot | null>(null);
    const [attrInfo, setAttrInfo] = useState<AttributeInfo>({});
    const [inventory, setInventory] = useState<number | null>(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
        const saved = localStorage.getItem('coffeeLotSidebarExpanded');
        return saved ? JSON.parse(saved) : false;
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [modalShop, setModalShop] = useState<Shop | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const maxShops = 3;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/coffee-lots/${lotID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch coffee lot');
                }
                const data = await response.json();
                setCoffeeLot(data);
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Error fetching coffee lot:', error.message);
                }
            }
        };

        fetchData();
    }, [lotID]);

    useEffect(() => {
        fetch('/api/coffee-lots/attribute-info')
            .then((res) => res.json())
            .then(setAttrInfo);
        if (user && currentShop) {
            const token = localStorage.getItem('authToken');
            fetch(`/api/shops/${currentShop.shopID}/inventory/${lotID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                    return { stock: 0 };
                })
                .then((data) => setInventory(data.stock || 0));
        }
    }, [lotID, user, currentShop]);

    const handleQuantity = async (change: number) => {
        if (!currentShop || !user || !coffeeLot) return;
        const newQuantity = Math.max(0, (inventory || 0) + change);
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(
                `/api/shops/${currentShop.shopID}/inventory/${coffeeLot.lotID}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ stock: newQuantity }),
                }
            );

            if (response.ok) {
                setInventory(newQuantity);
            }
        } catch (error) {
            console.error('Error updating inventory:', error);
        }
    };

    const handleSupplierClick = () => {
        if (coffeeLot?.supplierLink) {
            window.open(coffeeLot.supplierLink, '_blank');
        }
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

    const handleSidebarToggle = () => {
        const newExpanded = !isSidebarExpanded;
        setIsSidebarExpanded(newExpanded);
        localStorage.setItem(
            'coffeeLotSidebarExpanded',
            JSON.stringify(newExpanded)
        );
    };

    if (!coffeeLot) return <div>Загрузка...</div>;

    return (
        <div className={styles.pageWrapper}>
            {user && (
                <aside
                    className={styles.sidebar}
                    style={{
                        width: isSidebarExpanded ? 300 : 60,
                        transition: 'width 0.2s',
                        overflowY: 'auto',
                        maxHeight: '100vh',
                        overflowX: 'hidden',
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
                        aria-label={
                            isSidebarExpanded ? 'Свернуть' : 'Развернуть'
                        }
                    >
                        <span style={{ fontSize: 24, color: '#8b6a4a' }}>
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
                                                ? '#8b6a4a'
                                                : shop.theme === 'purple'
                                                  ? '#6c4a8b'
                                                  : '#4a6a8b',
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
                                            color: '#8b6a4a',
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
                                        color: '#8b6a4a',
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
            )}
            <div className={styles.cardWrapper}>
                <div className={styles.topSection}>
                    <div className={styles.imageSection}>
                        {coffeeLot.image && (
                            <img
                                src={`/images/${coffeeLot.image}`}
                                alt={coffeeLot.name}
                                className={styles.image}
                            />
                        )}
                        {user && (
                            <div className={styles.inventoryControls}>
                                <button
                                    className={styles.quantityBtn}
                                    onClick={() => handleQuantity(-1)}
                                    disabled={inventory === 0}
                                >
                                    -
                                </button>
                                <span className={styles.quantity}>
                                    {inventory ?? 0} шт
                                </span>
                                <button
                                    className={styles.quantityBtn}
                                    onClick={() => handleQuantity(1)}
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                    <div className={styles.infoSection}>
                        <h2 className={styles.name}>{coffeeLot.name}</h2>
                        <div className={styles.roastingWeight}>
                            под {coffeeLot.roasting}, {coffeeLot.weight}
                        </div>
                        <div className={styles.supplierSection}>
                            Поставщик:{' '}
                            <span
                                className={styles.supplierLink}
                                onClick={handleSupplierClick}
                                style={{
                                    cursor: coffeeLot.supplierLink
                                        ? 'pointer'
                                        : 'default',
                                }}
                            >
                                {coffeeLot.supplier}
                            </span>
                        </div>

                        <div className={styles.paramRow}>
                            <span>Страна:</span>
                            <Tooltip text={attrInfo['country'] || ''}>
                                <span className={styles.infoIcon}>i</span>
                            </Tooltip>
                            <span>{coffeeLot.country}</span>
                        </div>
                        <div className={styles.paramRow}>
                            <span>Регион:</span>
                            <Tooltip text={attrInfo['region'] || ''}>
                                <span className={styles.infoIcon}>i</span>
                            </Tooltip>
                            <span>{coffeeLot.region}</span>
                        </div>
                        <div className={styles.paramRow}>
                            <span>Высота:</span>
                            <Tooltip text={attrInfo['height'] || ''}>
                                <span className={styles.infoIcon}>i</span>
                            </Tooltip>
                            <span>{coffeeLot.height}</span>
                        </div>
                        <div className={styles.paramRow}>
                            <span>Q-рейтинг:</span>
                            <Tooltip text={attrInfo['qRate'] || ''}>
                                <span className={styles.infoIcon}>i</span>
                            </Tooltip>
                            <span>{coffeeLot.qRate}</span>
                        </div>
                        <div className={styles.paramRow}>
                            <span>Способ обработки:</span>
                            <Tooltip text={attrInfo['processingMethod'] || ''}>
                                <span className={styles.infoIcon}>i</span>
                            </Tooltip>
                            <span>{coffeeLot.processingMethod}</span>
                        </div>
                        <div className={styles.paramRow}>
                            <span>Вкусовые ноты:</span>
                            <span>{coffeeLot.flavorNotes.join(', ')}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.descriptionSection}>
                    <h4>Описание:</h4>
                    <p>{coffeeLot.description}</p>
                </div>
            </div>
        </div>
    );
};

export default CoffeeLotCardPage;
