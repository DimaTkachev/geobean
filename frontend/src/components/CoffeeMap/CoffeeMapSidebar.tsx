import React from 'react';
import { Button } from '@components/Button';
import { FilterSection } from './FilterSection';
import styles from './CoffeeMapSidebar.module.css';

interface Filters {
    continents: string[];
    roastingTypes: string[];
    processingMethods: string[];
    tasteTags: string[];
    searchQuery: string;
}

interface AvailableFilters {
    continents: string[];
    roastingTypes: string[];
    processingMethods: string[];
    tasteTags: string[];
}

interface CoffeeMapSidebarProps {
    filters: Filters;
    availableFilters: AvailableFilters;
    onFilterChange: (filterType: keyof Filters, value: string) => void;
    onClearFilters: () => void;
}

export const CoffeeMapSidebar: React.FC<CoffeeMapSidebarProps> = ({
    filters,
    availableFilters,
    onFilterChange,
    onClearFilters,
}) => (
    <aside className={styles.sidebar}>
        <div className={styles.filters}>
            <h3 className={styles.filterTitle}>Фильтры</h3>

            <FilterSection
                title='Тип зерна:'
                type='checkbox'
                options={availableFilters.roastingTypes}
                selectedOptions={filters.roastingTypes}
                onOptionChange={(type) => onFilterChange('roastingTypes', type)}
            />

            <FilterSection
                title='Способ обработки:'
                type='checkbox'
                options={availableFilters.processingMethods}
                selectedOptions={filters.processingMethods}
                onOptionChange={(method) =>
                    onFilterChange('processingMethods', method)
                }
            />

            <FilterSection
                title='Вкус кофе:'
                type='checkbox'
                options={availableFilters.tasteTags}
                selectedOptions={filters.tasteTags}
                onOptionChange={(tag) => onFilterChange('tasteTags', tag)}
            />

            <FilterSection
                title='Поставщик:'
                type='search'
                searchPlaceholder='Найти поставщика...'
            />

            <FilterSection
                title='Континент:'
                type='checkbox'
                options={availableFilters.continents}
                selectedOptions={filters.continents}
                onOptionChange={(continent) =>
                    onFilterChange('continents', continent)
                }
            />

            <Button onClick={onClearFilters}>Очистить фильтры</Button>
        </div>
    </aside>
);
