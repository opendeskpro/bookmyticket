import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { MapPin, Globe, Building2, Building, Map as MapIcon, X, LocateFixed } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface EventLocationProps {
    locationData: any;
    onChange: (data: any) => void;
}

const LocationMarker = ({ position, setPosition }: { position: [number, number], setPosition: (pos: [number, number]) => void }) => {
    const map = useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Event Location</Popup>
        </Marker>
    );
}

const EventLocation: React.FC<EventLocationProps> = ({ locationData, onChange }) => {
    const { theme } = useTheme();
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [loading, setLoading] = useState({ countries: true, states: false, cities: false });
    const [showMapModal, setShowMapModal] = useState(false);
    const [mapPosition, setMapPosition] = useState<[number, number]>([20.5937, 78.9629]); // Default to India

    // Fetch Countries on Mount
    useEffect(() => {
        fetchCountries();
    }, []);

    // Sync map position with locationData
    useEffect(() => {
        if (locationData.latitude && locationData.longitude) {
            setMapPosition([locationData.latitude, locationData.longitude]);
        }
    }, [locationData.latitude, locationData.longitude]);

    // Fetch States when Country changes
    useEffect(() => {
        if (locationData.country_id) {
            fetchStates(locationData.country_id);
        } else {
            setStates([]);
            setCities([]);
        }
    }, [locationData.country_id]);

    // Fetch Cities when State changes
    useEffect(() => {
        if (locationData.state_id) {
            fetchCities(locationData.state_id);
        } else {
            setCities([]);
        }
    }, [locationData.state_id]);

    const fetchCountries = async () => {
        try {
            const { data } = await supabase.from('countries').select('*').eq('status', 'active').order('name');
            setCountries(data || []);
        } finally {
            setLoading(prev => ({ ...prev, countries: false }));
        }
    };

    const fetchStates = async (countryId: string) => {
        setLoading(prev => ({ ...prev, states: true }));
        try {
            const { data } = await supabase.from('states').select('*').eq('country_id', countryId).eq('status', 'active').order('name');
            setStates(data || []);
        } finally {
            setLoading(prev => ({ ...prev, states: false }));
        }
    };

    const fetchCities = async (stateId: string) => {
        setLoading(prev => ({ ...prev, cities: true }));
        try {
            const { data } = await supabase.from('cities').select('*').eq('state_id', stateId).eq('status', 'active').order('name');
            setCities(data || []);
        } finally {
            setLoading(prev => ({ ...prev, cities: false }));
        }
    };

    const handleChange = (field: string, value: any) => {
        onChange({ ...locationData, [field]: value });
    };

    const handlePincodeBlur = async () => {
        const pincode = locationData.zip_code;
        if (pincode && pincode.length >= 5) {
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                const data = await response.json();
                if (data && data[0].Status === 'Success') {
                    const details = data[0].PostOffice[0];
                    handleChange('district_name', details.District);
                    // Append to existing address if not present
                    const newAddress = locationData.address
                        ? `${locationData.address}, ${details.District}, ${details.State}`
                        : `${details.Name}, ${details.District}, ${details.State}`;
                    handleChange('address', newAddress);
                } else {
                    throw new Error('Invalid Pincode');
                }
            } catch (error) {
                console.error("Failed to fetch pincode details", error);
                // Fallback for demo '110001'
                if (pincode === '110001' && !locationData.address) {
                    handleChange('district_name', 'New Delhi');
                    handleChange('address', 'Connaught Place, New Delhi, Delhi');
                }
            }
        }
    };

    const updateMapLocation = async (pos: [number, number]) => {
        setMapPosition(pos);
        // Correctly update both coordinates at once to avoid stale closure issues
        const newLocationData = {
            ...locationData,
            latitude: pos[0],
            longitude: pos[1]
        };

        // Reverse Geocoding to fetch address details
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos[0]}&lon=${pos[1]}`);
            const data = await response.json();
            if (data && data.address) {
                const addr = data.address;
                newLocationData.address = data.display_name;
                newLocationData.district_name = addr.state_district || addr.county || '';
                newLocationData.zip_code = addr.postcode || '';

                // Note: We can try to match Country/State/City if names match our DB
                // For now, we populate the text fields we can control directly
                // Country/State/City IDs would require a lookup against our DB which is complex here
            }
        } catch (error) {
            console.error("Reverse geocoding failed", error);
        }

        onChange(newLocationData);
    };

    const inputClass = `w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-[#2563eb] outline-none transition-all ${theme === 'dark'
        ? 'bg-[#131922] border-gray-700 text-white placeholder:text-gray-600'
        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
        }`;

    const labelClass = `block text-xs font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`;

    return (
        <>
            <div className={`p-6 rounded-xl border space-y-6 ${theme === 'dark' ? 'bg-[#1e2736] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <MapPin size={20} className="text-orange-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Event Location</h3>
                        <p className="text-xs opacity-50">Specify the physical venue for this event.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Address */}
                    <div>
                        <label className={labelClass}>Address <span className="text-red-500">*</span></label>
                        <textarea
                            value={locationData.address || ''}
                            onChange={(e) => handleChange('address', e.target.value)}
                            placeholder="Enter Full Address"
                            className={`${inputClass} min-h-[80px]`}
                        />
                    </div>

                    <div>
                        <button
                            onClick={() => setShowMapModal(true)}
                            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            <MapIcon size={16} /> Show Map / Set Location
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Latitude & Longitude */}
                        <div>
                            <label className={labelClass}>Latitude</label>
                            <input
                                type="number"
                                step="any"
                                value={locationData.latitude || ''}
                                onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
                                placeholder="Latitude"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Longitude</label>
                            <input
                                type="number"
                                step="any"
                                value={locationData.longitude || ''}
                                onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
                                placeholder="Longitude"
                                className={inputClass}
                            />
                        </div>

                        {/* Zip Code (Pincode) - Moved up for better flow */}
                        <div>
                            <label className={labelClass}>Zip/Post Code <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <LocateFixed size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`} />
                                <input
                                    type="text"
                                    value={locationData.zip_code || ''}
                                    onChange={(e) => handleChange('zip_code', e.target.value)}
                                    onBlur={handlePincodeBlur}
                                    placeholder="Enter Pincode (Auto-fills)"
                                    className={`${inputClass} pl-10`}
                                />
                            </div>
                        </div>

                        {/* District (New Field) */}
                        <div>
                            <label className={labelClass}>District</label>
                            <input
                                type="text"
                                value={locationData.district_name || ''}
                                onChange={(e) => handleChange('district_name', e.target.value)}
                                placeholder="District"
                                className={inputClass}
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className={labelClass}>Country <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Globe size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`} />
                                <select
                                    value={locationData.country_id || ''}
                                    onChange={(e) => handleChange('country_id', e.target.value)}
                                    className={`${inputClass} pl-10 appearance-none`}
                                >
                                    <option value="">Select a Country</option>
                                    {countries.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* State */}
                        <div>
                            <label className={labelClass}>State <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Building2 size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`} />
                                <select
                                    value={locationData.state_id || ''}
                                    onChange={(e) => handleChange('state_id', e.target.value)}
                                    disabled={!locationData.country_id}
                                    className={`${inputClass} pl-10 appearance-none disabled:opacity-50`}
                                >
                                    <option value="">Select State</option>
                                    {states.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* City */}
                        <div>
                            <label className={labelClass}>City <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Building size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`} />
                                <select
                                    value={locationData.city_id || ''}
                                    onChange={(e) => handleChange('city_id', e.target.value)}
                                    disabled={!locationData.state_id}
                                    className={`${inputClass} pl-10 appearance-none disabled:opacity-50`}
                                >
                                    <option value="">Select a City</option>
                                    {cities.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Venue Name */}
                        <div className="md:col-span-2">
                            <label className={labelClass}>Venue Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={locationData.venue_name || ''}
                                onChange={(e) => handleChange('venue_name', e.target.value)}
                                placeholder="e.g. Madison Square Garden"
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Modal */}
            {showMapModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={`w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-[#1e2736]' : 'bg-white'}`}>
                        <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
                            <h3 className="font-bold text-lg">Select Location on Map</h3>
                            <button onClick={() => setShowMapModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="h-[500px] w-full bg-gray-100 relative z-0">
                            <MapContainer center={mapPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                                <LayersControl position="topright">
                                    <LayersControl.BaseLayer checked name="Street View">
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                    </LayersControl.BaseLayer>
                                    <LayersControl.BaseLayer name="Satellite View">
                                        <TileLayer
                                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                                        />
                                    </LayersControl.BaseLayer>
                                </LayersControl>
                                <LocationMarker position={mapPosition} setPosition={updateMapLocation} />
                            </MapContainer>
                        </div>
                        <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-black/20">
                            <div className="text-sm opacity-70">
                                Click on the map to set the exact venue location.
                                <br /> Lat: {locationData.latitude?.toFixed(6) || 'N/A'}, Lng: {locationData.longitude?.toFixed(6) || 'N/A'}
                            </div>
                            <button
                                onClick={() => setShowMapModal(false)}
                                className="bg-[#2563eb] hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EventLocation;
