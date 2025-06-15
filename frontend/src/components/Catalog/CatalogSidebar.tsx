import React from 'react';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { FilterSection } from '@components/CoffeeMap/FilterSection';
import styles from './CatalogSidebar.module.css';

interface Filters {
    continents: string[];
    roastingTypes: string[];
    processingMethods: string[];
    tasteTags: string[];
    suppliers: string[];
    searchQuery: string;
}

interface AvailableFilters {
    continents: string[];
    roastingTypes: string[];
    processingMethods: string[];
    tasteTags: string[];
    suppliers: string[];
}

interface CatalogSidebarProps {
    filters: Filters;
    availableFilters: AvailableFilters;
    onFilterChange: (
        filterType: keyof Omit<Filters, 'searchQuery'>,
        value: string
    ) => void;
    onSearchChange: (query: string) => void;
    onClearFilters: () => void;
}

export const CatalogSidebar: React.FC<CatalogSidebarProps> = ({
    filters,
    availableFilters,
    onFilterChange,
    onSearchChange,
    onClearFilters,
}) => (
    <aside className={styles.sidebar}>
        <div className={styles.filters}>
            <h3 className={styles.filterTitle}>Фильтры</h3>

            <div className={styles.searchContainer}>
                <Input
                    type='text'
                    placeholder='Быстрый поиск...'
                    value={filters.searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    width='full'
                    search
                />
            </div>

            <FilterSection
                title='Тип обжарки:'
                type='checkbox'
                options={availableFilters.roastingTypes}
                selectedOptions={filters.roastingTypes}
                onOptionChange={(option) =>
                    onFilterChange('roastingTypes', option)
                }
            />

            <FilterSection
                title='Способ обработки:'
                type='checkbox'
                options={availableFilters.processingMethods}
                selectedOptions={filters.processingMethods}
                onOptionChange={(option) =>
                    onFilterChange('processingMethods', option)
                }
            />

            <FilterSection
                title='Вкус кофе:'
                type='checkbox'
                options={availableFilters.tasteTags}
                selectedOptions={filters.tasteTags}
                onOptionChange={(option) => onFilterChange('tasteTags', option)}
            />

            <FilterSection
                title='Поставщик:'
                type='checkbox'
                options={availableFilters.suppliers}
                selectedOptions={filters.suppliers}
                onOptionChange={(option) => onFilterChange('suppliers', option)}
            />

            <FilterSection
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
