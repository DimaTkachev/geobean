import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
    useCallback,
} from 'react';
import { useAuth } from './AuthContext';

export interface Shop {
    shopID: number;
    name: string;
    image: string | null;
    theme: 'beige' | 'purple' | 'blue';
    shareUrl?: string | null;
    qrBase64?: string | null;
}

interface ShopContextType {
    shops: Shop[];
    currentShop: Shop | null;
    setCurrentShop: (shop: Shop | null) => void;
    refreshShops: () => Promise<void>;
    addShop: (shop: Shop) => void;
    isLoading: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) throw new Error('useShop must be used within ShopProvider');
    return context;
};

export const ShopProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [shops, setShops] = useState<Shop[]>([]);
    const [currentShop, setCurrentShopState] = useState<Shop | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    const setCurrentShop = (shop: Shop | null) => {
        setCurrentShopState(shop);
        if (shop) {
            localStorage.setItem('currentShopID', shop.shopID.toString());
        } else {
            localStorage.removeItem('currentShopID');
        }
    };

    const refreshShops = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch('/api/shops', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Ошибка загрузки кофеен');
            const data: Shop[] = await res.json();
            setShops(data);

            const savedShopID = localStorage.getItem('currentShopID');
            let initialShop = null;

            if (savedShopID) {
                const foundShop = data.find(
                    (shop) => shop.shopID === parseInt(savedShopID, 10)
                );
                if (foundShop) {
                    initialShop = foundShop;
                }
            }

            if (!initialShop && data.length > 0) {
                initialShop = data[0];
            }

            setCurrentShopState(initialShop);
            if (initialShop) {
                localStorage.setItem(
                    'currentShopID',
                    initialShop.shopID.toString()
                );
            } else {
                localStorage.removeItem('currentShopID');
            }
        } catch (e) {
            setShops([]);
            setCurrentShopState(null);
            localStorage.removeItem('currentShopID');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addShop = (shop: Shop) => {
        setShops((prev) => [...prev, shop]);
        setCurrentShop(shop);
    };

    useEffect(() => {
        if (isAuthenticated) {
            refreshShops();
        } else {
            setShops([]);
            setCurrentShopState(null);
            setIsLoading(false);
        }
    }, [isAuthenticated, refreshShops]);

    return (
        <ShopContext.Provider
            value={{
                shops,
                currentShop,
                setCurrentShop,
                refreshShops,
                addShop,
                isLoading,
            }}
        >
            {children}
        </ShopContext.Provider>
    );
};
