'use client';

import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import type { GeoJsonObject } from 'geojson';
import { useEffect, useMemo } from 'react';
import { GeoJSON, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import styles from './page.module.css';

type BoundingBox = [number, number, number, number]; // [south, north, west, east]

type OSMPlace = {
  display_name: string;
  lat: number;
  lon: number;
  boundingbox?: BoundingBox;
  geojson?: unknown;
};

type OSMVet = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  phone?: string;
  openingHours?: string;
};

function getAssetSrc(asset: unknown): string | undefined {
  if (typeof asset === 'string') return asset;

  if (asset && typeof asset === 'object' && 'src' in asset) {
    const src = (asset as { src?: unknown }).src;
    if (typeof src === 'string') return src;
  }

  return undefined;
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl: getAssetSrc(markerIcon2x),
  iconUrl: getAssetSrc(markerIcon),
  shadowUrl: getAssetSrc(markerShadow),
});

const DEFAULT_CENTER: [number, number] = [51.5074, -0.1278];
const DEFAULT_ZOOM = 11;

function FitMap({ place, vets, selectedVet }: { place: OSMPlace | null; vets: OSMVet[]; selectedVet: OSMVet | null }) {
  const map = useMap();

  const bounds = useMemo(() => {
    if (selectedVet) {
      return L.latLngBounds([selectedVet.lat, selectedVet.lon], [selectedVet.lat, selectedVet.lon]);
    }

    if (place?.geojson) {
      try {
        const geo = L.geoJSON(place.geojson as GeoJsonObject);
        const b = geo.getBounds();
        if (b.isValid()) return b;
      } catch {
        // ignore
      }
    }

    if (place?.boundingbox) {
      const [south, north, west, east] = place.boundingbox;
      const b = L.latLngBounds([south, west], [north, east]);
      if (b.isValid()) return b;
    }

    if (vets.length > 0) {
      const points = vets.map((v) => L.latLng(v.lat, v.lon));
      const b = L.latLngBounds(points);
      if (b.isValid()) return b;
    }

    return null;
  }, [place, selectedVet, vets]);

  useEffect(() => {
    if (!bounds) return;

    if (selectedVet) {
      map.setView([selectedVet.lat, selectedVet.lon], 15, { animate: true });
      return;
    }

    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14, animate: true });
  }, [bounds, map, selectedVet]);

  return null;
}

export default function VetFinderMap({
  place,
  vets,
  selectedVet,
}: {
  place: OSMPlace | null;
  vets: OSMVet[];
  selectedVet: OSMVet | null;
}) {
  const center: [number, number] = place
    ? [place.lat, place.lon]
    : selectedVet
      ? [selectedVet.lat, selectedVet.lon]
      : DEFAULT_CENTER;

  const showBoundary = !!place?.geojson && !selectedVet;

  return (
    <MapContainer className={styles.map} center={center} zoom={DEFAULT_ZOOM} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitMap place={place} vets={vets} selectedVet={selectedVet} />

      {showBoundary && (
        <GeoJSON
          data={place!.geojson as GeoJsonObject}
          style={{ color: 'var(--primary-color)', weight: 2, fillOpacity: 0.05 }}
        />
      )}

      {vets.map((vet) => (
        <Marker key={vet.id} position={[vet.lat, vet.lon]}>
          <Popup>
            <strong>{vet.name}</strong>
            {vet.address && <div>{vet.address}</div>}
            {vet.phone && <div>{vet.phone}</div>}
            {vet.openingHours && <div>{vet.openingHours}</div>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
