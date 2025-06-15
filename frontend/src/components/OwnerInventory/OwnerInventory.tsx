import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';

import { useShop } from '@contexts/index';
import { useAuth } from '@contexts/index';
import { Loader } from '@components/Loader';
import { debouncedFetch } from '@utils/api';
import { OwnerInventoryLayout } from './OwnerInventoryLayout';
import { OwnerInventorySidebar } from './OwnerInventorySidebar';

import styles from './OwnerInventory.module.css';
import { PlusIcon, MinusIcon, TrashIcon } from '@phosphor-icons/react';

interface InventoryItem {
    lotID: number;
    stock: number;
    coffeeLot: {
        coffeeLotID: number;
        name: string;
        description: string;
        roasting: string;
        weight: string | null;
        supplier: string;
        imageFilename: string | null;
        processingMethod: string;
        tasteTags: string[];
        continent: string;
        country: string;
        region: string;
        price: number;
        shopId: number;
    };
}

interface Filters {
    continents: string[];
    roastingTypes: string[];
    processingMethods: string[];
    tasteTags: string[];
    suppliers: string[];
    searchQuery: string;
    stockFilter: 'all' | 'inStock' | 'outOfStock' | 'lowStock';
}

export const OwnerInventory: React.FC = () => {
    const { currentShop } = useShop();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>(
        []
    );
    const [loading, setLoading] = useState(true);
    const [filtersLoading, setFiltersLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<Filters>({
        continents: [],
        roastingTypes: [],
        processingMethods: [],
        tasteTags: [],
        suppliers: [],
        searchQuery: '',
        stockFilter: 'all',
    });

    const [availableFilters, setAvailableFilters] = useState({
        continents: [] as string[],
        roastingTypes: [] as string[],
        processingMethods: [] as string[],
        tasteTags: [] as string[],
        suppliers: [] as string[],
    });

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!currentShop) {
            navigate('/');
            return;
        }

        const fetchInventory = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');
                const response = await debouncedFetch(
                    `/api/shops/${currentShop.shopID}/inventory`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch inventory');
                }

                const data: InventoryItem[] = await response.json();
                setInventory(data);
                setFilteredInventory(data);

                // Extract filter options from inventory
                const roastingTypes = [
                    ...new Set(data.map((item) => item.coffeeLot.roasting)),
                ];
                const processingMethods = [
                    ...new Set(
                        data.map((item) => item.coffeeLot.processingMethod)
                    ),
                ];
                const suppliers = [
                    ...new Set(data.map((item) => item.coffeeLot.supplier)),
                ];
                const continents = [
                    ...new Set(data.map((item) => item.coffeeLot.continent)),
                ];
                const tasteTags = [
                    ...new Set(
                        data.flatMap((item) => item.coffeeLot.tasteTags)
                    ),
                ];

                setAvailableFilters({
                    roastingTypes,
                    processingMethods,
                    suppliers,
                    continents,
                    tasteTags,
                });
            } catch (err: unknown) {
                const errorMessage =
                    err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
                console.error('Error fetching inventory:', err);
            } finally {
                setLoading(false);
                setFiltersLoading(false);
            }
        };

        fetchInventory();
    }, [user, currentShop, navigate]);

    useEffect(() => {
        let filtered = inventory;

        // Stock filter
        if (filters.stockFilter !== 'all') {
            filtered = filtered.filter((item) => {
                switch (filters.stockFilter) {
                    case 'inStock':
                        return item.stock > 0;
                    case 'outOfStock':
                        return item.stock === 0;
                    case 'lowStock':
                        return item.stock > 0 && item.stock <= 5;
                    default:
                        return true;
                }
            });
        }

        // Search filter
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(
                (item) =>
                    item.coffeeLot.name.toLowerCase().includes(query) ||
                    item.coffeeLot.description.toLowerCase().includes(query) ||
                    item.coffeeLot.country.toLowerCase().includes(query) ||
                    item.coffeeLot.region.toLowerCase().includes(query)
            );
        }

        // Other filters
        if (filters.roastingTypes.length > 0) {
            filtered = filtered.filter((item) =>
                filters.roastingTypes.includes(item.coffeeLot.roasting)
            );
        }

        if (filters.processingMethods.length > 0) {
            filtered = filtered.filter((item) =>
                filters.processingMethods.includes(
                    item.coffeeLot.processingMethod
                )
            );
        }

        if (filters.tasteTags.length > 0) {
            filtered = filtered.filter((item) =>
                item.coffeeLot.tasteTags.some((tag) =>
                    filters.tasteTags.includes(tag)
                )
            );
        }

        if (filters.suppliers.length > 0) {
            filtered = filtered.filter((item) =>
                filters.suppliers.includes(item.coffeeLot.supplier)
            );
        }

        if (filters.continents.length > 0) {
            filtered = filtered.filter((item) =>
                filters.continents.includes(item.coffeeLot.continent)
            );
        }

        setFilteredInventory(filtered);
    }, [inventory, filters]);

    const handleFilterChange = (
        filterType: keyof Omit<Filters, 'searchQuery' | 'stockFilter'>,
        value: string
    ): void => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: prev[filterType].includes(value)
                ? prev[filterType].filter((item) => item !== value)
                : [...prev[filterType], value],
        }));
    };

    const handleSearchChange = (query: string): void => {
        setFilters((prev) => ({ ...prev, searchQuery: query }));
    };

    const handleStockFilterChange = (
        stockFilter: Filters['stockFilter']
    ): void => {
        setFilters((prev) => ({ ...prev, stockFilter }));
    };

    const clearFilters = (): void => {
        setFilters({
            continents: [],
            roastingTypes: [],
            processingMethods: [],
            tasteTags: [],
            suppliers: [],
            searchQuery: '',
            stockFilter: 'all',
        });
    };

    const showError = (message: string) => {
        setErrorMessage(message);
        setShowErrorPopup(true);
        setTimeout(() => {
            setShowErrorPopup(false);
            setErrorMessage('');
        }, 5000);
    };

    const updateStock = async (lotID: number, newStock: number) => {
        if (!currentShop) return;

        try {
            const token = localStorage.getItem('authToken');
            const response = await debouncedFetch(
                `/api/shops/${currentShop.shopID}/inventory/${lotID}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ stock: newStock }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update stock');
            }

            setInventory((prev) =>
                prev.map((item) =>
                    item.lotID === lotID ? { ...item, stock: newStock } : item
                )
            );

            setSuccessMessage('Количество обновлено!');
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
                setSuccessMessage('');
            }, 3000);
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
            console.error('Error updating stock:', error);
            showError('Ошибка при обновлении количества: ' + errorMessage);
        }
    };

    const removeFromInventory = async (lotID: number) => {
        if (!currentShop) return;

        try {
            const token = localStorage.getItem('authToken');
            const response = await debouncedFetch(
                `/api/shops/${currentShop.shopID}/inventory/${lotID}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to remove from inventory');
            }

            setInventory((prev) => prev.filter((item) => item.lotID !== lotID));

            setSuccessMessage('Товар удален из инвентаря!');
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
                setSuccessMessage('');
            }, 3000);
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
            console.error('Error removing from inventory:', error);
            showError('Ошибка при удалении из инвентаря: ' + errorMessage);
        }
    };

    const handleCoffeeLotClick = (lotID: number): void => {
        navigate(`/coffee-lots/${lotID}`);
    };

    const getSupplierDotClass = (supplier: string) => {
        switch (supplier) {
            case 'Tasty Coffee':
                return styles.supplierDotTasty;
            case 'East Brew':
                return styles.supplierDotEast;
            case 'West 4':
                return styles.supplierDotWest;
            default:
                return '';
        }
    };

    const getStockStatusClass = (stock: number) => {
        if (stock === 0) return styles.stockOutOfStock;
        if (stock <= 5) return styles.stockLowStock;
        return styles.stockInStock;
    };

    if (loading || filtersLoading) {
        return <Loader variant='fullscreen' />;
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.error}>Ошибка: {error}</div>
            </div>
        );
    }

    const sidebar = (
        <OwnerInventorySidebar
            filters={filters}
            availableFilters={availableFilters}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            onStockFilterChange={handleStockFilterChange}
            onClearFilters={clearFilters}
        />
    );

    return (
        <OwnerInventoryLayout sidebar={sidebar}>
            <div className={styles.inventoryContent}>
                {filteredInventory.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>
                            {inventory.length === 0
                                ? 'Ваш инвентарь пуст. Добавьте кофейные лоты из каталога.'
                                : 'Кофе не найден по заданным критериям'}
                        </p>
                    </div>
                ) : (
                    <div className={styles.inventoryGrid}>
                        {filteredInventory.map((item) => (
                            <div
                                key={item.lotID}
                                className={styles.inventoryCard}
                            >
                                <div className={styles.inventoryCardBody}>
                                    {item.coffeeLot.imageFilename && (
                                        <img
                                            src={`/images/${item.coffeeLot.imageFilename}`}
                                            alt={item.coffeeLot.name}
                                            className={styles.inventoryImage}
                                            onClick={() =>
                                                handleCoffeeLotClick(item.lotID)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter')
                                                    handleCoffeeLotClick(
                                                        item.lotID
                                                    );
                                            }}
                                            tabIndex={0}
                                        />
                                    )}
                                    <div className={styles.inventoryInfo}>
                                        <h4
                                            className={styles.inventoryName}
                                            onClick={() =>
                                                handleCoffeeLotClick(item.lotID)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter')
                                                    handleCoffeeLotClick(
                                                        item.lotID
                                                    );
                                            }}
                                            tabIndex={0}
                                        >
                                            {item.coffeeLot.name}
                                        </h4>
                                        <div
                                            className={styles.inventoryDetails}
                                        >
                                            <span>
                                                под {item.coffeeLot.roasting}
                                            </span>
                                            {item.coffeeLot.weight && (
                                                <span>
                                                    {' '}
                                                    · {item.coffeeLot.weight}
                                                </span>
                                            )}
                                        </div>
                                        <div className={styles.supplierInfo}>
                                            {item.coffeeLot.supplier && (
                                                <>
                                                    <div
                                                        className={cn(
                                                            styles.supplierDot,
                                                            getSupplierDotClass(
                                                                item.coffeeLot
                                                                    .supplier
                                                            )
                                                        )}
                                                    />
                                                    <span>
                                                        {
                                                            item.coffeeLot
                                                                .supplier
                                                        }
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.inventoryStock}>
                                    <button
                                        onClick={() =>
                                            removeFromInventory(item.lotID)
                                        }
                                        className={styles.removeButton}
                                        title='Удалить из инвентаря'
                                    >
                                        <TrashIcon
                                            size={12}
                                            color='var(--brown-20)'
                                            weight='bold'
                                        />
                                    </button>

                                    <div className={styles.inventoryStockLabel}>
                                        <span
                                            className={cn(
                                                styles.stockStatus,
                                                getStockStatusClass(item.stock)
                                            )}
                                        >
                                            {item.stock} шт
                                        </span>
                                    </div>

                                    <div className={styles.stockControls}>
                                        <button
                                            onClick={() =>
                                                updateStock(
                                                    item.lotID,
                                                    Math.max(0, item.stock - 1)
                                                )
                                            }
                                            disabled={item.stock === 0}
                                        >
                                            <MinusIcon
                                                size={12}
                                                color='var(--brown-20)'
                                                weight='bold'
                                            />
                                        </button>
                                        <button
                                            onClick={() =>
                                                updateStock(
                                                    item.lotID,
                                                    item.stock + 1
                                                )
                                            }
                                        >
                                            <PlusIcon
                                                size={12}
                                                color='var(--brown-20)'
                                                weight='bold'
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showSuccessPopup && (
                <div className={styles.successPopup}>{successMessage}</div>
            )}

            {showErrorPopup && (
                <div className={styles.errorPopup}>{errorMessage}</div>
            )}
        </OwnerInventoryLayout>
    );
};
