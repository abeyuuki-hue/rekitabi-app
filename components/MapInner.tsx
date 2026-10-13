'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { ShrineSpot } from '@/types/spot';

interface MapInnerProps {
  spots: ShrineSpot[];
  onSelectSpot?: (spot: ShrineSpot) => void;
}

export default function MapInner({ spots, onSelectSpot }: MapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([35.6961, 139.9936], 10);
      L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
        attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
      }).addTo(map);

      const clusterGroup = (L as any).markerClusterGroup({ disableClusteringAtZoom: 15 });
      map.addLayer(clusterGroup);

      mapInstanceRef.current = map;
      clusterGroupRef.current = clusterGroup;
    }

    const clusterGroup = clusterGroupRef.current;
    if (clusterGroup) {
      clusterGroup.clearLayers();

      const shrineIcon = L.divIcon({
        html: '<div style="font-size:26px; text-shadow: 2px 2px 4px rgba(0,0,0,0.4);">⛩️</div>',
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      const bounds: [number, number][] = [];

      spots.forEach((spot) => {
        const marker = L.marker([spot.lat, spot.lng], { icon: shrineIcon })
          .bindPopup(`<b>${spot.name}</b><br>${spot.region} (${spot.prefecture})<br><span style="font-size:11px;color:#8B0000;">印銘: ${spot.stampName.replace('\n', ' ')}</span>`);

        if (onSelectSpot) {
          marker.on('click', () => onSelectSpot(spot));
        }

        clusterGroup.addLayer(marker);
        bounds.push([spot.lat, spot.lng]);
      });

      if (bounds.length > 0 && mapInstanceRef.current) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [spots, onSelectSpot]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full"
      style={{ filter: 'sepia(0.6) hue-rotate(-15deg) saturate(0.8) contrast(1.1)' }}
    />
  );
}
