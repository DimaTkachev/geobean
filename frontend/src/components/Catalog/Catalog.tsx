import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';

import { useShop } from '@contexts/index';
import { useAuth } from '@contexts/index';
import { Loader } from '@components/Loader';
import { CatalogLayout } from './CatalogLayout';
import { CatalogSidebar } from './CatalogSidebar';
import { debouncedFetch } from '@utils/api';

import styles from './Catalog.module.css';
import { PlusIcon, CheckIcon } from '@phosphor-icons/react';

interface CoffeeLot {
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
}

interface InventoryItem {
    lotID: number;
    stock: number;
}

interface Filters {
    continents: string[];
    roastingTypes: string[];
    processingMethods: string[];
    tasteTags: string[];
    suppliers: string[];
    searchQuery: string;
}

export const Catalog: React.FC = () => {
    const { currentShop } = useShop();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [coffeeLots, setCoffeeLots] = useState<CoffeeLot[]>([]);
    const [filteredCoffeeLots, setFilteredCoffeeLots] = useState<CoffeeLot[]>(
        []
    );
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
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
        const fetchFilterOptions = async () => {
            try {
                setFiltersLoading(true);
                const response = await debouncedFetch(
                    '/api/coffee-lots/filter-options'
                );
                if (!response.ok)
                    throw new Error('Failed to fetch filter options');
                const data = await response.json();
                setAvailableFilters(data);
            } catch (err) {
                console.error('Error fetching filter options:', err);
            } finally {
                setFiltersLoading(false);
            }
        };

        fetchFilterOptions();
    }, []);

    useEffect(() => {
        const fetchCoffeeLots = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');
                const response = await debouncedFetch('/api/coffee-lots', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setError('Access token required or invalid');
                    } else {
                        throw new Error('Failed to fetch coffee lots');
                    }
                    setCoffeeLots([]);
                    setFilteredCoffeeLots([]);
                    return;
                }

                const data: CoffeeLot[] = await response.json();
                setCoffeeLots(data);
                setFilteredCoffeeLots(data);
            } catch (err: unknown) {
                const errorMessage =
                    err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
                console.error('Error fetching coffee lots:', err);
                setCoffeeLots([]);
                setFilteredCoffeeLots([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCoffeeLots();
    }, [user]);

    useEffect(() => {
        const fetchInventory = async () => {
            if (!currentShop || !user) {
                setInventory([]);
                return;
            }

            try {
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

                if (response.ok) {
                    const data: InventoryItem[] = await response.json();
                    setInventory(data);
                } else {
                    setInventory([]);
                }
            } catch (err) {
                console.error('Error fetching inventory:', err);
                setInventory([]);
            }
        };

        fetchInventory();
    }, [currentShop, user]);

    useEffect(() => {
        let filtered = coffeeLots;

        if (filters.roastingTypes.length > 0) {
            filtered = filtered.filter((lot) =>
                filters.roastingTypes.includes(lot.roasting)
            );
        }

        if (filters.processingMethods.length > 0) {
            filtered = filtered.filter((lot) =>
                filters.processingMethods.includes(lot.processingMethod)
            );
        }

        if (filters.tasteTags.length > 0) {
            filtered = filtered.filter((lot) =>
                lot.tasteTags.some((tag) => filters.tasteTags.includes(tag))
            );
        }

        if (filters.suppliers.length > 0) {
            filtered = filtered.filter((lot) =>
                filters.suppliers.includes(lot.supplier)
            );
        }

        if (filters.continents.length > 0) {
            filtered = filtered.filter((lot) =>
                filters.continents.includes(lot.continent)
            );
        }

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(
                (lot) =>
                    lot.name.toLowerCase().includes(query) ||
                    lot.region.toLowerCase().includes(query) ||
                    lot.country.toLowerCase().includes(query)
            );
        }

        setFilteredCoffeeLots(filtered);
    }, [filters, coffeeLots]);

    const handleFilterChange = (
        filterType: keyof Omit<Filters, 'searchQuery'>,
        value: string
    ): void => {
        setFilters((prev) => {
            const currentValues = prev[filterType] as string[];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];

            return {
                ...prev,
                [filterType]: newValues,
            };
        });
    };

    const handleSearchChange = (query: string): void => {
        setFilters((prev) => ({
            ...prev,
            searchQuery: query,
        }));
    };

    const clearFilters = (): void => {
        setFilters({
            continents: [],
            roastingTypes: [],
            processingMethods: [],
            tasteTags: [],
            suppliers: [],
            searchQuery: '',
        });
    };

    const getInventoryStock = (coffeeLotID: number): number => {
        const inventoryItem = inventory.find(
            (item) => item.lotID === coffeeLotID
        );
        return inventoryItem ? inventoryItem.stock : 0;
    };

    const showError = (message: string) => {
        setErrorMessage(message);
        setShowErrorPopup(true);
        setTimeout(() => {
            setShowErrorPopup(false);
            setErrorMessage('');
        }, 3000);
    };

    const handleAddToInventory = async (coffeeLotID: number) => {
        if (!currentShop) {
            showError('Пожалуйста, выберите кофейню сначала.');
            return;
        }

        // Check if item is already in inventory
        const currentStock = getInventoryStock(coffeeLotID);
        if (currentStock > 0) {
            return; // Don't add if already in inventory
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(
                `/api/shops/${currentShop.shopID}/inventory`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ coffeeLotID, quantity: 1 }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 'Failed to add item to inventory'
                );
            }

            // Update inventory state locally
            setInventory((prev) => [...prev, { lotID: coffeeLotID, stock: 1 }]);

            setSuccessMessage('Кофе добавлен в инвентарь!');
            setShowSuccessPopup(true);

            setTimeout(() => {
                setShowSuccessPopup(false);
                setSuccessMessage('');
            }, 3000);
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
            console.error('Error adding to inventory:', error);
            showError('Ошибка при добавлении в инвентарь: ' + errorMessage);
        }
    };

    const handleCoffeeLotClick = (coffeeLot: CoffeeLot): void => {
        navigate(`/coffee-lots/${coffeeLot.coffeeLotID}`);
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
        <CatalogSidebar
            filters={filters}
            availableFilters={availableFilters}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            onClearFilters={clearFilters}
        />
    );

    return (
        <CatalogLayout sidebar={sidebar}>
            <div className={styles.catalogContent}>
                {filteredCoffeeLots.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Кофе не найден по заданным критериям</p>
                    </div>
                ) : (
                    <div className={styles.coffeeGrid}>
                        {filteredCoffeeLots.map((lot) => (
                            <div
                                key={lot.coffeeLotID}
                                className={styles.coffeeLotCard}
                            >
                                <div className={styles.coffeeLotCardBody}>
                                    {lot.imageFilename && (
                                        <img
                                            src={`/images/${lot.imageFilename}`}
                                            alt={lot.name}
                                            className={styles.coffeeLotImage}
                                            onClick={() =>
                                                handleCoffeeLotClick(lot)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter')
                                                    handleCoffeeLotClick(lot);
                                            }}
                                            tabIndex={0}
                                        />
                                    )}
                                    <div className={styles.coffeeLotInfo}>
                                        <h4
                                            className={styles.coffeeLotName}
                                            onClick={() =>
                                                handleCoffeeLotClick(lot)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter')
                                                    handleCoffeeLotClick(lot);
                                            }}
                                            tabIndex={0}
                                        >
                                            {lot.name}
                                        </h4>
                                        <div
                                            className={styles.coffeeLotDetails}
                                        >
                                            <span>под {lot.roasting}</span>
                                            {lot.weight && (
                                                <span> · {lot.weight}</span>
                                            )}
                                        </div>
                                        <div className={styles.supplierInfo}>
                                            {lot.supplier && (
                                                <>
                                                    <div
                                                        className={cn(
                                                            styles.supplierDot,
                                                            getSupplierDotClass(
                                                                lot.supplier
                                                            )
                                                        )}
                                                    />
                                                    <span>{lot.supplier}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {currentShop && (
                                    <div className={styles.inventoryStock}>
                                        <button
                                            onClick={() =>
                                                getInventoryStock(
                                                    lot.coffeeLotID
                                                ) > 0
                                                    ? undefined
                                                    : handleAddToInventory(
                                                          lot.coffeeLotID
                                                      )
                                            }
                                            disabled={!currentShop}
                                        >
                                            {getInventoryStock(
                                                lot.coffeeLotID
                                            ) > 0 ? (
                                                <CheckIcon
                                                    size={14}
                                                    color='var(--brown-20)'
                                                    weight='bold'
                                                />
                                            ) : (
                                                <PlusIcon
                                                    size={14}
                                                    color='var(--brown-20)'
                                                    weight='bold'
                                                />
                                            )}
                                        </button>
                                    </div>
                                )}
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
        </CatalogLayout>
    );
};
