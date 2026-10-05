import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CrimeReport, CrimeCategory, Coordinates } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Filter, MapPin, ShieldCheck, AlertCircle, Info, Layers } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface CrimeMapProps {
  reports: CrimeReport[];
  pickerMode?: boolean;
  selectedCoordinates?: Coordinates | null;
  onSelectCoordinates?: (coords: Coordinates) => void;
  height?: string;
  isPoliceView?: boolean;
}

export const CrimeMapComponent: React.FC<CrimeMapProps> = ({
  reports,
  pickerMode = false,
  selectedCoordinates,
  onSelectCoordinates,
  height = '560px',
  isPoliceView = false,
}) => {
  const { t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [areaFilter, setAreaFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL');
  const [selectedIncident, setSelectedIncident] = useState<CrimeReport | null>(null);

  // Filter reports
  const filteredReports = reports.filter((r) => {
    if (categoryFilter !== 'ALL' && r.finalCategory !== categoryFilter) return false;
    if (areaFilter !== 'ALL' && r.areaDistrict !== areaFilter) return false;

    if (dateFilter !== 'ALL') {
      const reportDate = new Date(r.date);
      const now = new Date('2026-10-04T06:33:58'); // Reference current system time
      const diffDays = Math.floor((now.getTime() - reportDate.getTime()) / (1000 * 3600 * 24));

      if (dateFilter === '7DAYS' && diffDays > 7) return false;
      if (dateFilter === '30DAYS' && diffDays > 30) return false;
      if (dateFilter === 'OLDER' && diffDays <= 30) return false;
    }

    return true;
  });

  const uniqueAreas = Array.from(new Set(reports.map((r) => r.areaDistrict).filter(Boolean)));

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter: [number, number] = [17.3850, 78.4867]; // Hyderabad, Telangana, India
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 11,
        zoomControl: true,
      });

      // Free standard OpenStreetMap tile layer (zero Google Maps API keys or billing required)
      const osmTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      osmTileLayer.on('tileerror', (error) => {
        console.warn('OpenStreetMap tile loading note:', error);
      });

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Handle map click for coordinate selection
      if (pickerMode && onSelectCoordinates) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          onSelectCoordinates({ lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)) });
        });
      }

      // Ensure crisp tiles after layout rendering
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [pickerMode]);

  // Update markers when reports or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    if (!pickerMode) {
      filteredReports.forEach((rep) => {
        if (!rep.coordinates || !rep.coordinates.lat || !rep.coordinates.lng) return;

        // Custom marker HTML icon
        const getMarkerColor = (cat: CrimeCategory) => {
          switch (cat) {
            case 'Assault':
              return '#ef4444'; // Red
            case 'Burglary':
            case 'Vehicle Theft':
              return '#f97316'; // Orange
            case 'Theft':
            case 'Fraud':
              return '#eab308'; // Yellow/Amber
            case 'Cyber Crime':
              return '#06b6d4'; // Cyan
            case 'Vandalism':
              return '#a855f7'; // Purple
            default:
              return '#3b82f6'; // Blue
          }
        };

        const color = getMarkerColor(rep.finalCategory);

        const customIcon = L.divIcon({
          className: 'custom-crime-marker',
          html: `
            <div style="
              background-color: ${color};
              width: 28px;
              height: 28px;
              border-radius: 50%;
              border: 3px solid #0f172a;
              box-shadow: 0 4px 10px rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 11px;
              font-weight: bold;
              cursor: pointer;
            ">
              !
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([rep.coordinates.lat, rep.coordinates.lng], { icon: customIcon });

        marker.on('click', () => {
          setSelectedIncident(rep);
        });

        markersLayerRef.current?.addLayer(marker);
      });
    }
  }, [filteredReports, pickerMode]);

  // Handle picker marker updates
  useEffect(() => {
    if (!pickerMode || !mapInstanceRef.current) return;

    if (selectedCoordinates) {
      if (!pickerMarkerRef.current) {
        const pickerIcon = L.divIcon({
          className: 'custom-picker-pin',
          html: `
            <div style="
              background-color: #3b82f6;
              width: 32px;
              height: 32px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
            "></div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        pickerMarkerRef.current = L.marker([selectedCoordinates.lat, selectedCoordinates.lng], {
          icon: pickerIcon,
        }).addTo(mapInstanceRef.current);
      } else {
        pickerMarkerRef.current.setLatLng([selectedCoordinates.lat, selectedCoordinates.lng]);
      }
      mapInstanceRef.current.panTo([selectedCoordinates.lat, selectedCoordinates.lng]);
    }
  }, [selectedCoordinates, pickerMode]);

  return (
    <div className="space-y-4">
      {/* Map Control Bar & Filters */}
      {!pickerMode && (
        <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 text-slate-300 text-xs font-semibold uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              <span>Filters:</span>
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium py-1.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Categories ({reports.length})</option>
              <option value="Theft">Theft</option>
              <option value="Vehicle Theft">Vehicle Theft</option>
              <option value="Assault">Assault</option>
              <option value="Burglary">Burglary</option>
              <option value="Vandalism">Vandalism</option>
              <option value="Fraud">Fraud</option>
              <option value="Cyber Crime">Cyber Crime</option>
              <option value="Harassment">Harassment</option>
              <option value="Other">Other</option>
            </select>

            {/* Area Filter */}
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium py-1.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Districts / Areas</option>
              {uniqueAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            {/* Date Range Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium py-1.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Dates</option>
              <option value="7DAYS">Past 7 Days</option>
              <option value="30DAYS">Past 30 Days</option>
              <option value="OLDER">Older than 30 Days</option>
            </select>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Visible Pins: <strong>{filteredReports.length}</strong></span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Public Privacy Guard Active
            </span>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950">
        <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-10" />

        {/* Selected Incident Modal Overlay */}
        {selectedIncident && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-slate-900/95 backdrop-blur-md border border-slate-700 p-5 rounded-2xl shadow-2xl z-20 text-slate-100 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-[11px] font-mono text-blue-400 tracking-wider font-semibold">
                  {selectedIncident.referenceId}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedIncident.finalCategory}</h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-white p-1 text-sm rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300 my-3">
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">General Area:</span>
                <span className="font-medium text-slate-200">{selectedIncident.areaDistrict}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Date & Time:</span>
                <span>{selectedIncident.date} ({selectedIncident.time})</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Incident Status:</span>
                <StatusBadge status={selectedIncident.status} />
              </div>
              <div className="pt-2">
                <p className="text-xs text-slate-300 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  "{selectedIncident.description}"
                </p>
              </div>
            </div>

            {/* Privacy Protection Notice */}
            <div className="pt-2 border-t border-slate-800 text-[10px] text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Public View: Reporter identity and private police notes are confidential.</span>
            </div>
          </div>
        )}

        {/* Map Legend */}
        {!pickerMode && (
          <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700/80 p-3 rounded-xl shadow-lg z-20 text-[11px] text-slate-300 space-y-1.5 hidden md:block">
            <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-blue-400" /> Marker Legend
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Assault
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Burglary / Vehicle Theft
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Theft / Fraud
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Cyber Crime
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Vandalism
            </div>
          </div>
        )}

        {pickerMode && (
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-blue-500/40 p-3 rounded-xl shadow-lg z-20 text-xs text-blue-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Click anywhere on the map to set the incident location coordinates.</span>
          </div>
        )}
      </div>

      {/* Safety Notice Banner */}
      {!pickerMode && (
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-start gap-3 text-xs text-slate-400">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-slate-200">Public Confidentiality Guarantee:</span>
            <p>
              In accordance with Crime Watch privacy requirements, public crime maps display only anonymized categories, generalized neighborhood sectors, dates, and official case statuses. Reporter identities, contact numbers, email addresses, uploaded evidence, and internal officer logs are strictly omitted from public views.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
