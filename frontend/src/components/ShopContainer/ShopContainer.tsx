import React, { useState } from 'react';
import cn from 'classnames';
import { useShop, useAuth } from '@contexts/index';
import { Shop } from '@contexts/ShopContext';
import { ShopModal } from '../ShopModal';
import { fetchApi } from '@utils/api';
import styles from './ShopContainer.module.css';
import { PlusIcon } from '@phosphor-icons/react';

export const ShopContainer: React.FC = () => {
    const {
        shops,
        currentShop,
        setCurrentShop,
        refreshShops,
        isShopSidebarExpanded,
    } = useShop();
    const { isAuthenticated } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [modalShop, setModalShop] = useState<Shop | null>(null);
    const [modalLoading, setModalLoading] = useState(false);

    const maxShops = 3;

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
                await fetchApi('/api/shops', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name, theme }),
                });
            } else if (modalMode === 'edit' && modalShop) {
                await fetchApi(`/api/shops/${modalShop.shopID}`, {
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
            await fetchApi(`/api/shops/${modalShop.shopID}`, {
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

    if (!isAuthenticated) {
        return null;
    }

    return (
        <aside
            className={cn(styles.shopsContainer, {
                [styles.shopsContainerExpanded]: isShopSidebarExpanded,
            })}
        >
            {shops.map((shop) => (
                <div
                    key={shop.shopID}
                    className={cn(styles.shopItem, {
                        [styles.shopItemSelected]:
                            currentShop?.shopID === shop.shopID,
                    })}
                    onClick={() => setCurrentShop(shop)}
                >
                    <div
                        className={cn(styles.shopAvatar, {
                            [styles.shopAvatarBeige]: shop.theme === 'beige',
                            [styles.shopAvatarPurple]: shop.theme === 'purple',
                            [styles.shopAvatarBlue]: shop.theme === 'blue',
                        })}
                        style={{
                            backgroundImage: shop.image
                                ? `url(${shop.image})`
                                : undefined,
                        }}
                    />
                    {!isShopSidebarExpanded && (
                        <>
                            <span className={styles.shopName}>{shop.name}</span>
                            <button
                                disabled={isShopSidebarExpanded}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditShop(shop);
                                }}
                                className={styles.editButton}
                                title='Редактировать'
                            >
                                Ред.
                            </button>
                        </>
                    )}
                </div>
            ))}
            {shops.length < maxShops && (
                <button
                    className={styles.addShopContainer}
                    onClick={handleAddShop}
                    title={'Добавить кофейню'}
                >
                    <div className={styles.addShopButton}>
                        <PlusIcon
                            size={16}
                            weight='bold'
                            color='var(--theme-text-secondary)'
                        />
                    </div>
                    {!isShopSidebarExpanded && (
                        <span className={styles.addShopText}>Добавить ещё</span>
                    )}
                </button>
            )}
            <ShopModal
                open={modalOpen}
                mode={modalMode}
                initialName={modalShop?.name}
                initialTheme={modalShop?.theme}
                onApply={handleModalApply}
                onDelete={modalMode === 'edit' ? handleModalDelete : undefined}
                onClose={() => setModalOpen(false)}
                isApplyDisabled={modalLoading}
                isDeleteDisabled={shops.length <= 1}
            />
        </aside>
    );
};
