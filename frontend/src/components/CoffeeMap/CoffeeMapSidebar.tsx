import React, { useState } from 'react';
import { useShop, useAuth } from '@contexts/index';
import { Shop } from '@contexts/ShopContext';
import { Button } from '../Button';
import { ShopModal } from './ShopModal';
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
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
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
                onClick={() => setIsSidebarExpanded((exp) => !exp)}
                aria-label={isSidebarExpanded ? 'Свернуть' : 'Развернуть'}
            >
                <span style={{ fontSize: 24, color: '#8b6a4a' }}>
                    {isSidebarExpanded ? '←' : '→'}
                </span>
            </button>
            {isAuthenticated && (
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
            )}
            <div className={styles.filters}>
                <h3 className={styles.filterTitle}>Фильтры</h3>

                <div className={styles.filterSection}>
                    <h4 className={styles.filterSubtitle}>Тип зерна:</h4>
                    <div className={styles.filterOptions}>
                        {availableFilters.roastingTypes.map((type) => (
                            <label key={type} className={styles.filterOption}>
                                <input
                                    type='checkbox'
                                    checked={filters.roastingTypes.includes(
                                        type
                                    )}
                                    onChange={() =>
                                        onFilterChange('roastingTypes', type)
                                    }
                                />
                                <span>{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.filterSection}>
                    <h4 className={styles.filterSubtitle}>Способ обработки:</h4>
                    <div className={styles.filterOptions}>
                        {availableFilters.processingMethods.map((method) => (
                            <label key={method} className={styles.filterOption}>
                                <input
                                    type='checkbox'
                                    checked={filters.processingMethods.includes(
                                        method
                                    )}
                                    onChange={() =>
                                        onFilterChange(
                                            'processingMethods',
                                            method
                                        )
                                    }
                                />
                                <span>{method}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.filterSection}>
                    <h4 className={styles.filterSubtitle}>Вкус кофе:</h4>
                    <div className={styles.filterOptions}>
                        {availableFilters.tasteTags.map((tag) => (
                            <label key={tag} className={styles.filterOption}>
                                <input
                                    type='checkbox'
                                    checked={filters.tasteTags.includes(tag)}
                                    onChange={() =>
                                        onFilterChange('tasteTags', tag)
                                    }
                                />
                                <span>{tag}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.filterSection}>
                    <h4 className={styles.filterSubtitle}>Поставщик:</h4>
                    <div className={styles.supplierSearch}>
                        <input
                            type='text'
                            placeholder='Найти поставщика...'
                            className={styles.supplierInput}
                        />
                    </div>
                </div>

                <div className={styles.filterSection}>
                    <h4 className={styles.filterSubtitle}>Континент:</h4>
                    <div className={styles.filterOptions}>
                        {availableFilters.continents.map((continent) => (
                            <label
                                key={continent}
                                className={styles.filterOption}
                            >
                                <input
                                    type='checkbox'
                                    checked={filters.continents.includes(
                                        continent
                                    )}
                                    onChange={() =>
                                        onFilterChange('continents', continent)
                                    }
                                />
                                <span>{continent}</span>
                            </label>
                        ))}
                    </div>
                </div>

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
