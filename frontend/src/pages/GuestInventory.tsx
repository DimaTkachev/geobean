import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup,
} from 'react-simple-maps';
import styles from '@components/CoffeeMap/CoffeeMap.module.css';
import sidebarStyles from '@components/CoffeeMap/CoffeeMapSidebar.module.css';
import headerStyles from '@components/Header/Header.module.css';
import { Loader } from '@components/Loader';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { FilterSection } from '@components/CoffeeMap/FilterSection';
import { AppLayout } from '@components/Layout/AppLayout';
import { debouncedFetch } from '@utils/api';
import { useTheme } from '@hooks/useTheme';
import Logo from '@assets/images/logo.svg';
import cn from 'classnames';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface CoffeeMarker {
    markerID: number;
    latitude: number;
    longitude: number;
    lotID: number;
    stock: number;
    CoffeeLot: {
        lotID: number;
        name: string;
        image: string;
        tasteFilter: string;
        Region: {
            name: string;
            Country: {
                name: string;
                Continent: {
                    name: string;
                };
            };
        };
        Roasting: {
            name: string;
        };
        ProcessingMethod: {
            name: string;
        };
        Weight: {
            value: string;
        };
        Supplier: {
            name: string;
        };
        TasteTags: Array<{
            name: string;
        }>;
    };
}

interface ShopInfo {
    name: string;
    theme: string;
}

interface GuestInventoryData {
    shop: ShopInfo;
    markers: CoffeeMarker[];
}

interface Filters {
    continents: string[];
    roastingTypes: string[];
    processingMethods: string[];
    tasteTags: string[];
    suppliers: string[];
    searchQuery: string;
}

