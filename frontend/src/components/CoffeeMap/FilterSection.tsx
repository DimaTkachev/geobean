import React from 'react';
import { CaretDownIcon } from '@phosphor-icons/react';
import styles from './CoffeeMapSidebar.module.css';

const toUpperCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

interface FilterSectionProps {
    title: string;
    type: 'checkbox' | 'search';
    options?: string[];
    selectedOptions?: string[];
    onOptionChange?: (option: string) => void;
    searchPlaceholder?: string;
    searchInputClassName?: string;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
    title,
    type,
    options = [],
    selectedOptions = [],
    onOptionChange,
    searchPlaceholder,
    searchInputClassName,
}) => {
    const handleOptionChange = (option: string) => {
        if (onOptionChange) {
            onOptionChange(option);
        }
    };

    return (
        <div className={styles.filterSection}>
            <div className={styles.filterSubtitleContainer}>
                <h4 className={styles.filterSubtitle}>{title}</h4>
                <CaretDownIcon size={20} weight='bold' />
            </div>

            {type === 'checkbox' && (
                <div className={styles.filterOptions}>
                    {options.map((option) => (
                        <label key={option} className={styles.filterOption}>
                            <input
                                type='checkbox'
                                checked={selectedOptions.includes(option)}
                                onChange={() => handleOptionChange(option)}
                            />
                            <span>{toUpperCase(option)}</span>
                        </label>
                    ))}
                </div>
            )}

            {type === 'search' && (
                <div className={styles.supplierSearch}>
                    <input
                        type='text'
                        placeholder={searchPlaceholder}
                        className={searchInputClassName || styles.supplierInput}
                    />
                </div>
            )}
        </div>
    );
};
