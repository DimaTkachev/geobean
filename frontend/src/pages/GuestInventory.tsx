import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import type { CoffeeLotDTO } from '../types/dtos';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker as MapMarker,
  ZoomableGroup,
} from 'react-simple-maps';
import styles from '../components/CoffeeMap/CoffeeMap.module.css';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface GuestLot {
  lotID: number;
  name: string;
  image: string | null;
  region: string;
  country: string;
  continent: string;
  roasting: string;
  processingMethod: string;
  tasteTags: string[];
  tasteFilter: string | null;
  latitude: number | null;
  longitude: number | null;
}

const GuestInventory: React.FC = () => {
  const { shareUrl } = useParams<{ shareUrl: string }>();
  const [shop, setShop] = useState<{ name: string; theme: string } | null>(null);
  const [lots, setLots] = useState<GuestLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    continents: [] as string[],
    roastingTypes: [] as string[],
    processingMethods: [] as string[],
    tasteTags: [] as string[],
    searchQuery: '',
  });
  const [availableFilters, setAvailableFilters] = useState({
    continents: [] as string[],
    roastingTypes: [] as string[],
    processingMethods: [] as string[],
    tasteTags: [] as string[],
  });
  const [filteredLots, setFilteredLots] = useState<GuestLot[]>([]);
  const [hoveredLotID, setHoveredLotID] = useState<number | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!shareUrl) return;
    setLoading(true);
    setError(null);
    fetch(`/api/shops/guest-inventory/${shareUrl}`)
      .then(res => {
        if (!res.ok) throw new Error('Магазин не найден или недоступен');
        return res.json();
      })
      .then(async data => {
        setShop(data.shop);
        // Fetch lot details for each lotID
        const lotDetails = await Promise.all(
          (data.inventory || []).map(async (item: { lotID: number }) => {
            const lot = await fetchApi<any>(`/api/coffee-lots/${item.lotID}`);
            // Fetch marker for coordinates
            const allMarkers: any[] = await fetchApi<any[]>('/api/map/all');
            const marker = allMarkers.find(m => m.lotID === lot.lotID);
            return {
              lotID: lot.lotID,
              name: lot.name,
              image: lot.image,
              region: lot.region,
              country: lot.country,
              continent: lot.continent,
              roasting: lot.roasting,
              processingMethod: lot.processingMethod,
              tasteTags: lot.tasteTags,
              tasteFilter: lot.tasteFilter || (lot.flavorNotes ? lot.flavorNotes.join(', ') : ''),
              latitude: marker?.latitude || null,
              longitude: marker?.longitude || null,
            };
          })
        );
        setLots(lotDetails);
      })
      .catch(e => setError(e.message || 'Ошибка'))
      .finally(() => setLoading(false));
  }, [shareUrl]);

  useEffect(() => {
    setAvailableFilters({
      continents: Array.from(new Set(lots.map(lot => lot.continent).filter(Boolean))),
      roastingTypes: Array.from(new Set(lots.map(lot => lot.roasting).filter(Boolean))),
      processingMethods: Array.from(new Set(lots.map(lot => lot.processingMethod).filter(Boolean))),
      tasteTags: Array.from(new Set(lots.flatMap(lot => lot.tasteTags || []))),
    });
  }, [lots]);

  useEffect(() => {
    let filtered = lots;
    if (filters.continents.length > 0) {
      filtered = filtered.filter(lot => filters.continents.includes(lot.continent));
    }
    if (filters.roastingTypes.length > 0) {
      filtered = filtered.filter(lot => filters.roastingTypes.includes(lot.roasting));
    }
    if (filters.processingMethods.length > 0) {
      filtered = filtered.filter(lot => filters.processingMethods.includes(lot.processingMethod));
    }
    if (filters.tasteTags.length > 0) {
      filtered = filtered.filter(lot => lot.tasteTags && lot.tasteTags.some(tag => filters.tasteTags.includes(tag)));
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(lot =>
        lot.name?.toLowerCase().includes(q) ||
        lot.region?.toLowerCase().includes(q) ||
        lot.country?.toLowerCase().includes(q)
      );
    }
    setFilteredLots(filtered);
  }, [filters, lots]);

  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleMarkerMouseEnter = (lotID: number) => (e: React.MouseEvent) => {
    setHoveredLotID(lotID);
    setPopupPosition({ x: e.clientX, y: e.clientY });
  };
  const handleMarkerMouseMove = (e: React.MouseEvent) => {
    setPopupPosition({ x: e.clientX, y: e.clientY });
  };
  const handleMarkerMouseLeave = (lotID: number) => () => {
    setHoveredLotID(id => (id === lotID ? null : id));
    setPopupPosition(null);
  };

  const clearFilters = () => {
    setFilters({
      continents: [],
      roastingTypes: [],
      processingMethods: [],
      tasteTags: [],
      searchQuery: '',
    });
  };

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Загрузка карты...</div></div>;
  }
  if (error) {
    return <div className={styles.container}><div className={styles.error}>{error}</div></div>;
  }

  return (
    <div className={styles.container}>
      <aside
        className={styles.sidebar}
        style={{
          width: isSidebarExpanded ? 300 : 66,
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
          <span style={{ fontSize: 24, color: '#8b6a4a' }}>{isSidebarExpanded ? '←' : '→'}</span>
        </button>
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
                <label key={type} className={styles.filterOption}>
                  <input
                    type='checkbox'
                    checked={filters.roastingTypes.includes(type)}
                    onChange={() => handleFilterChange('roastingTypes', type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
          <div className={styles.filterSection}>
            <h4 className={styles.filterSubtitle}>Способ обработки:</h4>
            <div className={styles.filterOptions}>
              {availableFilters.processingMethods.map(type => (
                <label key={type} className={styles.filterOption}>
                  <input
                    type='checkbox'
                    checked={filters.processingMethods.includes(type)}
                    onChange={() => handleFilterChange('processingMethods', type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
          <div className={styles.filterSection}>
            <h4 className={styles.filterSubtitle}>Вкус кофе:</h4>
            <div className={styles.filterOptions}>
              {availableFilters.tasteTags.map(tag => (
                <label key={tag} className={styles.filterOption}>
                  <input
                    type='checkbox'
                    checked={filters.tasteTags.includes(tag)}
                    onChange={() => handleFilterChange('tasteTags', tag)}
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
                disabled
              />
            </div>
          </div>
          <div className={styles.filterSection}>
            <h4 className={styles.filterSubtitle}>Континент:</h4>
            <div className={styles.filterOptions}>
              {availableFilters.continents.map(continent => (
                <label key={continent} className={styles.filterOption}>
                  <input
                    type='checkbox'
                    checked={filters.continents.includes(continent)}
                    onChange={() => handleFilterChange('continents', continent)}
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
      </aside>
      <div className={styles.mapContainer}>
        <ComposableMap projectionConfig={{ scale: 147 }} className={styles.map}>
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    className={styles.geography}
                  />
                ))
              }
            </Geographies>
            {filteredLots.map(lot => (
              lot.latitude && lot.longitude && (
                <MapMarker
                  key={lot.lotID}
                  coordinates={[lot.longitude, lot.latitude]}
                  className={styles.marker}
                  onMouseEnter={handleMarkerMouseEnter(lot.lotID)}
                  onMouseMove={handleMarkerMouseMove}
                  onMouseLeave={handleMarkerMouseLeave(lot.lotID)}
                  onClick={() => navigate(`/coffee-lots/${lot.lotID}`)}
                >
                  <circle r={10} className={styles.markerCircle} />
                </MapMarker>
              )
            ))}
          </ZoomableGroup>
        </ComposableMap>
        {hoveredLotID !== null && popupPosition && (() => {
          const lot = filteredLots.find(l => l.lotID === hoveredLotID);
          if (!lot) return null;
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
                src={lot.image ? `/images/${lot.image}` : '/images/placeholder.png'}
                alt={lot.name || ''}
                className={styles.markerPopupImage}
              />
              <div className={styles.markerPopupInfo}>
                <div
                  className={styles.markerPopupName}
                  style={{ pointerEvents: 'auto' }}
                  onClick={() => navigate(`/coffee-lots/${lot.lotID}`)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => { if (e.key === 'Enter') navigate(`/coffee-lots/${lot.lotID}`); }}
                >
                  {lot.name}
                </div>
                <div className={styles.markerPopupRoasting}>под {lot.roasting}</div>
                <div className={styles.markerPopupTasteTitle}>Вкусовые ноты:</div>
                <div className={styles.markerPopupTaste}>{lot.tasteFilter}</div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default GuestInventory;