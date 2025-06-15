import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup,
} from 'react-simple-maps';
import styles from '@components/CoffeeMap/CoffeeMap.module.css';
import { Loader } from '@components/Loader';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface CoffeeMarker {
    markerID: number;
    latitude: number;
    longitude: number;
    lotID: number;
    stock: number;
    CoffeeLot: {
        lotID: number;
        name: string;
        image: string;
        tasteFilter: string;
        Region: {
            name: string;
            Country: {
                name: string;
                Continent: {
                    name: string;
                };
            };
        };
        Roasting: {
            name: string;
        };
        ProcessingMethod: {
            name: string;
        };
        Weight: {
            value: string;
        };
        Supplier: {
            name: string;
        };
        TasteTags: Array<{
            name: string;
        }>;
    };
}

interface ShopInfo {
    name: string;
    theme: string;
}

interface GuestInventoryData {
    shop: ShopInfo;
    markers: CoffeeMarker[];
}

const GuestInventory: React.FC = () => {
    const { shareUrl } = useParams<{ shareUrl: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<GuestInventoryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredMarkerID, setHoveredMarkerID] = useState<number | null>(null);
    const [popupPosition, setPopupPosition] = useState<{
        x: number;
        y: number;
    } | null>(null);

    useEffect(() => {
        if (!shareUrl) return;
        setLoading(true);
        setError(null);

        fetch(`/api/shops/guest-inventory/${shareUrl}`)
            .then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || 'Failed to fetch inventory'
                    );
                }
                return res.json();
            })
            .then((responseData: GuestInventoryData) => setData(responseData))
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, [shareUrl]);

    const handleMarkerMouseEnter =
        (markerID: number) => (e: React.MouseEvent) => {
            setHoveredMarkerID(markerID);
            setPopupPosition({ x: e.clientX, y: e.clientY });
        };

    const handleMarkerMouseMove = (e: React.MouseEvent) => {
        setPopupPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMarkerMouseLeave = (markerID: number) => () => {
        setHoveredMarkerID((id) => (id === markerID ? null : id));
        setPopupPosition(null);
    };

    const markerSize = 8;

    if (loading) return <Loader variant='fullscreen' />;
    if (error)
        return (
            <div className={styles.container}>
                <div>Ошибка: {error}</div>
            </div>
        );
    if (!data)
        return (
            <div className={styles.container}>
                <div>Данные не найдены</div>
            </div>
        );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Карта кофе - {data.shop.name}</h2>
            </div>
            <div className={styles.mapContainer}>
                <div style={{ cursor: 'pointer' }}>
                    <ComposableMap
                        projectionConfig={{
                            scale: 147,
                        }}
                        className={styles.map}
                    >
                        <ZoomableGroup>
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map((geo) => {
                                        const hasMarkers = data.markers.some(
                                            (marker) =>
                                                marker.CoffeeLot.Region.Country
                                                    .name ===
                                                geo.properties.NAME
                                        );

                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                className={`${styles.geography} ${
                                                    hasMarkers
                                                        ? styles.hasMarkers
                                                        : ''
                                                }`}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                            {data.markers.map((marker) => (
                                <g key={marker.markerID}>
                                    <Marker
                                        coordinates={[
                                            marker.longitude || 0,
                                            marker.latitude || 0,
                                        ]}
                                        className={styles.marker}
                                        onMouseEnter={handleMarkerMouseEnter(
                                            marker.markerID
                                        )}
                                        onMouseMove={handleMarkerMouseMove}
                                        onMouseLeave={handleMarkerMouseLeave(
                                            marker.markerID
                                        )}
                                        onClick={() =>
                                            navigate(
                                                `/coffee-lots/${marker.lotID}`
                                            )
                                        }
                                    >
                                        <circle
                                            r={markerSize}
                                            className={styles.markerCircle}
                                        />
                                    </Marker>
                                </g>
                            ))}
                        </ZoomableGroup>
                    </ComposableMap>
                    {hoveredMarkerID !== null &&
                        popupPosition &&
                        (() => {
                            const marker = data.markers.find(
                                (m) => m.markerID === hoveredMarkerID
                            );
                            if (!marker) return null;
                            return (
                                <div
                                    className={styles.markerPopup}
                                    style={{
                                        position: 'fixed',
                                        left: popupPosition.x + 16,
                                        top: popupPosition.y - 40,
                                        zIndex: 1000,
                                        pointerEvents: 'none',
                                    }}
                                >
                                    <img
                                        src={
                                            marker.CoffeeLot.image
                                                ? `/images/${marker.CoffeeLot.image}`
                                                : '/images/placeholder.png'
                                        }
                                        alt={marker.CoffeeLot.name || ''}
                                        className={styles.markerPopupImage}
                                    />
                                    <div className={styles.markerPopupInfo}>
                                        <div
                                            className={styles.markerPopupName}
                                            style={{
                                                pointerEvents: 'auto',
                                            }}
                                            onClick={() =>
                                                navigate(
                                                    `/coffee-lots/${marker.lotID}`
                                                )
                                            }
                                            tabIndex={0}
                                            role='button'
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter')
                                                    navigate(
                                                        `/coffee-lots/${marker.lotID}`
                                                    );
                                            }}
                                        >
                                            {marker.CoffeeLot.name}
                                        </div>
                                        <div
                                            className={
                                                styles.markerPopupRoasting
                                            }
                                        >
                                            под{' '}
                                            {marker.CoffeeLot.Roasting?.name}
                                        </div>
                                        <div
                                            className={
                                                styles.markerPopupTasteTitle
                                            }
                                        >
                                            Вкусовые ноты:{' '}
                                            <span
                                                className={
                                                    styles.markerPopupTaste
                                                }
                                            >
                                                {marker.CoffeeLot.tasteFilter}
                                            </span>
                                        </div>
                                        <div
                                            className={styles.markerPopupStock}
                                        >
                                            В наличии: {marker.stock} шт.
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                </div>
            </div>
        </div>
    );
};

export default GuestInventory;
