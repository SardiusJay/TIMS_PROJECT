'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Site } from '@/types/api';

interface SiteMapContainerProps {
  sites: Site[];
  isLoading?: boolean;
}

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const statusColors: Record<string, string> = {
  normal: '#22c55e',
  minor: '#3b82f6',
  moderate: '#eab308',
  critical: '#ef4444',
};

export default function SiteMapContainer({ sites, isLoading }: SiteMapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([40, -95], 4);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    if (sites.length > 0) {
      const bounds = L.latLngBounds(
        sites.map((site) => [site.latitude, site.longitude])
      );

      sites.forEach((site) => {
        const color = statusColors[site.conditionStatus] || '#gray';

        // Create SVG circle marker
        const svgIcon = L.divIcon({
          html: `
            <div style="
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background-color: ${color};
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            " />
          `,
          iconSize: [24, 24],
          className: 'site-marker',
        });

        const marker = L.marker([site.latitude, site.longitude], {
          icon: svgIcon,
        })
          .bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${site.name}</h3>
              <p style="margin: 4px 0; font-size: 0.875rem;">
                <strong>Region:</strong> ${site.region}
              </p>
              <p style="margin: 4px 0; font-size: 0.875rem;">
                <strong>Status:</strong> <span style="text-transform: capitalize;">${site.conditionStatus}</span>
              </p>
              <p style="margin: 4px 0; font-size: 0.875rem;">
                <strong>Defects:</strong> ${site.defectCount}
              </p>
              <p style="margin: 4px 0; font-size: 0.875rem;">
                <strong>Critical:</strong> ${site.criticalDefectCount}
              </p>
            </div>
          `)
          .addTo(mapInstanceRef.current!);

        markersRef.current.push(marker);
      });

      // Fit bounds
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [sites]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '500px' }}
      className="rounded-md overflow-hidden"
    />
  );
}
