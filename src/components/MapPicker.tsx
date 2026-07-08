import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// fix default marker icon path issue with bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
    ._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const defaultCenter: [number, number] = [-6.2088, 106.8456]; // Jakarta

type Props = {
    value: { lat: string; lng: string };
    onChange: (lat: string, lng: string) => void;
};

function ClickHandler({
    onClick,
}: {
    onClick: (lat: number, lng: number) => void;
}) {
    useMapEvents({
        click(e) {
            onClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function MapPicker({ value, onChange }: Props) {
    const [center, setCenter] = useState<[number, number]>(() => {
        const lat = parseFloat(value.lat) || defaultCenter[0];
        const lng = parseFloat(value.lng) || defaultCenter[1];
        return [lat, lng];
    });

    // sync when value changes externally (e.g. geolocation)
    useEffect(() => {
        const lat = parseFloat(value.lat);
        const lng = parseFloat(value.lng);
        if (!isNaN(lat) && !isNaN(lng)) {
            setCenter([lat, lng]);
        }
    }, [value.lat, value.lng]);

    const position: [number, number] = [
        parseFloat(value.lat) || defaultCenter[0],
        parseFloat(value.lng) || defaultCenter[1],
    ];

    return (
        <div className="w-full h-[200px] rounded-xl overflow-hidden border border-[#BFC9C1]">
            <MapContainer
                center={center}
                zoom={13}
                className="w-full h-full"
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} />
                <ClickHandler
                    onClick={(lat, lng) =>
                        onChange(lat.toFixed(6), lng.toFixed(6))
                    }
                />
            </MapContainer>
        </div>
    );
}
