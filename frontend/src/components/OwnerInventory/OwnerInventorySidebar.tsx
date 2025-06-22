import React from 'react';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { FilterSection } from '@components/CoffeeMap/FilterSection';
import styles from './OwnerInventorySidebar.module.css';

interface Filters {
    continents: string[];
    roastingTypes: string[];
    processingMethods: string[];
    tasteTags: string[];
    suppliers: string[];
    searchQuery: string;
    stockFilter: 'all' | 'inStock' | 'outOfStock' | 'lowStock';
}

interface AvailableFilters {
    continents: string[];
    roastingTypes: string[];
    processingMethods: string[];
    tasteTags: string[];
    suppliers: string[];
}

interface OwnerInventorySidebarProps {
    filters: Filters;
    availableFilters: AvailableFilters;
    onFilterChange: (
        filterType: keyof Omit<Filters, 'searchQuery' | 'stockFilter'>,
        value: string
    ) => void;
    onSearchChange: (query: string) => void;
    onStockFilterChange: (filter: Filters['stockFilter']) => void;
    onClearFilters: () => void;
}

const StockFilterSection: React.FC<{
    stockFilter: Filters['stockFilter'];
    onStockFilterChange: (filter: Filters['stockFilter']) => void;
}> = ({ stockFilter, onStockFilterChange }) => (
    <div className={styles.stockFilterSection}>
        <h4 className={styles.filterSubtitle}>Наличие на складе:</h4>
        <div className={styles.radioGroup}>
            <label className={styles.radioOption}>
                <input
                    type='radio'
                    value='all'
                    checked={stockFilter === 'all'}
                    onChange={() => onStockFilterChange('all')}
                />
                <span>Все товары</span>
            </label>
            <label className={styles.radioOption}>
                <input
                    type='radio'
                    value='inStock'
                    checked={stockFilter === 'inStock'}
                    onChange={() => onStockFilterChange('inStock')}
                />
                <span>В наличии</span>
            </label>
            <label className={styles.radioOption}>
                <input
                    type='radio'
                    value='lowStock'
                    checked={stockFilter === 'lowStock'}
                    onChange={() => onStockFilterChange('lowStock')}
                />
                <span>Заканчивается (≤ 5)</span>
            </label>
            <label className={styles.radioOption}>
                <input
                    type='radio'
                    value='outOfStock'
                    checked={stockFilter === 'outOfStock'}
                    onChange={() => onStockFilterChange('outOfStock')}
                />
                <span>Закончился</span>
            </label>
        </div>
    </div>
);

export const OwnerInventorySidebar: React.FC<OwnerInventorySidebarProps> = ({
    filters,
    availableFilters,
    onFilterChange,
    onSearchChange,
    onStockFilterChange,
    onClearFilters,
}) => (
    <aside className={styles.sidebar}>
        <div className={styles.filters}>
            <h3 className={styles.filterTitle}>Фильтры</h3>

            <div className={styles.searchContainer}>
                <Input
                    type='text'
                    placeholder='Поиск по инвентарю...'
                    value={filters.searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    width='full'
                    search
                />
            </div>

            <StockFilterSection
                stockFilter={filters.stockFilter}
                onStockFilterChange={onStockFilterChange}
            />

            <FilterSection
                key={`roasting-${availableFilters.roastingTypes.length}-${availableFilters.roastingTypes.join(',')}`}
                title='Тип обжарки:'
                type='checkbox'
                options={availableFilters.roastingTypes}
                selectedOptions={filters.roastingTypes}
                onOptionChange={(option) =>
                    onFilterChange('roastingTypes', option)
                }
            />

            <FilterSection
                key={`processing-${availableFilters.processingMethods.length}-${availableFilters.processingMethods.join(',')}`}
                title='Способ обработки:'
                type='checkbox'
                options={availableFilters.processingMethods}
                selectedOptions={filters.processingMethods}
                onOptionChange={(option) =>
                    onFilterChange('processingMethods', option)
                }
            />

            <FilterSection
                key={`taste-${availableFilters.tasteTags.length}-${availableFilters.tasteTags.join(',')}`}
                title='Вкус кофе:'
                type='checkbox'
                options={availableFilters.tasteTags}
                selectedOptions={filters.tasteTags}
                onOptionChange={(option) => onFilterChange('tasteTags', option)}
            />

            <FilterSection
                key={`suppliers-${availableFilters.suppliers.length}-${availableFilters.suppliers.join(',')}`}
                title='Поставщик:'
                type='checkbox'
                options={availableFilters.suppliers}
                selectedOptions={filters.suppliers}
                onOptionChange={(option) => onFilterChange('suppliers', option)}
            />

            <FilterSection
                key={`continents-${availableFilters.continents.length}-${availableFilters.continents.join(',')}`}
                title='Континент:'
                type='checkbox'
                options={availableFilters.continents}
                selectedOptions={filters.continents}
                onOptionChange={(option) =>
                    onFilterChange('continents', option)
                }
            />

            <Button onClick={onClearFilters}>Очистить фильтры</Button>
        </div>
    </aside>
);
