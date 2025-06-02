import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';

import { fetchApi } from '../../utils/api';
import { useShop } from '../../contexts';

import styles from './CoffeeMap.module.css';

import type {
  CoffeeLotDTO,
  ContinentDTO,
  CountryDTO,
  MarkerDTO,
  ProcessingMethodDTO,
  RegionDTO,
  RoastingDTO,
  TasteTagDTO,
  WeightDTO,
} from '../../types/dtos';
import { ShopModal } from './ShopModal';

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

  const { shops, currentShop, setCurrentShop, refreshShops } = useShop();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalShop, setModalShop] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const maxShops = 3;
  const navigate = useNavigate();
  const [hoveredMarkerID, setHoveredMarkerID] = useState<number | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

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
              m => m.CoffeeLot.Region.Country.Continent.name,
            ),
          ),
        ];
        const roastingTypes = [
          ...new Set(data.map(m => m.CoffeeLot.Roasting.name)),
        ];
        const processingMethods = [
          ...new Set(
            data.map(m => m.CoffeeLot.ProcessingMethod.name),
          ),
        ];
        const tasteTags = [
          ...new Set(
            data.flatMap(
              m =>
                m.CoffeeLot.TasteTags?.map(tag => tag.name) ||
                                [],
            ),
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
      filtered = filtered.filter(marker =>
        filters.continents.includes(
          marker.CoffeeLot.Region.Country.Continent.name,
        ),
      );
    }

    if (filters.roastingTypes.length > 0) {
      filtered = filtered.filter(marker =>
        filters.roastingTypes.includes(marker.CoffeeLot.Roasting.name),
      );
    }

    if (filters.processingMethods.length > 0) {
      filtered = filtered.filter(marker =>
        filters.processingMethods.includes(
          marker.CoffeeLot.ProcessingMethod.name,
        ),
      );
    }

    if (filters.tasteTags.length > 0) {
      filtered = filtered.filter(marker =>
        marker.CoffeeLot.TasteTags?.some(tag =>
          filters.tasteTags.includes(tag.name),
        ),
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        marker =>
          marker.CoffeeLot.name?.toLowerCase().includes(query) ||
                    marker.CoffeeLot.Region.name
                      .toLowerCase()
                      .includes(query) ||
                    marker.CoffeeLot.Region.Country.name
                      .toLowerCase()
                      .includes(query),
      );
    }

    setFilteredMarkers(filtered);
  }, [filters, markers]);

  const handleFilterChange = (
    filterType: keyof Filters,
    value: string,
  ): void => {
    setFilters(prev => {
      const currentValues = prev[filterType] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [filterType]: newValues,
      };
    });
  };

  const handleSearchChange = (query: string): void => {
    setFilters(prev => ({
      ...prev,
      searchQuery: query,
    }));
  };

  const handleGeographyClick = (geo: {
        properties: { NAME: string };
    }): void => {
    const countryName = geo.properties.NAME;
    const marker = markers.find(
      m => m.CoffeeLot.Region.Country.name === countryName,
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
      searchQuery: '',
    });
    setSelectedContinent(null);
  };

  const handleAddShop = () => {
    setModalMode('add');
    setModalShop(null);
    setModalOpen(true);
  };

  const handleEditShop = (shop: any) => {
    setModalMode('edit');
    setModalShop(shop);
    setModalOpen(true);
  };

  const handleModalApply = async (name: string, theme: 'beige' | 'purple' | 'blue') => {
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

  // Handler for marker mouse events
  const handleMarkerMouseEnter = (markerID: number) => (e: React.MouseEvent) => {
    setHoveredMarkerID(markerID);
    setPopupPosition({ x: e.clientX, y: e.clientY });
  };
  const handleMarkerMouseMove = (e: React.MouseEvent) => {
    setPopupPosition({ x: e.clientX, y: e.clientY });
  };
  const handleMarkerMouseLeave = (markerID: number) => () => {
    setHoveredMarkerID(id => (id === markerID ? null : id));
    setPopupPosition(null);
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
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, marginLeft: 4 }}
          onClick={() => setIsSidebarExpanded(exp => !exp)}
          aria-label={isSidebarExpanded ? 'Свернуть' : 'Развернуть'}
        >
          <span style={{ fontSize: 24 }}>{isSidebarExpanded ? '←' : '→'}</span>
        </button>
        <div style={{ marginBottom: 24 }}>
          {shops.map(shop => (
            <div
              key={shop.shopID}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isSidebarExpanded ? 12 : 0,
                marginBottom: 8,
                cursor: 'pointer',
                background: currentShop?.shopID === shop.shopID ? 'rgba(255,255,255,0.1)' : 'transparent',
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
                  background: shop.theme === 'beige' ? '#8b6a4a' : shop.theme === 'purple' ? '#6c4a8b' : '#4a6a8b',
                  backgroundImage: shop.image ? `url(${shop.image})` : undefined,
                  backgroundSize: 'cover',
                  border: currentShop?.shopID === shop.shopID ? '2px solid #fff' : '2px solid #ccc',
                }}
              />
              {isSidebarExpanded && <span style={{ color: '#fff', fontWeight: 500 }}>{shop.name}</span>}
              {isSidebarExpanded && (
                <button
                  onClick={e => { e.stopPropagation(); handleEditShop(shop); }}
                  style={{ background: 'none', border: 'none', marginLeft: 'auto', color: '#fff', cursor: 'pointer', fontSize: 14 }}
                  title="Редактировать"
                >
                  Ред.
                </button>
              )}
            </div>
          ))}
          {shops.length < maxShops && (
            <div style={{ display: 'flex', alignItems: 'center', gap: isSidebarExpanded ? 12 : 0, marginTop: 8 }}>
              <button
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: 24,
                  border: '2px dashed #fff',
                  cursor: 'pointer',
                }}
                title={'Добавить кофейню'}
                onClick={handleAddShop}
              >
                +
              </button>
              {isSidebarExpanded && <span style={{ color: '#fff' }}>Добавить ещё</span>}
            </div>
          )}
        </div>
        <div className={styles.header}>
          <h2 className={styles.title}>Карта мира</h2>
          <div className={styles.searchContainer}>
            <input
              type='text'
              placeholder='Найти страну...'
              value={filters.searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.filters}>
          <h3 className={styles.filterTitle}>Фильтры</h3>

          <div className={styles.filterSection}>
            <h4 className={styles.filterSubtitle}>Тип зерна:</h4>
            <div className={styles.filterOptions}>
              {availableFilters.roastingTypes.map(type => (
                <label
                  key={type}
                  className={styles.filterOption}
                >
                  <input
                    type='checkbox'
                    checked={filters.roastingTypes.includes(
                      type,
                    )}
                    onChange={() =>
                      handleFilterChange(
                        'roastingTypes',
                        type,
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
                method => (
                  <label
                    key={method}
                    className={styles.filterOption}
                  >
                    <input
                      type='checkbox'
                      checked={filters.processingMethods.includes(
                        method,
                      )}
                      onChange={() =>
                        handleFilterChange(
                          'processingMethods',
                          method,
                        )
                      }
                    />
                    <span>{method}</span>
                  </label>
                ),
              )}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h4 className={styles.filterSubtitle}>Вкус кофе:</h4>
            <div className={styles.filterOptions}>
              {availableFilters.tasteTags.map(tag => (
                <label
                  key={tag}
                  className={styles.filterOption}
                >
                  <input
                    type='checkbox'
                    checked={filters.tasteTags.includes(
                      tag,
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
              {availableFilters.continents.map(continent => (
                <label
                  key={continent}
                  className={styles.filterOption}
                >
                  <input
                    type='checkbox'
                    checked={filters.continents.includes(
                      continent,
                    )}
                    onChange={() =>
                      handleFilterChange(
                        'continents',
                        continent,
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
      </div>

      <div className={styles.mapContainer} style={{ cursor: 'pointer' }}>
        <ComposableMap
          projectionConfig={{
            scale: 147,
          }}
          className={styles.map}
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const hasMarkers = markers.some(
                    marker =>
                      marker.CoffeeLot.Region.Country
                        .name === geo.properties.NAME,
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
            {filteredMarkers.map(marker => (
              <g key={marker.markerID}>
                <Marker
                  coordinates={[
                    marker.longitude || 0,
                    marker.latitude || 0,
                  ]}
                  className={styles.marker}
                  onMouseEnter={handleMarkerMouseEnter(marker.markerID!)}
                  onMouseMove={handleMarkerMouseMove}
                  onMouseLeave={handleMarkerMouseLeave(marker.markerID!)}
                  onClick={() => navigate(`/coffee-lots/${marker.lotID}`)}
                >
                  <circle r={10} className={styles.markerCircle} />
                </Marker>
              </g>
            ))}
          </ZoomableGroup>
        </ComposableMap>
        {/* Render popup outside SVG for correct positioning */}
        {hoveredMarkerID !== null && popupPosition && (() => {
          const marker = filteredMarkers.find(m => m.markerID === hoveredMarkerID);
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
                src={marker.CoffeeLot.image ? `/images/${marker.CoffeeLot.image}` : '/images/placeholder.png'}
                alt={marker.CoffeeLot.name || ''}
                className={styles.markerPopupImage}
              />
              <div className={styles.markerPopupInfo}>
                <div
                  className={styles.markerPopupName}
                  style={{ pointerEvents: 'auto' }}
                  onClick={() => navigate(`/coffee-lots/${marker.lotID}`)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => { if (e.key === 'Enter') navigate(`/coffee-lots/${marker.lotID}`); }}
                >
                  {marker.CoffeeLot.name}
                </div>
                <div className={styles.markerPopupRoasting}>под {marker.CoffeeLot.Roasting?.name}</div>
                <div className={styles.markerPopupTasteTitle}>Вкусовые ноты:</div>
                <div className={styles.markerPopupTaste}>{marker.CoffeeLot.tasteFilter}</div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
