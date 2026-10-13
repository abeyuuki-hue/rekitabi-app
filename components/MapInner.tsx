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
  userStamps?: Record<string, boolean>;
  onSelectSpot?: (spot: ShrineSpot) => void;
}

export default function MapInner({ spots, userStamps = {}, onSelectSpot }: MapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([35.6961, 139.9936], 10);
      L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
        attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener noreferrer">国土地理院</a>',
        maxZoom: 18,
      }).addTo(map);

      const clusterGroup = (L as any).markerClusterGroup({ disableClusteringAtZoom: 15 });
      map.addLayer(clusterGroup);

      mapInstanceRef.current = map;
      clusterGroupRef.current = clusterGroup;
    }

    const clusterGroup = clusterGroupRef.current;
    if (clusterGroup) {
      clusterGroup.clearLayers();

      const bounds: [number, number][] = [];

      spots.forEach((spot) => {
        const isStamped = !!userStamps[spot.id];
        const markerHtml = isStamped
          ? '<div style="font-size:26px; text-shadow: 0 0 6px rgba(212,175,55,0.8), 2px 2px 4px rgba(0,0,0,0.4); filter: drop-shadow(0 0 2px #d4af37);">⛩️<span style="font-size:12px;position:absolute;top:-6px;right:-4px;">💮</span></div>'
          : '<div style="font-size:26px; text-shadow: 2px 2px 4px rgba(0,0,0,0.4);">⛩️</div>';

        const shrineIcon = L.divIcon({
          html: markerHtml,
          className: 'shrine-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });

        const popupContent = document.createElement('div');
        popupContent.style.minWidth = '140px';
        popupContent.style.textAlign = 'center';
        popupContent.style.fontFamily = 'serif';

        const title = document.createElement('div');
        title.textContent = spot.name;
        title.style.cssText = 'font-size:14px; font-weight:bold; color:#8B0000; margin-bottom:4px;';
        popupContent.appendChild(title);

        const location = document.createElement('div');
        location.textContent = `${spot.region} (${spot.prefecture})`;
        location.style.cssText = 'font-size:11px; color:#555; margin-bottom:4px;';
        popupContent.appendChild(location);

        const status = document.createElement('div');
        status.textContent = isStamped ? '💮 参拝・押印済' : '未参拝';
        status.style.cssText = `font-size:11px; margin-bottom:8px; color:${isStamped ? '#8B0000' : '#666'};`;
        if (isStamped) status.style.fontWeight = 'bold';
        popupContent.appendChild(status);

        if (onSelectSpot) {
          const btn = document.createElement('button');
          btn.textContent = '詳細・由緒を見る';
          btn.style.cssText = 'background:#8B0000; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:11px; cursor:pointer; font-weight:bold;';
          btn.onclick = () => onSelectSpot(spot);
          popupContent.appendChild(btn);
        }

        const marker = L.marker([spot.lat, spot.lng], { icon: shrineIcon })
          .bindPopup(popupContent);
        clusterGroup.addLayer(marker);
        bounds.push([spot.lat, spot.lng]);
      });

      if (bounds.length > 0 && mapInstanceRef.current) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [spots, userStamps, onSelectSpot]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full"
      style={{ filter: 'sepia(0.6) hue-rotate(-15deg) saturate(0.8) contrast(1.1)' }}
    />
  );
}
