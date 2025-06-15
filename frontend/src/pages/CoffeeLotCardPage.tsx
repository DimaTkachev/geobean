import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth, useShop } from '@contexts/index';
import { Tooltip } from '@components/Tooltip/Tooltip';
import styles from './CoffeeLotCardPage.module.css';
import { Loader } from '@components/Loader';
import { debouncedFetch } from '@utils/api';
import { InfoIcon, MinusIcon, PlusIcon } from '@phosphor-icons/react';

interface CoffeeLot {
    lotID: number;
    name: string;
    image: string | null;
    supplier: string;
    supplierLink: string | null;
    country: string;
    region: string;
    height: string;
    qRate: number;
    processingMethod: string;
    flavorNotes: string[];
    description: string;
    weight: string;
    roasting: string;
    price: number;
    shopId: number;
}

interface AttributeInfo {
    [key: string]: string;
}

export const CoffeeLotCardPage: React.FC = () => {
    const { lotID } = useParams<{ lotID: string }>();
    const { user } = useAuth();
    const { currentShop } = useShop();
    const [coffeeLot, setCoffeeLot] = useState<CoffeeLot | null>(null);
    const [attrInfo, setAttrInfo] = useState<AttributeInfo>({});
    const [inventory, setInventory] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await debouncedFetch(
                    `/api/coffee-lots/${lotID}`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch coffee lot');
                }
                const data = await response.json();
                setCoffeeLot(data);
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Error fetching coffee lot:', error.message);
                }
            }
        };

        fetchData();
    }, [lotID]);

    useEffect(() => {
        debouncedFetch('/api/coffee-lots/attribute-info')
            .then((res) => res.json())
            .then(setAttrInfo);
        if (user && currentShop) {
            const token = localStorage.getItem('authToken');
            debouncedFetch(
                `/api/shops/${currentShop.shopID}/inventory/${lotID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                    return { stock: 0 };
                })
                .then((data) => setInventory(data.stock || 0));
        }
    }, [lotID, user, currentShop]);

    const handleQuantity = async (change: number) => {
        if (!currentShop || !user || !coffeeLot) return;
        const newQuantity = Math.max(0, (inventory || 0) + change);
        const token = localStorage.getItem('authToken');

        try {
            const response = await debouncedFetch(
                `/api/shops/${currentShop.shopID}/inventory/${coffeeLot.lotID}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ stock: newQuantity }),
                }
            );

            if (response.ok) {
                setInventory(newQuantity);
            }
        } catch (error) {
            console.error('Error updating inventory:', error);
        }
    };

    const handleSupplierClick = () => {
        if (coffeeLot?.supplierLink) {
            window.open(coffeeLot.supplierLink, '_blank');
        }
    };

    if (!coffeeLot) return <Loader variant='fullscreen' />;

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topSection}>
                <div className={styles.imageSection}>
                    {coffeeLot.image && (
                        <img
                            src={`/images/${coffeeLot.image}`}
                            alt={coffeeLot.name}
                            className={styles.image}
                        />
                    )}
                    {user && (
                        <div className={styles.inventoryControls}>
                            <button
                                className={styles.quantityBtn}
                                onClick={() => handleQuantity(-1)}
                                disabled={inventory === 0}
                            >
                                <MinusIcon
                                    size={16}
                                    color='var(--brown-20)'
                                    weight='bold'
                                />
                            </button>
                            <span className={styles.quantity}>
                                {inventory ?? 0} шт
                            </span>
                            <button
                                className={styles.quantityBtn}
                                onClick={() => handleQuantity(1)}
                            >
                                <PlusIcon
                                    size={16}
                                    color='var(--brown-20)'
                                    weight='bold'
                                />
                            </button>
                        </div>
                    )}
                </div>
                <div className={styles.infoSection}>
                    <h2 className={styles.name}>{coffeeLot.name}</h2>
                    <div className={styles.roastingWeight}>
                        под {coffeeLot.roasting}, {coffeeLot.weight}
                    </div>
                    <div className={styles.supplierSection}>
                        Поставщик:{' '}
                        <span
                            className={styles.supplierLink}
                            onClick={handleSupplierClick}
                            style={{
                                cursor: coffeeLot.supplierLink
                                    ? 'pointer'
                                    : 'default',
                            }}
                        >
                            {coffeeLot.supplier}
                        </span>
                    </div>

                    <ul className={styles.parameters}>
                        <li className={styles.paramRow}>
                            <div className={styles.paramLabelWrapper}>
                                <span className={styles.paramLabel}>
                                    Страна:
                                </span>
                                <Tooltip text={attrInfo['country'] || ''}>
                                    <InfoIcon
                                        size={16}
                                        color='var(--brown-60)'
                                        weight='bold'
                                    />
                                </Tooltip>
                            </div>
                            <span>{coffeeLot.country}</span>
                        </li>
                        <li className={styles.paramRow}>
                            <div className={styles.paramLabelWrapper}>
                                <span className={styles.paramLabel}>
                                    Регион:
                                </span>
                                <Tooltip text={attrInfo['region'] || ''}>
                                    <InfoIcon
                                        size={16}
                                        color='var(--brown-60)'
                                        weight='bold'
                                    />
                                </Tooltip>
                            </div>
                            <span>{coffeeLot.region}</span>
                        </li>
                        <li className={styles.paramRow}>
                            <div className={styles.paramLabelWrapper}>
                                <span className={styles.paramLabel}>
                                    Высота:
                                </span>
                                <Tooltip text={attrInfo['height'] || ''}>
                                    <InfoIcon
                                        size={16}
                                        color='var(--brown-60)'
                                        weight='bold'
                                    />
                                </Tooltip>
                            </div>
                            <span>{coffeeLot.height}</span>
                        </li>
                        <li className={styles.paramRow}>
                            <div className={styles.paramLabelWrapper}>
                                <span className={styles.paramLabel}>
                                    Q-рейтинг:
                                </span>
                                <Tooltip text={attrInfo['qRate'] || ''}>
                                    <InfoIcon
                                        size={16}
                                        color='var(--brown-60)'
                                        weight='bold'
                                    />
                                </Tooltip>
                            </div>
                            <span>{coffeeLot.qRate}</span>
                        </li>
                        <li className={styles.paramRow}>
                            <div className={styles.paramLabelWrapper}>
                                <span className={styles.paramLabel}>
                                    Способ обработки:
                                </span>
                                <Tooltip
                                    text={attrInfo['processingMethod'] || ''}
                                >
                                    <InfoIcon
                                        size={16}
                                        color='var(--brown-60)'
                                    />
                                </Tooltip>
                            </div>
                            <span>{coffeeLot.processingMethod}</span>
                        </li>
                        <li className={styles.paramRow}>
                            <div className={styles.paramLabelWrapper}>
                                <span className={styles.paramLabel}>
                                    Вкусовые ноты:
                                </span>
                            </div>
                            <span>{coffeeLot.flavorNotes.join(', ')}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={styles.descriptionSection}>
                <h4 className={styles.descriptionTitle}>Описание:</h4>
                <p className={styles.description}>{coffeeLot.description}</p>
            </div>
        </div>
    );
};

export default CoffeeLotCardPage;
