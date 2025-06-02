import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import necessary hooks and contexts
import { useShop } from '../../contexts';
import { useAuth } from '../../contexts'; // Assuming auth context might be needed for filters or other logic

// Import styles - assuming shared styles or adapting CoffeeMap styles
import styles from '../CoffeeMap/CoffeeMap.module.css'; // Reusing or adapting styles from CoffeeMap

// Define interface for CoffeeLot data received from backend
interface CoffeeLot {
  coffeeLotID: number;
  name: string;
  roasting: string; // Assuming this comes from a related table/field
  weight: string | null; // Updated based on backend response format
  supplier: string; // Assuming this comes from a related table/field
  imageFilename: string | null; // Assuming this field exists in the coffee_lot table
}

// Define interface for filters, similar to CoffeeMap but for coffee lots
interface Filters {
  roastingTypes: string[];
  processingMethods: string[];
  tasteTags: string[];
  supplierQuery: string; // Quick search for supplier
  generalSearchQuery: string; // General quick search
}

export const Catalog: React.FC = () => {
  // State and context hooks, similar to CoffeeMap
  const { shops, currentShop, setCurrentShop, refreshShops } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [coffeeLots, setCoffeeLots] = useState<CoffeeLot[]>([]);
  const [filteredCoffeeLots, setFilteredCoffeeLots] = useState<CoffeeLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // State for sidebar expansion

  // State for filters, similar to CoffeeMap but specific to coffee lots
  const [filters, setFilters] = useState<Filters>({
    roastingTypes: [],
    processingMethods: [],
    tasteTags: [],
    supplierQuery: '',
    generalSearchQuery: '',
  });

  // Placeholder for available filter options - will need to fetch from backend or derive from data
  const [availableFilters, setAvailableFilters] = useState({
    roastingTypes: [] as string[],
    processingMethods: [] as string[],
    tasteTags: [] as string[],
    // Suppliers might be derived or fetched separately
  });

  // Fetch coffee lots data on component mount or user change
  useEffect(() => {
    const fetchCoffeeLots = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/coffee-lots', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
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
        setFilteredCoffeeLots(data); // Initially, filtered list is the same as the full list

        // TODO: Fetch or derive available filter options from the fetched data
        // For now, using placeholder data or assuming these are available globally
        // setAvailableFilters({ ... });

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
  }, [user]); // Depend on user to refetch if login status changes

  // Effect to apply filters whenever coffeeLots or filters change
  useEffect(() => {
    let filtered = coffeeLots;

    // Apply roasting type filter
    if (filters.roastingTypes.length > 0) {
      filtered = filtered.filter(lot =>
        filters.roastingTypes.includes(lot.roasting),
      );
    }

    // Apply processing method filter - Placeholder, as processing method is not in current CoffeeLot interface
    // if (filters.processingMethods.length > 0) {
    //   filtered = filtered.filter(lot =>
    //     filters.processingMethods.includes(lot.processingMethod)
    //   );
    // }

    // Apply taste tags filter - Placeholder, as taste tags are not in current CoffeeLot interface
    // if (filters.tasteTags.length > 0) {
    //   filtered = filtered.filter(lot =>
    //     lot.tasteTags?.some(tag => filters.tasteTags.includes(tag))
    //   );
    // }

    // Apply supplier search filter
    if (filters.supplierQuery) {
      const query = filters.supplierQuery.toLowerCase();
      filtered = filtered.filter(lot =>
        lot.supplier.toLowerCase().includes(query),
      );
    }

    // Apply general quick search filter (e.g., by name)
    if (filters.generalSearchQuery) {
      const query = filters.generalSearchQuery.toLowerCase();
      filtered = filtered.filter(lot =>
        lot.name.toLowerCase().includes(query),
      );
    }

    setFilteredCoffeeLots(filtered);
  }, [coffeeLots, filters]); // Depend on coffeeLots and filters

  // Handler for filter changes
  const handleFilterChange = (
    filterType: keyof Omit<Filters, 'supplierQuery' | 'generalSearchQuery'>,
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

  // Handler for supplier search input change
  const handleSupplierSearchChange = (query: string): void => {
    setFilters(prev => ({
      ...prev,
      supplierQuery: query,
    }));
  };

  // Handler for general quick search input change
  const handleGeneralSearchChange = (query: string): void => {
    setFilters(prev => ({
      ...prev,
      generalSearchQuery: query,
    }));
  };

  // Add clearFilters function
  const clearFilters = (): void => {
    setFilters({
      roastingTypes: [],
      processingMethods: [],
      tasteTags: [],
      supplierQuery: '',
      generalSearchQuery: '',
    });
  };

  // State for success popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handler to add coffee lot to inventory
  const handleAddToInventory = async (coffeeLotID: number) => {
    if (!currentShop) {
      // Optionally show an error or prompt the user to select a shop
      alert('Пожалуйста, выберите кофейню сначала.');
      return;
    }

    try {
      // Assuming an endpoint like /api/shops/:shopID/inventory to add items
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/shops/${currentShop.shopID}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ coffeeLotID, quantity: 1 }), // Assuming quantity is always 1 for each click
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to inventory');
      }

      // Item added successfully
      setSuccessMessage('Кофе добавлен в инвентарь!');
      setShowSuccessPopup(true);

      // Hide popup after a few seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        setSuccessMessage('');
      }, 3000);

    } catch (error: any) {
      console.error('Error adding to inventory:', error);
      // Optionally show an error message to the user
      alert('Ошибка при добавлении в инвентарь: ' + error.message);
    }
  };

  // Render loading or error state
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
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}> {/* Main container with flex display */}
      <div
        className={styles.sidebar} // Apply sidebar styles
        style={{
          width: isSidebarExpanded ? 300 : 60,
          transition: 'width 0.2s',
          overflowY: 'auto',
          maxHeight: '100vh',
          overflowX: 'hidden',
        }} // Apply dynamic width and overflow styles
      >
        {/* Sidebar content - similar to CoffeeMap */}
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, marginLeft: 4 }}
          onClick={() => setIsSidebarExpanded(exp => !exp)}
          aria-label={isSidebarExpanded ? 'Свернуть' : 'Развернуть'}
        >
          <span style={{ fontSize: 24 }}>{isSidebarExpanded ? '←' : '→'}</span>
        </button>

        {/* Always render shops section, but adjust styling when collapsed */}
        <div style={{ marginBottom: isSidebarExpanded ? 24 : 0, overflow: 'hidden' }}>{/* Adjust margin and hide overflow */}
          {isSidebarExpanded && ( // Conditionally render shops list only when expanded
            <div style={{ marginBottom: 12 }}> {/* Add back a div for shops list when expanded */}
              {shops.map(shop => (
                <div
                  key={shop.shopID}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12, // Fixed gap when expanded
                    marginBottom: 8,
                    cursor: 'pointer',
                    background: currentShop?.shopID === shop.shopID ? 'rgba(255,255,255,0.1)' : 'transparent',
                    borderRadius: 8,
                    padding: 4, // Fixed padding when expanded
                  }}
                  onClick={() => setCurrentShop(shop)}
                >
                  <div
                    style={{
                      width: 36, // Fixed size when expanded
                      height: 36, // Fixed size when expanded
                      borderRadius: '50%',
                      background: shop.theme === 'beige' ? '#8b6a4a' : shop.theme === 'purple' ? '#6c4a8b' : '#4a6a8b',
                      backgroundImage: shop.image ? `url(${shop.image})` : undefined,
                      backgroundSize: 'cover',
                      border: currentShop?.shopID === shop.shopID ? '2px solid #fff' : '2px solid #ccc',
                    }}
                  />
                  <span style={{ color: '#3c1f0c', fontWeight: 500 }}>{shop.name}</span>
                </div>
              ))}
               {shops.length < 3 && ( // Conditionally render add shop button when expanded
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}> {/* Fixed gap and alignment */}
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
                  // onClick={handleAddShop} // Need to implement or adapt handleAddShop for catalog page if needed
                >
                  +
                </button>
                <span style={{ color: '#3c1f0c' }}>Добавить ещё</span>
              </div>
            )}
            </div>
          )}
           {!isSidebarExpanded && ( // Render shops icons only when collapsed
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}> {/* Column layout for collapsed icons */}
               {shops.map(shop => (
                 <div
                   key={shop.shopID}
                   style={{
                     width: 40, // Larger size for collapsed icon
                     height: 40, // Larger size for collapsed icon
                     borderRadius: '50%',
                     background: shop.theme === 'beige' ? '#8b6a4a' : shop.theme === 'purple' ? '#6c4a8b' : '#4a6a8b',
                     backgroundImage: shop.image ? `url(${shop.image})` : undefined,
                     backgroundSize: 'cover',
                     border: currentShop?.shopID === shop.shopID ? '2px solid #fff' : '2px solid #ccc',
                     marginBottom: 8, // Margin between icons
                     cursor: 'pointer',
                   }}
                   onClick={() => setCurrentShop(shop)}
                   title={shop.name} // Show shop name on hover
                 />
               ))}
                {shops.length < 3 && (
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 24, border: '2px dashed #fff', cursor: 'pointer', marginTop: 8 }}>
                    <button
                      style={{ background: 'none', border: 'none', color: '#fff', fontSize: 'inherit', cursor: 'pointer' }}
                       title={'Добавить кофейню'}
                      // onClick={handleAddShop}
                    >
                      +
                    </button>
                  </div>
                )}
             </div>
           )}
        </div>

        {/* Filters Section - Always render container, hide content when collapsed */}
        <div className={styles.filters}> {/* Apply filters section styles */}
          <h3 className={styles.filterTitle}>Фильтры</h3>

          {/* Quick Search Input */}
          <div className={styles.searchContainer}>
            <input
              type='text'
              placeholder='Быстрый поиск...'
              value={filters.generalSearchQuery}
              onChange={e => handleGeneralSearchChange(e.target.value)}
              className={styles.searchInput}
            />
          </div>

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
              {availableFilters.processingMethods.map(method => (
                <label key={method} className={styles.filterOption}>
                  <input
                    type='checkbox'
                    checked={filters.processingMethods.includes(method)}
                    onChange={() => handleFilterChange('processingMethods', method)}
                  />
                  <span>{method}</span>
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
                value={filters.supplierQuery}
                onChange={e => handleSupplierSearchChange(e.target.value)}
                className={styles.supplierInput}
              />
            </div>
          </div>

          <button onClick={clearFilters} className={styles.clearButton}>
            Очистить фильтры
          </button>
        </div>
      </div>

      {/* Main content area - display coffee lot grid */}
      <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}> {/* Main content area styles */}
        <h2 style={{ color: '#3c1f0c', marginBottom: '20px' }}>Каталог зерен</h2> {/* Catalog title */}

        {/* Coffee Lot Grid Display */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {filteredCoffeeLots.map(lot => (
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
            >
              {/* Image */}
              {lot.imageFilename && (
                <img
                  src={`/src/assets/images/${lot.imageFilename}`}
                  alt={lot.name}
                  style={{ width: '100%', height: '150px', objectFit: 'contain', borderRadius: '4px', marginBottom: '10px', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                  onClick={() => navigate(`/coffee-lots/${lot.coffeeLotID}`)}
                  onKeyDown={e => { if (e.key === 'Enter') navigate(`/coffee-lots/${lot.coffeeLotID}`); }}
                  tabIndex={0}
                  className={styles.coffeeLotImage}
                />
              )}
              {/* Info */}
              <h4
                style={{ marginBottom: '5px', color: '#3c1f0c', cursor: 'pointer', textDecoration: 'none', transition: 'text-decoration 0.2s' }}
                onClick={() => navigate(`/coffee-lots/${lot.coffeeLotID}`)}
                onKeyDown={e => { if (e.key === 'Enter') navigate(`/coffee-lots/${lot.coffeeLotID}`); }}
                tabIndex={0}
                className={styles.coffeeLotName}
              >
                {lot.name}
              </h4>
              <div style={{ fontSize: '0.9em', color: '#555', marginBottom: '5px' }}>
                <span>под {lot.roasting}</span>
                {lot.weight && <span> - {lot.weight}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9em', color: '#555' }}>
                {/* Hardcoded supplier colors - ideally these would come from the backend */}
                {lot.supplier === 'Tasty Coffee' && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#9747FF', marginRight: '5px' }}></div>
                )}
                {lot.supplier === 'East Brew' && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2BB22B', marginRight: '5px' }}></div>
                )}
                {lot.supplier === 'West 4' && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F68420', marginRight: '5px' }}></div>
                )}
                <span>{lot.supplier}</span>
              </div>
              {/* Add to Inventory Button */}
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
                  opacity: 0,
                  transition: 'opacity 0.2s ease-in-out',
                }}
                className={styles.addToInventoryButton}
                onClick={() => handleAddToInventory(lot.coffeeLotID)}
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className={styles.successPopup}>
          {successMessage}
        </div>
      )}
    </div>
  );
};
