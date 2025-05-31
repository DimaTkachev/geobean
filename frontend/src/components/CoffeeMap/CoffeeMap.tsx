import React, { useState, useEffect } from 'react';
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup,
} from 'react-simple-maps';
import { fetchApi } from '../../utils/api';
import type {
    MarkerDTO,
    CoffeeLotDTO,
    RegionDTO,
    CountryDTO,
    ContinentDTO,
    RoastingDTO,
    ProcessingMethodDTO,
    TasteTagDTO,
    WeightDTO,
} from '../../types/dtos';
import styles from './CoffeeMap.module.css';

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
        TasteTags: TasteTagDTO[];
    };
}

interface Filters {
    continents: string[];
    roastingTypes: string[];
    processingMethods: string[];
    tasteTags: string[];
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
        searchQuery: '',
    });

    const [availableFilters, setAvailableFilters] = useState({
        continents: [] as string[],
        roastingTypes: [] as string[],
        processingMethods: [] as string[],
        tasteTags: [] as string[],
    });

    useEffect(() => {
        const fetchMarkers = async () => {
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

                setAvailableFilters({
                    continents,
                    roastingTypes,
                    processingMethods,
                    tasteTags,
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
    }, [filters, markers]);

    const handleFilterChange = (filterType: keyof Filters, value: string) => {
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

    const handleSearchChange = (query: string) => {
        setFilters((prev) => ({
            ...prev,
            searchQuery: query,
        }));
    };

    const handleGeographyClick = (geo: any) => {
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

    const clearFilters = () => {
        setFilters({
            continents: [],
            roastingTypes: [],
            processingMethods: [],
            tasteTags: [],
            searchQuery: '',
        });
        setSelectedContinent(null);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Загрузка карты...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Карта мира</h2>
                    <div className={styles.searchContainer}>
                        <input
                            type='text'
                            placeholder='Найти страну...'
                            value={filters.searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                <div className={styles.filters}>
                    <h3 className={styles.filterTitle}>Фильтры</h3>

                    <div className={styles.filterSection}>
                        <h4 className={styles.filterSubtitle}>Тип зерна:</h4>
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
                        <h4 className={styles.filterSubtitle}>Вкус кофе:</h4>
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
                                            handleFilterChange('tasteTags', tag)
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
                                            handleFilterChange(
                                                'continents',
                                                continent
                                            )
                                        }
                                    />
                                    <span>{continent}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={clearFilters}
                        className={styles.clearButton}
                    >
                        Очистить фильтры
                    </button>
                </div>
            </div>

            <div className={styles.mapContainer}>
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
                                            marker.CoffeeLot.Region.Country
                                                .name === geo.properties.NAME
                                    );

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            onClick={() =>
                                                handleGeographyClick(geo)
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
                            <Marker
                                key={marker.markerID}
                                coordinates={[
                                    marker.longitude || 0,
                                    marker.latitude || 0,
                                ]}
                                className={styles.marker}
                            >
                                <circle r={6} className={styles.markerCircle} />
                                <title>
                                    {marker.CoffeeLot.name ||
                                        'Безымянная партия'}{' '}
                                    - {marker.CoffeeLot.Region.Country.name}
                                </title>
                            </Marker>
                        ))}
                    </ZoomableGroup>
                </ComposableMap>
            </div>
        </div>
    );
};
