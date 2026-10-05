import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Coordinates } from '../../types';
import {
  MapPin,
  Crosshair,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Navigation,
  Info,
  ShieldCheck,
} from 'lucide-react';

interface LocationSelection {
  coordinates: Coordinates;
  address: string;
  district: string;
}

interface LocationSelectorPanelProps {
  initialCoordinates?: Coordinates;
  initialAddress?: string;
  initialDistrict?: string;
  onConfirmLocation: (selection: LocationSelection) => void;
  onCancel?: () => void;
}

export const LocationSelectorPanel: React.FC<LocationSelectorPanelProps> = ({
  initialCoordinates = { lat: 17.3850, lng: 78.4867 },
  initialAddress = 'Uppal, Hyderabad, Telangana',
  initialDistrict = 'Uppal',
  onConfirmLocation,
  onCancel,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [currentCoords, setCurrentCoords] = useState<Coordinates>(initialCoordinates);
  const [addressText, setAddressText] = useState<string>(initialAddress);
  const [districtText, setDistrictText] = useState<string>(initialDistrict);

  // Status flags
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [manualSearchQuery, setManualSearchQuery] = useState<string>('');
  const [isSearchingAddress, setIsSearchingAddress] = useState<boolean>(false);

  // Free OpenStreetMap Nominatim reverse geocoding
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.display_name) {
          // Format a clean, human-readable address
          const addr = data.address || {};
          const road = addr.road || addr.pedestrian || addr.street || '';
          const house = addr.house_number ? `${addr.house_number} ` : '';
          const suburb = addr.suburb || addr.neighbourhood || addr.city_district || addr.quarter || '';
          const city = addr.city || addr.town || addr.municipality || 'Central District';

          const formattedAddress = road
            ? `${house}${road}${suburb ? `, ${suburb}` : ''}${city ? `, ${city}` : ''}`
            : data.display_name.split(',').slice(0, 3).join(', ');

          setAddressText(formattedAddress);

          // Infer district
          if (suburb) {
            setDistrictText(`${suburb} District`);
          } else if (city) {
            setDistrictText(`${city}`);
          }
        }
      }
    } catch (err) {
      console.warn('Nominatim reverse geocode note (network or rate limit fallback):', err);
      // Keep existing or manual address text
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Free OpenStreetMap Nominatim forward geocoding for manual search
  const handleAddressSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSearchQuery.trim()) return;

    setIsSearchingAddress(true);
    setGeoError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          manualSearchQuery
        )}&limit=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      if (response.ok) {
        const results = await response.json();
        if (results && results.length > 0) {
          const first = results[0];
          const newLat = Number(parseFloat(first.lat).toFixed(5));
          const newLng = Number(parseFloat(first.lon).toFixed(5));

          const newCoords = { lat: newLat, lng: newLng };
          setCurrentCoords(newCoords);
          setAddressText(first.display_name.split(',').slice(0, 3).join(', '));

          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([newLat, newLng], 15);
            if (markerRef.current) {
              markerRef.current.setLatLng([newLat, newLng]);
            }
          }
        } else {
          setGeoError('No matching location found. Please try a different query or click on the map.');
        }
      }
    } catch {
      setGeoError('Could not connect to address lookup service. Please select location directly on the map.');
    } finally {
      setIsSearchingAddress(false);
    }
  };

  // Browser Geolocation API
  const handleUseCurrentLocation = () => {
    setGeoError(null);

    if (!('geolocation' in navigator)) {
      setGeoError('Geolocation is not supported by your browser. Please select location on the map.');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const lat = Number(position.coords.latitude.toFixed(5));
        const lng = Number(position.coords.longitude.toFixed(5));
        const newCoords = { lat, lng };

        setCurrentCoords(newCoords);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 16);
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          }
        }

        // Trigger reverse geocoding
        reverseGeocode(lat, lng);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError('Location permission denied. You can manually click on the map or type an address.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError('Location information is currently unavailable. Please pin your location on the map.');
            break;
          case error.TIMEOUT:
            setGeoError('Location request timed out. Please click on the map to set your location.');
            break;
          default:
            setGeoError('Unable to retrieve location. Please click on the map.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Initialize Leaflet Map with OpenStreetMap tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentCoords.lat, currentCoords.lng],
        zoom: 14,
        zoomControl: true,
      });

      // Free standard OpenStreetMap TileLayer (Zero API keys, zero paid services)
      const osmTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Graceful error logging if an OSM tile fails to load
      osmTileLayer.on('tileerror', (error) => {
        console.warn('OpenStreetMap tile loading note:', error);
      });

      // Custom high-contrast Leaflet marker pin
      const pinIcon = L.divIcon({
        className: 'custom-location-pin',
        html: `
          <div style="
            position: relative;
            width: 36px;
            height: 36px;
          ">
            <div style="
              width: 32px;
              height: 32px;
              background: #2563eb;
              border: 3px solid #ffffff;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.6);
            "></div>
            <div style="
              position: absolute;
              top: 10px;
              left: 10px;
              width: 12px;
              height: 12px;
              background: #ffffff;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      const marker = L.marker([currentCoords.lat, currentCoords.lng], {
        icon: pinIcon,
        draggable: true,
      }).addTo(map);

      // Handle map click to reposition pin
      map.on('click', (e: L.LeafletMouseEvent) => {
        const newLat = Number(e.latlng.lat.toFixed(5));
        const newLng = Number(e.latlng.lng.toFixed(5));
        const newCoords = { lat: newLat, lng: newLng };

        setCurrentCoords(newCoords);
        marker.setLatLng([newLat, newLng]);
        setConfirmed(false);
        reverseGeocode(newLat, newLng);
      });

      // Handle marker drag
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        const newLat = Number(pos.lat.toFixed(5));
        const newLng = Number(pos.lng.toFixed(5));
        const newCoords = { lat: newLat, lng: newLng };

        setCurrentCoords(newCoords);
        setConfirmed(false);
        reverseGeocode(newLat, newLng);
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;

      // Invalidate size after rendering to avoid gray tiles
      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleConfirm = () => {
    onConfirmLocation({
      coordinates: currentCoords,
      address: addressText.trim() || `${currentCoords.lat}, ${currentCoords.lng}`,
      district: districtText.trim() || 'Central District',
    });
    setConfirmed(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl space-y-4">
      {/* Panel Header */}
      <div className="bg-slate-800/90 border-b border-slate-700 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-white font-bold text-base">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <MapPin className="w-4 h-4" />
            </div>
            <span>OpenStreetMap Incident Location Selector</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zero proprietary Google APIs • 100% OpenStreetMap & Leaflet Geolocation
          </p>
        </div>

        {/* Action: Use Current Location */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:text-blue-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLocating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Locating GPS...</span>
              </>
            ) : (
              <>
                <Crosshair className="w-3.5 h-3.5 text-blue-400" />
                <span>Use My Current Location</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Geolocation Alerts */}
      {geoError && (
        <div className="mx-4 p-3 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Search by Address / Landmark Bar */}
      <div className="px-4">
        <form onSubmit={handleAddressSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={manualSearchQuery}
              onChange={(e) => setManualSearchQuery(e.target.value)}
              placeholder="Search address or landmark via OpenStreetMap (e.g., Uppal Metro, Malkajgiri, Hyderabad)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingAddress}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isSearchingAddress ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
          </button>
        </form>
      </div>

      {/* Interactive Leaflet Map Container */}
      <div className="relative px-4">
        <div className="rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-inner">
          <div ref={mapContainerRef} style={{ height: '340px', width: '100%' }} className="z-10" />
        </div>

        {/* Floating coordinates badge */}
        <div className="absolute bottom-3 left-7 bg-slate-900/90 backdrop-blur-sm border border-slate-700 px-3 py-1.5 rounded-lg text-[11px] font-mono text-slate-300 flex items-center gap-2 z-20 shadow-md">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>
            Lat: <strong>{currentCoords.lat}</strong>, Lng: <strong>{currentCoords.lng}</strong>
          </span>
          {isReverseGeocoding && (
            <span className="text-[10px] text-blue-400 flex items-center gap-1">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Geocoding...
            </span>
          )}
        </div>

        {/* Tip Badge */}
        <div className="absolute top-3 right-7 bg-slate-900/85 backdrop-blur-sm border border-slate-700 px-2.5 py-1 rounded-lg text-[10px] text-slate-300 z-20 shadow-md hidden sm:block">
          Click anywhere or drag marker to reposition
        </div>
      </div>

      {/* Selected Location Summary & Confirmation Bar */}
      <div className="p-4 sm:p-5 bg-slate-950/70 border-t border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-semibold uppercase text-[10px]">
              Human-Readable Address / Landmark *
            </label>
            <input
              type="text"
              value={addressText}
              onChange={(e) => {
                setAddressText(e.target.value);
                setConfirmed(false);
              }}
              placeholder="e.g. Uppal Main Road, Hyderabad, Telangana"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold uppercase text-[10px]">
              District / Area (Telangana)
            </label>
            <select
              value={districtText}
              onChange={(e) => {
                setDistrictText(e.target.value);
                setConfirmed(false);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Hyderabad">Hyderabad</option>
              <option value="Secunderabad">Secunderabad</option>
              <option value="Malkajgiri">Malkajgiri</option>
              <option value="Uppal">Uppal</option>
              <option value="LB Nagar">LB Nagar</option>
              <option value="Kukatpally">Kukatpally</option>
              <option value="Warangal">Warangal</option>
              <option value="Siddipet">Siddipet</option>
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Coordinates are protected and generalized on public maps to ensure victim safety.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleConfirm}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer w-full sm:w-auto ${
                confirmed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{confirmed ? 'Location Confirmed!' : 'Confirm Selected Location'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
