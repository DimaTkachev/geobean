import React, { useState } from 'react';
import { CaretDownIcon } from '@phosphor-icons/react';
import styles from './FilterSection.module.css';
import cn from 'classnames';
import { Input } from '@components/Input';

const toFirstLetterUpperCase = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

interface FilterSectionProps {
    title: string;
    type: 'checkbox' | 'search';
    options?: string[];
    selectedOptions?: string[];
    onOptionChange?: (option: string) => void;
    searchPlaceholder?: string;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
    title,
    type,
    options = [],
    selectedOptions = [],
    onOptionChange,
    searchPlaceholder,
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleOptionChange = (option: string) => {
        if (onOptionChange) {
            onOptionChange(option);
        }
    };

    return (
        <div className={styles.filterSection}>
            <div
                className={styles.filterSubtitleContainer}
                onClick={() => setIsExpanded(!isExpanded)}
                role='button'
                tabIndex={0}
            >
                <h4 className={styles.filterSubtitle}>{title}</h4>
                <CaretDownIcon
                    size={20}
                    weight='bold'
                    className={cn(styles.caretIcon, {
                        [styles.caretIconExpanded]: isExpanded,
                        [styles.caretIconCollapsed]: !isExpanded,
                    })}
                />
            </div>

            {isExpanded && type === 'checkbox' && (
                <div className={styles.filterOptions}>
                    {options.map((option) => (
                        <label key={option} className={styles.filterOption}>
                            <input
                                type='checkbox'
                                checked={selectedOptions.includes(option)}
                                onChange={() => handleOptionChange(option)}
                            />
                            <span>{toFirstLetterUpperCase(option)}</span>
                        </label>
                    ))}
                </div>
            )}

            {isExpanded && type === 'search' && (
                <div className={styles.supplierSearch}>
                    <Input
                        type='text'
                        placeholder={searchPlaceholder}
                        width='full'
                        search
                    />
                </div>
            )}
        </div>
    );
};
