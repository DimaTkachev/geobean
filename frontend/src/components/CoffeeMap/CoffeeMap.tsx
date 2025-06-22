import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup,
} from 'react-simple-maps';

import { fetchApi, debouncedFetch } from '@utils/api';
import { useShop, useAuth } from '@contexts/index';

import styles from './CoffeeMap.module.css';

import type {
    CoffeeLotDTO,
    ContinentDTO,
    CountryDTO,
    MarkerDTO,
    ProcessingMethodDTO,
    RegionDTO,
    RoastingDTO,
    SupplierDTO,
    TasteTagDTO,
    WeightDTO,
} from '../../types/dtos';
import { CoffeeMapSidebar } from './CoffeeMapSidebar';
import { Input } from '@components/Input';
import { ShopContainer } from '@components/ShopContainer';
import { Loader } from '../Loader';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface CoffeeMarker extends MarkerDTO {
    CoffeeLot: CoffeeLotDTO & {
        Region: RegionDTO & {
            Country: CountryDTO & {
                Continent: ContinentDTO;
            };
        };
        Roasting: RoastingDTO;
        ProcessingMethod: ProcessingMethodDTO;
        Weight: WeightDTO;
        Supplier: SupplierDTO;
        TasteTags: TasteTagDTO[];
    };
}

interface Filters {
    continents: string[];
    roastingTypes: string[];
    processingMethods: string[];
    tasteTags: string[];
    suppliers: string[];
    searchQuery: string;
}

export const CoffeeMap: React.FC = () => {
    const [markers, setMarkers] = useState<CoffeeMarker[]>([]);
    const [filteredMarkers, setFilteredMarkers] = useState<CoffeeMarker[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [, setSelectedContinent] = useState<string | null>(null);

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

    const { currentShop } = useShop();
    const navigate = useNavigate();
    const [hoveredMarkerID, setHoveredMarkerID] = useState<number | null>(null);
    const [popupPosition, setPopupPosition] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const { isAuthenticated } = useAuth();

    // Placeholder for inventory lotIDs for the current shop
    const [inventoryLotIDs, setInventoryLotIDs] = useState<number[] | null>(
        null
    );

    // Fetch inventory for current shop if authenticated
    useEffect(() => {
        if (isAuthenticated && currentShop && currentShop.shopID) {
            const token = localStorage.getItem('authToken');
            debouncedFetch(`/api/shops/${currentShop.shopID}/inventory`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    // data should be an array of inventory items with lotID
                    setInventoryLotIDs(
                        Array.isArray(data)
                            ? data.map((item) => item.lotID)
                            : []
                    );
                })
                .catch(() => setInventoryLotIDs([]));
        } else {
            setInventoryLotIDs(null);
        }
    }, [isAuthenticated, currentShop]);

    useEffect(() => {
        const fetchMarkers = async (): Promise<void> => {
            try {
                setLoading(true);
                const data = await fetchApi<CoffeeMarker[]>('/api/map/all');
                setMarkers(data);
                setFilteredMarkers(data);

                const continents = [
                    ...new Set(
                        data.map(
                            (m) => m.CoffeeLot.Region.Country.Continent.name
                        )
                    ),
                ];
                const roastingTypes = [
                    ...new Set(data.map((m) => m.CoffeeLot.Roasting.name)),
                ];
                const processingMethods = [
                    ...new Set(
                        data.map((m) => m.CoffeeLot.ProcessingMethod.name)
                    ),
                ];
                const tasteTags = [
                    ...new Set(
                        data.flatMap(
                            (m) =>
                                m.CoffeeLot.TasteTags?.map((tag) => tag.name) ||
                                []
                        )
                    ),
                ];
                const suppliers = [
                    ...new Set(data.map((m) => m.CoffeeLot.Supplier.name)),
                ];

                setAvailableFilters({
                    continents,
                    roastingTypes,
                    processingMethods,
                    tasteTags,
                    suppliers,
                });
            } catch (err) {
                setError('Ошибка загрузки данных карты');
                console.error('Error fetching markers:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMarkers();
    }, []);

    useEffect(() => {
        let filtered = markers;

        if (isAuthenticated && currentShop && currentShop.shopID) {
            if (inventoryLotIDs) {
                if (inventoryLotIDs.length === 0) {
                    filtered = [];
                } else {
                    filtered = filtered.filter((marker) =>
                        inventoryLotIDs.includes(marker.lotID)
                    );
                }
            }
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

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(
                (marker) =>
                    marker.CoffeeLot.name?.toLowerCase().includes(query) ||
                    marker.CoffeeLot.Region.name
                        .toLowerCase()
                        .includes(query) ||
                    marker.CoffeeLot.Region.Country.name
                        .toLowerCase()
                        .includes(query)
            );
        }

        setFilteredMarkers(filtered);
    }, [filters, markers, isAuthenticated, currentShop, inventoryLotIDs]);

    const handleFilterChange = (
        filterType: keyof Filters,
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

    const handleGeographyClick = (geo: {
        properties: { NAME: string };
    }): void => {
        const countryName = geo.properties.NAME;
        const marker = markers.find(
            (m) => m.CoffeeLot.Region.Country.name === countryName
        );

        if (marker) {
            const continentName =
                marker.CoffeeLot.Region.Country.Continent.name;
            setSelectedContinent(continentName);

            if (!filters.continents.includes(continentName)) {
                handleFilterChange('continents', continentName);
            }
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
        setSelectedContinent(null);
    };

    // Handler for marker mouse events
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

    if (loading) {
        return <Loader variant='container' />;
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    return (
        <section className={styles.coffeeMap}>
            <ShopContainer />
            <div className={styles.coffeeMapContent}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Карта мира</h2>
                </div>
                <div className={styles.container}>
                    <CoffeeMapSidebar
                        filters={filters}
                        availableFilters={availableFilters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={clearFilters}
                    />

                    <div className={styles.mapContainer}>
                        <div className={styles.searchContainer}>
                            <Input
                                type='text'
                                placeholder='Найти страну...'
                                value={filters.searchQuery}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
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
                                                const hasMarkers = markers.some(
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
                                                    marker.markerID || 0
                                                )}
                                                onMouseMove={
                                                    handleMarkerMouseMove
                                                }
                                                onMouseLeave={handleMarkerMouseLeave(
                                                    marker.markerID || 0
                                                )}
                                                onClick={() =>
                                                    navigate(
                                                        `/coffee-lots/${marker.lotID}`
                                                    )
                                                }
                                            >
                                                <circle
                                                    r={markerSize}
                                                    className={
                                                        styles.markerCircle
                                                    }
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
                                                alt={
                                                    marker.CoffeeLot.name || ''
                                                }
                                                className={
                                                    styles.markerPopupImage
                                                }
                                            />
                                            <div
                                                className={
                                                    styles.markerPopupInfo
                                                }
                                            >
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
                                                        marker.CoffeeLot
                                                            .Roasting?.name
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
                                            </div>
                                        </div>
                                    );
                                })()}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