const GuestInventory: React.FC = () => {
    const { shareUrl } = useParams<{ shareUrl: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<GuestInventoryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredMarkerID, setHoveredMarkerID] = useState<number | null>(null);
    const [popupPosition, setPopupPosition] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const [filteredMarkers, setFilteredMarkers] = useState<CoffeeMarker[]>([]);

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

    // Apply theme based on shop data
    useTheme(data?.shop?.theme as 'beige' | 'purple' | 'blue');

    useEffect(() => {
        if (!shareUrl) return;
        setLoading(true);
        setError(null);

        debouncedFetch(`/api/shops/guest-inventory/${shareUrl}`)
            .then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || 'Failed to fetch inventory'
                    );
                }
                return res.json();
            })
            .then((responseData: GuestInventoryData) => {
                setData(responseData);
                setFilteredMarkers(responseData.markers);

                // Set up available filters
                const continents = [
                    ...new Set(
                        responseData.markers.map(
                            (m) => m.CoffeeLot.Region.Country.Continent.name
                        )
                    ),
                ];
                const roastingTypes = [
                    ...new Set(
                        responseData.markers.map(
                            (m) => m.CoffeeLot.Roasting.name
                        )
                    ),
                ];
                const processingMethods = [
                    ...new Set(
                        responseData.markers.map(
                            (m) => m.CoffeeLot.ProcessingMethod.name
                        )
                    ),
                ];
                const tasteTags = [
                    ...new Set(
                        responseData.markers.flatMap(
                            (m) =>
                                m.CoffeeLot.TasteTags?.map((tag) => tag.name) ||
                                []
                        )
                    ),
                ];
                const suppliers = [
                    ...new Set(
                        responseData.markers.map(
                            (m) => m.CoffeeLot.Supplier.name
                        )
                    ),
                ];

                setAvailableFilters({
                    continents,
                    roastingTypes,
                    processingMethods,
                    tasteTags,
                    suppliers,
                });
            })
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, [shareUrl]);

    useEffect(() => {
        if (!data) return;

        let filtered = data.markers;

        if (filters.searchQuery && filters.searchQuery.trim()) {
            const query = filters.searchQuery.toLowerCase().trim();
            filtered = filtered.filter((marker) =>
                marker.CoffeeLot.Region.Country.name
                    .toLowerCase()
                    .includes(query)
            );
        }

        if (filters.continents.length > 0) {
            filtered = filtered.filter((marker) =>
                filters.continents.includes(
                    marker.CoffeeLot.Region.Country.Continent.name
                )
            );
        }

        if (filters.roastingTypes.length > 0) {
            filtered = filtered.filter((marker) =>
                filters.roastingTypes.includes(marker.CoffeeLot.Roasting.name)
            );
        }

        if (filters.processingMethods.length > 0) {
            filtered = filtered.filter((marker) =>
                filters.processingMethods.includes(
                    marker.CoffeeLot.ProcessingMethod.name
                )
            );
        }

        if (filters.tasteTags.length > 0) {
            filtered = filtered.filter((marker) =>
                marker.CoffeeLot.TasteTags?.some((tag) =>
                    filters.tasteTags.includes(tag.name)
                )
            );
        }

        if (filters.suppliers.length > 0) {
            filtered = filtered.filter((marker) =>
                filters.suppliers.includes(marker.CoffeeLot.Supplier.name)
            );
        }

        setFilteredMarkers(filtered);
    }, [data, filters]);

    const handleFilterChange = (
        filterType: keyof Filters,
        value: string
    ): void => {
        setFilters((prev) => {
            // Ensure prev is defined and has the expected structure
            if (!prev) return prev;

            const currentValues = (prev[filterType] as string[]) || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((item) => item !== value)
                : [...currentValues, value];

            return {
                ...prev,
                [filterType]: newValues,
            };
        });
    };

    const handleSearchChange = (query: string): void => {
        setFilters((prev) => ({ ...prev, searchQuery: query || '' }));
    };

    const handleGeographyClick = (geo: {
        properties: { NAME: string };
    }): void => {
        const countryName = geo.properties.NAME;
        if ((filters.searchQuery || '') === countryName) {
            setFilters((prev) => ({ ...prev, searchQuery: '' }));
        } else {
            setFilters((prev) => ({ ...prev, searchQuery: countryName || '' }));
        }
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

    const handleMarkerMouseEnter =
        (markerID: number) => (e: React.MouseEvent) => {
            setHoveredMarkerID(markerID);
            setPopupPosition({ x: e.clientX, y: e.clientY });
        };

    const handleMarkerMouseMove = (e: React.MouseEvent) => {
        setPopupPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMarkerMouseLeave = (markerID: number) => () => {
        setHoveredMarkerID((id) => (id === markerID ? null : id));
        setPopupPosition(null);
    };

    const markerSize = 3;

    if (loading) return <Loader variant='fullscreen' />;
    if (error)
        return (
            <div className={styles.container}>
                <div>Ошибка: {error}</div>
            </div>
        );
    if (!data)
        return (
            <div className={styles.container}>
                <div>Данные не найдены</div>
            </div>
        );

    const sidebar = (
        <aside className={sidebarStyles.sidebar}>
            <div className={sidebarStyles.filters}>
                <h3 className={sidebarStyles.filterTitle}>Фильтры</h3>

                <FilterSection
                    title='Тип зерна:'
                    type='checkbox'
                    options={availableFilters.roastingTypes}
                    selectedOptions={filters.roastingTypes}
                    onOptionChange={(type) =>
                        handleFilterChange('roastingTypes', type)
                    }
                />

                <FilterSection
                    title='Способ обработки:'
                    type='checkbox'
                    options={availableFilters.processingMethods}
                    selectedOptions={filters.processingMethods}
                    onOptionChange={(method) =>
                        handleFilterChange('processingMethods', method)
                    }
                />

                <FilterSection
                    title='Вкус кофе:'
                    type='checkbox'
                    options={availableFilters.tasteTags}
                    selectedOptions={filters.tasteTags}
                    onOptionChange={(tag) =>
                        handleFilterChange('tasteTags', tag)
                    }
                />

                <FilterSection
                    title='Поставщик:'
                    type='checkbox'
                    options={availableFilters.suppliers}
                    selectedOptions={filters.suppliers}
                    onOptionChange={(supplier) =>
                        handleFilterChange('suppliers', supplier)
                    }
                />

                <FilterSection
                    title='Континент:'
                    type='checkbox'
                    options={availableFilters.continents}
                    selectedOptions={filters.continents}
                    onOptionChange={(continent) =>
                        handleFilterChange('continents', continent)
                    }
                />

                <Button onClick={clearFilters}>Очистить фильтры</Button>
            </div>
        </aside>
    );

    const guestHeader = (
        <header className={cn(headerStyles.header)}>
            <div className={cn(headerStyles.headerLeft)}>
                <Link to='/' className={cn(headerStyles.logo)}>
                    <span className={cn(headerStyles.logoIcon)}>
                        <Logo />
                    </span>
                    <h2 className={cn(headerStyles.logoText)}>
                        {data.shop.name}
                    </h2>
                </Link>
            </div>
        </header>
    );

    return (
        <>
            {guestHeader}
            <AppLayout
                showShopContainer={false}
                title={`Карта кофе - ${data.shop.name}`}
                sidebar={sidebar}
            >
                <div className={styles.mapContainer}>
                    <div className={styles.searchContainer}>
                        <Input
                            type='text'
                            placeholder='Найти страну...'
                            value={filters.searchQuery || ''}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            search
                        />
                    </div>
                    <div style={{ cursor: 'pointer' }}>
                        <ComposableMap
                            projectionConfig={{
                                scale: 147,
                            }}
                            className={styles.map}
                        >
                            <ZoomableGroup>
                                <Geographies geography={geoUrl}>
                                    {({ geographies }) =>
                                        geographies.map((geo) => {
                                            const hasMarkers =
                                                data.markers.some(
                                                    (marker) =>
                                                        marker.CoffeeLot.Region
                                                            .Country.name ===
                                                        geo.properties.NAME
                                                );

                                            return (
                                                <Geography
                                                    key={geo.rsmKey}
                                                    geography={geo}
                                                    onClick={() =>
                                                        handleGeographyClick(
                                                            geo
                                                        )
                                                    }
                                                    className={`${styles.geography} ${
                                                        hasMarkers
                                                            ? styles.hasMarkers
                                                            : ''
                                                    }`}
                                                />
                                            );
                                        })
                                    }
                                </Geographies>
                                {filteredMarkers.map((marker) => (
                                    <g key={marker.markerID}>
                                        <Marker
                                            coordinates={[
                                                marker.longitude || 0,
                                                marker.latitude || 0,
                                            ]}
                                            className={styles.marker}
                                            onMouseEnter={handleMarkerMouseEnter(
                                                marker.markerID
                                            )}
                                            onMouseMove={handleMarkerMouseMove}
                                            onMouseLeave={handleMarkerMouseLeave(
                                                marker.markerID
                                            )}
                                            onClick={() =>
                                                navigate(
                                                    `/coffee-lots/${marker.lotID}`
                                                )
                                            }
                                        >
                                            <circle
                                                r={markerSize}
                                                className={styles.markerCircle}
                                            />
                                        </Marker>
                                    </g>
                                ))}
                            </ZoomableGroup>
                        </ComposableMap>
                        {hoveredMarkerID !== null &&
                            popupPosition &&
                            (() => {
                                const marker = filteredMarkers.find(
                                    (m) => m.markerID === hoveredMarkerID
                                );
                                if (!marker) return null;
                                return (
                                    <div
                                        className={styles.markerPopup}
                                        style={{
                                            position: 'fixed',
                                            left: popupPosition.x + 16,
                                            top: popupPosition.y - 40,
                                            zIndex: 1000,
                                            pointerEvents: 'none',
                                        }}
                                    >
                                        <img
                                            src={
                                                marker.CoffeeLot.image
                                                    ? `/images/${marker.CoffeeLot.image}`
                                                    : '/images/placeholder.png'
                                            }
                                            alt={marker.CoffeeLot.name || ''}
                                            className={styles.markerPopupImage}
                                        />
                                        <div className={styles.markerPopupInfo}>
                                            <div
                                                className={
                                                    styles.markerPopupName
                                                }
                                                style={{
                                                    pointerEvents: 'auto',
                                                }}
                                                onClick={() =>
                                                    navigate(
                                                        `/coffee-lots/${marker.lotID}`
                                                    )
                                                }
                                                tabIndex={0}
                                                role='button'
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter')
                                                        navigate(
                                                            `/coffee-lots/${marker.lotID}`
                                                        );
                                                }}
                                            >
                                                {marker.CoffeeLot.name}
                                            </div>
                                            <div
                                                className={
                                                    styles.markerPopupRoasting
                                                }
                                            >
                                                под{' '}
                                                {
                                                    marker.CoffeeLot.Roasting
                                                        ?.name
                                                }
                                            </div>
                                            <div
                                                className={
                                                    styles.markerPopupTasteTitle
                                                }
                                            >
                                                Вкусовые ноты:{' '}
                                                <span
                                                    className={
                                                        styles.markerPopupTaste
                                                    }
                                                >
                                                    {
                                                        marker.CoffeeLot
                                                            .tasteFilter
                                                    }
                                                </span>
                                            </div>
                                            <div
                                                className={
                                                    styles.markerPopupStock
                                                }
                                            >
                                                В наличии: {marker.stock} шт.
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                    </div>
                </div>
            </AppLayout>
        </>
    );
};

export default GuestInventory;
