import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
} from 'react-simple-maps';
import styles from '@components/CoffeeMap/CoffeeMap.module.css';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const GuestInventory: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);

        fetch(`/api/shops/guest-inventory/${id}`)
            .then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || 'Failed to fetch inventory'
                    );
                }
                return res.json();
            })
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.mapContainer}>
                <ComposableMap
                    projection='geoMercator'
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <ZoomableGroup center={[0, 0]} zoom={1}>
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill='#EAEAEC'
                                        stroke='#D6D6DA'
                                    />
                                ))
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
            </div>
        </div>
    );
};

export default GuestInventory;
