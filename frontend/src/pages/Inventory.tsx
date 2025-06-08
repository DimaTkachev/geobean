import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useShop } from '@contexts/index';

interface InventoryItem {
    lotID: number;
    stock: number;
    coffeeLot: {
        coffeeLotID: number;
        country: string;
        region: string;
        farm: string;
        variety: string;
        processingMethod: string;
        harvestDate: string;
        roastLevel: string;
        flavorNotes: string;
        altitude: number;
        price: number;
    };
}

const Inventory: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { currentShop } = useShop();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !currentShop) {
            navigate('/login');
            return;
        }

        const fetchInventory = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `/api/shops/${currentShop.shopID}/inventory`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.message || 'Failed to fetch inventory'
                    );
                }

                const data = await response.json();
                setInventory(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch inventory'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, [isAuthenticated, currentShop, navigate]);

    const handleCoffeeLotClick = (lotID: number) => {
        navigate(`/coffee-lots/${lotID}`);
    };

    const updateStock = async (lotID: number, newStock: number) => {
        try {
            const response = await fetch(
                `/api/shops/${currentShop!.shopID}/inventory/${lotID}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    body: JSON.stringify({ stock: newStock }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update stock');
            }

            setInventory((prev) =>
                prev.map((item) =>
                    item.lotID === lotID ? { ...item, stock: newStock } : item
                )
            );
        } catch (err) {
            console.error('Error updating stock:', err);
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
    if (error)
        return (
            <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error}</div>
        );

    return (
        <div style={{ padding: '20px' }}>
            <h1>Инвентарь кофейни</h1>
            {inventory.length === 0 ? (
                <p>Ваш инвентарь пуст. Добавьте кофейные лоты из каталога.</p>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {inventory.map((item) => (
                        <div
                            key={item.lotID}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleCoffeeLotClick(item.lotID)}
                        >
                            <div>
                                <h3>
                                    {item.coffeeLot.country} -{' '}
                                    {item.coffeeLot.region}
                                </h3>
                                <p>
                                    {item.coffeeLot.farm} (
                                    {item.coffeeLot.variety})
                                </p>
                                <p>
                                    Обработка: {item.coffeeLot.processingMethod}
                                </p>
                                <p>Цена: {item.coffeeLot.price}₽/кг</p>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateStock(
                                            item.lotID,
                                            Math.max(0, item.stock - 1)
                                        );
                                    }}
                                    disabled={item.stock === 0}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: '#ff6b6b',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    -
                                </button>
                                <span
                                    style={{
                                        minWidth: '40px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {item.stock} шт
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateStock(item.lotID, item.stock + 1);
                                    }}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: '#51cf66',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Inventory;
