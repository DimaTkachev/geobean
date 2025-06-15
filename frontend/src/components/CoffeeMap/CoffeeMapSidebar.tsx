import React, { useState } from 'react';
import cn from 'classnames';
import { useShop, useAuth } from '@contexts/index';
import { Shop } from '@contexts/ShopContext';
import { Button } from '@components/Button';
import { ShopModal } from './ShopModal';
import { FilterSection } from './FilterSection';
import styles from './CoffeeMapSidebar.module.css';

interface Filters {
    continents: string[];
    roastingTypes: string[];
    processingMethods: string[];
    tasteTags: string[];
    searchQuery: string;
}

interface AvailableFilters {
    continents: string[];
    roastingTypes: string[];
    processingMethods: string[];
    tasteTags: string[];
}

interface CoffeeMapSidebarProps {
    filters: Filters;
    availableFilters: AvailableFilters;
    onFilterChange: (filterType: keyof Filters, value: string) => void;
    onClearFilters: () => void;
}

export const CoffeeMapSidebar: React.FC<CoffeeMapSidebarProps> = ({
    filters,
    availableFilters,
    onFilterChange,
    onClearFilters,
}) => {
    const { shops, currentShop, setCurrentShop, refreshShops } = useShop();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [modalShop, setModalShop] = useState<Shop | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const maxShops = 3;
    const { isAuthenticated } = useAuth();

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
        <aside className={styles.sidebar}>
            {isAuthenticated && (
                <div className={styles.shopsContainer}>
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
                                    [styles.shopAvatarBeige]:
                                        shop.theme === 'beige',
                                    [styles.shopAvatarPurple]:
                                        shop.theme === 'purple',
                                    [styles.shopAvatarBlue]:
                                        shop.theme === 'blue',
                                    [styles.shopAvatarSelected]:
                                        currentShop?.shopID === shop.shopID,
                                })}
                                style={{
                                    backgroundImage: shop.image
                                        ? `url(${shop.image})`
                                        : undefined,
                                }}
                            />
                            <span className={styles.shopName}>{shop.name}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditShop(shop);
                                }}
                                className={styles.editButton}
                                title='Редактировать'
                            >
                                Ред.
                            </button>
                        </div>
                    ))}
                    {shops.length < maxShops && (
                        <div className={styles.addShopContainer}>
                            <button
                                className={styles.addShopButton}
                                title={'Добавить кофейню'}
                                onClick={handleAddShop}
                            >
                                +
                            </button>
                            <span className={styles.addShopText}>
                                Добавить ещё
                            </span>
                        </div>
                    )}
                </div>
            )}
            <div className={styles.filters}>
                <h3 className={styles.filterTitle}>Фильтры</h3>

                <FilterSection
                    title='Тип зерна:'
                    type='checkbox'
                    options={availableFilters.roastingTypes}
                    selectedOptions={filters.roastingTypes}
                    onOptionChange={(type) =>
                        onFilterChange('roastingTypes', type)
                    }
                />

                <FilterSection
                    title='Способ обработки:'
                    type='checkbox'
                    options={availableFilters.processingMethods}
                    selectedOptions={filters.processingMethods}
                    onOptionChange={(method) =>
                        onFilterChange('processingMethods', method)
                    }
                />

                <FilterSection
                    title='Вкус кофе:'
                    type='checkbox'
                    options={availableFilters.tasteTags}
                    selectedOptions={filters.tasteTags}
                    onOptionChange={(tag) => onFilterChange('tasteTags', tag)}
                />

                <FilterSection
                    title='Поставщик:'
                    type='search'
                    searchPlaceholder='Найти поставщика...'
                />

                <FilterSection
                    title='Континент:'
                    type='checkbox'
                    options={availableFilters.continents}
                    selectedOptions={filters.continents}
                    onOptionChange={(continent) =>
                        onFilterChange('continents', continent)
                    }
                />

                <Button onClick={onClearFilters} active>
                    Очистить фильтры
                </Button>
            </div>
            {isAuthenticated && (
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
            )}
        </aside>
    );
};
