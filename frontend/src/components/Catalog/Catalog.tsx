import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useShop } from '../../contexts';
import { useAuth } from '../../contexts';

import styles from '../CoffeeMap/CoffeeMap.module.css';

interface CoffeeLot {
    coffeeLotID: number;
    name: string;
    roasting: string;
    weight: string | null;
    supplier: string;
    imageFilename: string | null;
    processingMethod: string;
    tasteTags: string[];
    continent: string;
    country: string;
    region: string;
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
    const { shops, currentShop, setCurrentShop, refreshShops } = useShop();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [coffeeLots, setCoffeeLots] = useState<CoffeeLot[]>([]);
    const [filteredCoffeeLots, setFilteredCoffeeLots] = useState<CoffeeLot[]>(
        []
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

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

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await fetch('/api/coffee-lots/filter-options');
                if (!response.ok)
                    throw new Error('Failed to fetch filter options');
                const data = await response.json();
                setAvailableFilters(data);
            } catch (err) {
                console.error('Error fetching filter options:', err);
            }
        };

        fetchFilterOptions();
    }, []);

    useEffect(() => {
        const fetchCoffeeLots = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');
                const response = await fetch('/api/coffee-lots', {
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
            } catch (err: any) {
                setError(err.message);
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

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleAddToInventory = async (coffeeLotID: number) => {
        if (!currentShop) {
            alert('Пожалуйста, выберите кофейню сначала.');
            return;
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

            setSuccessMessage('Кофе добавлен в инвентарь!');
            setShowSuccessPopup(true);

            setTimeout(() => {
                setShowSuccessPopup(false);
                setSuccessMessage('');
            }, 3000);
        } catch (error: any) {
            console.error('Error adding to inventory:', error);
            alert('Ошибка при добавлении в инвентарь: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Загрузка каталога...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>Ошибка: {error}</div>
            </div>
        );
    }

    return (
        <div
            className={`${styles.container} ${isSidebarExpanded ? styles.sidebarExpanded : ''}`}
        >
            <div
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
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsSidebarExpanded((exp) => !exp);
                    }}
                    aria-label={isSidebarExpanded ? 'Свернуть' : 'Развернуть'}
                >
                    <span style={{ fontSize: 24 }}>
                        {isSidebarExpanded ? '←' : '→'}
                    </span>
                </button>

                <div
                    style={{
                        marginBottom: isSidebarExpanded ? 24 : 0,
                        overflow: 'hidden',
                    }}
                >
                    {isSidebarExpanded && (
                        <div style={{ marginBottom: 12 }}>
                            {shops.map((shop) => (
                                <div
                                    key={shop.shopID}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        marginBottom: 8,
                                        cursor: 'pointer',
                                        background:
                                            currentShop?.shopID === shop.shopID
                                                ? 'rgba(255,255,255,0.1)'
                                                : 'transparent',
                                        borderRadius: 8,
                                        padding: 4,
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentShop(shop);
                                    }}
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
                                                currentShop?.shopID ===
                                                shop.shopID
                                                    ? '2px solid #fff'
                                                    : '2px solid #ccc',
                                        }}
                                    />
                                    <span
                                        style={{
                                            color: '#3c1f0c',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {shop.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    {!isSidebarExpanded && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginBottom: 8,
                            }}
                        >
                            {shops.map((shop) => (
                                <div
                                    key={shop.shopID}
                                    style={{
                                        width: 40,
                                        height: 40,
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
                                                ? '2px solid #fff'
                                                : '2px solid #ccc',
                                        marginBottom: 8,
                                        cursor: 'pointer',
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentShop(shop);
                                    }}
                                    title={shop.name}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {isSidebarExpanded && (
                    <div className={styles.filters}>
                        <h3 className={styles.filterTitle}>Фильтры</h3>

                        <div className={styles.searchContainer}>
                            <input
                                type='text'
                                placeholder='Быстрый поиск...'
                                value={filters.searchQuery}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                className={styles.searchInput}
                            />
                        </div>

                        <div className={styles.filterSection}>
                            <h4 className={styles.filterSubtitle}>
                                Тип обжарки:
                            </h4>
                            <div className={styles.filterOptions}>
                                {availableFilters.roastingTypes.map((type) => (
                                    <label
                                        key={type}
                                        className={styles.filterOption}
                                    >
                                        <input
                                            type='checkbox'
                                            checked={filters.roastingTypes.includes(
                                                type
                                            )}
                                            onChange={() =>
                                                handleFilterChange(
                                                    'roastingTypes',
                                                    type
                                                )
                                            }
                                        />
                                        <span>{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={styles.filterSection}>
                            <h4 className={styles.filterSubtitle}>
                                Способ обработки:
                            </h4>
                            <div className={styles.filterOptions}>
                                {availableFilters.processingMethods.map(
                                    (method) => (
                                        <label
                                            key={method}
                                            className={styles.filterOption}
                                        >
                                            <input
                                                type='checkbox'
                                                checked={filters.processingMethods.includes(
                                                    method
                                                )}
                                                onChange={() =>
                                                    handleFilterChange(
                                                        'processingMethods',
                                                        method
                                                    )
                                                }
                                            />
                                            <span>{method}</span>
                                        </label>
                                    )
                                )}
                            </div>
                        </div>
                        <div className={styles.filterSection}>
                            <h4 className={styles.filterSubtitle}>
                                Вкус кофе:
                            </h4>
                            <div className={styles.filterOptions}>
                                {availableFilters.tasteTags.map((tag) => (
                                    <label
                                        key={tag}
                                        className={styles.filterOption}
                                    >
                                        <input
                                            type='checkbox'
                                            checked={filters.tasteTags.includes(
                                                tag
                                            )}
                                            onChange={() =>
                                                handleFilterChange(
                                                    'tasteTags',
                                                    tag
                                                )
                                            }
                                        />
                                        <span>{tag}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={styles.filterSection}>
                            <h4 className={styles.filterSubtitle}>
                                Поставщик:
                            </h4>
                            <div className={styles.filterOptions}>
                                {availableFilters.suppliers.map((supplier) => (
                                    <label
                                        key={supplier}
                                        className={styles.filterOption}
                                    >
                                        <input
                                            type='checkbox'
                                            checked={filters.suppliers.includes(
                                                supplier
                                            )}
                                            onChange={() =>
                                                handleFilterChange(
                                                    'suppliers',
                                                    supplier
                                                )
                                            }
                                        />
                                        <span>{supplier}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={styles.filterSection}>
                            <h4 className={styles.filterSubtitle}>
                                Континент:
                            </h4>
                            <div className={styles.filterOptions}>
                                {availableFilters.continents.map(
                                    (continent) => (
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
                                                    handleFilterChange(
                                                        'continents',
                                                        continent
                                                    )
                                                }
                                            />
                                            <span>{continent}</span>
                                        </label>
                                    )
                                )}
                            </div>
                        </div>

                        <button
                            onClick={clearFilters}
                            className={styles.clearButton}
                        >
                            Очистить фильтры
                        </button>
                    </div>
                )}
            </div>

            <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
                <h2 style={{ color: '#3c1f0c', marginBottom: '20px' }}>
                    Каталог зерен
                </h2>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '20px',
                    }}
                >
                    {filteredCoffeeLots.map((lot) => (
                        <div
                            key={lot.coffeeLotID}
                            style={{
                                border: '1px solid #ccc',
                                padding: '15px',
                                borderRadius: '8px',
                                textAlign: 'center',
                                background: '#fff',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                            className={styles.coffeeLotCard}
                            onMouseEnter={() =>
                                setHoveredCardId(lot.coffeeLotID)
                            }
                            onMouseLeave={() => setHoveredCardId(null)}
                        >
                            {lot.imageFilename && (
                                <img
                                    src={`/images/${lot.imageFilename}`}
                                    alt={lot.name}
                                    style={{
                                        width: '100%',
                                        height: '150px',
                                        objectFit: 'contain',
                                        borderRadius: '4px',
                                        marginBottom: '10px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() =>
                                        navigate(
                                            `/coffee-lots/${lot.coffeeLotID}`
                                        )
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter')
                                            navigate(
                                                `/coffee-lots/${lot.coffeeLotID}`
                                            );
                                    }}
                                    tabIndex={0}
                                    className={styles.coffeeLotImage}
                                />
                            )}
                            <h4
                                style={{
                                    marginBottom: '5px',
                                    color: '#3c1f0c',
                                    cursor: 'pointer',
                                }}
                                onClick={() =>
                                    navigate(`/coffee-lots/${lot.coffeeLotID}`)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter')
                                        navigate(
                                            `/coffee-lots/${lot.coffeeLotID}`
                                        );
                                }}
                                tabIndex={0}
                                className={styles.coffeeLotName}
                            >
                                {lot.name}
                            </h4>
                            <div
                                style={{
                                    fontSize: '0.9em',
                                    color: '#555',
                                    marginBottom: '5px',
                                }}
                            >
                                <span>под {lot.roasting}</span>
                                {lot.weight && <span> - {lot.weight}</span>}
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.9em',
                                    color: '#555',
                                }}
                            >
                                {lot.supplier === 'Tasty Coffee' && (
                                    <div
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: '#9747FF',
                                            marginRight: '5px',
                                        }}
                                    ></div>
                                )}
                                {lot.supplier === 'East Brew' && (
                                    <div
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: '#2BB22B',
                                            marginRight: '5px',
                                        }}
                                    ></div>
                                )}
                                {lot.supplier === 'West 4' && (
                                    <div
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: '#F68420',
                                            marginRight: '5px',
                                        }}
                                    ></div>
                                )}
                                {lot.supplier && <span>{lot.supplier}</span>}
                            </div>
                            <button
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'rgba(0, 0, 0, 0.6)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 1,
                                    opacity:
                                        hoveredCardId === lot.coffeeLotID
                                            ? 1
                                            : 0,
                                    transition: 'opacity 0.2s ease-in-out',
                                }}
                                className={styles.addToInventoryButton}
                                onClick={() =>
                                    handleAddToInventory(lot.coffeeLotID)
                                }
                                disabled={!currentShop}
                                title={
                                    currentShop
                                        ? 'Добавить в инвентарь'
                                        : 'Выберите кофейню'
                                }
                            >
                                +
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {showSuccessPopup && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#4CAF50',
                        color: 'white',
                        padding: '15px 20px',
                        borderRadius: '8px',
                        zIndex: 1000,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    }}
                >
                    {successMessage}
                </div>
            )}
        </div>
    );
};
