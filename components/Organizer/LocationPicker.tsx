import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search, Map as MapIcon, CheckCircle2, AlertCircle } from 'lucide-react';

declare global {
    interface Window {
        google: any;
    }
}

interface LocationData {
    latitude: number;
    longitude: number;
    country: string;
    state: string;
    district: string;
    city: string;
    pincode: string;
    address: string;
}

interface LocationPickerProps {
    onLocationSelect: (data: LocationData) => void;
    initialValue?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, initialValue }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!window.google) {
            setError("Google Maps API not loaded. Check your API key in index.html");
            return;
        }

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current!, {
            types: ['geocode', 'establishment'],
            componentRestrictions: { country: 'in' } // Restrict to India as per user context
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
                setError("No location details available for this selection.");
                return;
            }

            const addressComponents = place.address_components || [];
            const data: LocationData = {
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng(),
                country: '',
                state: '',
                district: '',
                city: '',
                pincode: '',
                address: place.formatted_address || ''
            };

            addressComponents.forEach(component => {
                const types = component.types;
                if (types.includes('country')) data.country = component.long_name;
                if (types.includes('administrative_area_level_1')) data.state = component.long_name;
                if (types.includes('administrative_area_level_2')) data.district = component.long_name;
                if (types.includes('locality')) data.city = component.long_name;
                if (types.includes('postal_code')) data.pincode = component.long_name;
            });

            // Fallback for city if locality is missing
            if (!data.city) {
                const subLocality = addressComponents.find(c => c.types.includes('sublocality_level_1'));
                if (subLocality) data.city = subLocality.long_name;
            }

            setSelectedLocation(data);
            onLocationSelect(data);
            setError(null);
        });
    }, [onLocationSelect]);

    // Simulation helper for environments without API keys
    const handleSimulate = () => {
        const mockData: LocationData = {
            latitude: 11.0168,
            longitude: 76.9558,
            country: 'India',
            state: 'Tamil Nadu',
            district: 'Coimbatore',
            city: 'Coimbatore',
            pincode: '641001',
            address: 'Railway Ave, Coimbatore, Tamil Nadu 641001, India'
        };
        setSelectedLocation(mockData);
        onLocationSelect(mockData);
        if (inputRef.current) inputRef.current.value = mockData.address;
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-[#F84464]" /> Search Location on Google Maps (Mandatory)
                </label>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F84464] transition-colors" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for venue, landmark or area..."
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#F84464] focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-800 shadow-sm"
                        defaultValue={initialValue}
                    />
                </div>
                {error && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs flex items-center gap-2 animate-in slide-in-from-top-1">
                        <AlertCircle size={14} /> {error}
                        <button
                            type="button"
                            onClick={handleSimulate}
                            className="ml-auto bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors font-bold"
                        >
                            Simulate Select
                        </button>
                    </div>
                )}
            </div>

            {selectedLocation && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="p-4 bg-green-50/50 border border-green-100 rounded-2xl space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-green-600/70">City & District</p>
                        <p className="text-sm font-bold text-green-900">{selectedLocation.city}, {selectedLocation.district}</p>
                    </div>
                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600/70">State & Pincode</p>
                        <p className="text-sm font-bold text-blue-900">{selectedLocation.state} - {selectedLocation.pincode}</p>
                    </div>
                    <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-purple-600/70">Coordinates</p>
                        <p className="text-sm font-bold text-purple-900">{selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}</p>
                    </div>
                </div>
            )}

            {!selectedLocation && !error && (
                <div className="p-6 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3 text-center opacity-60">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <MapIcon size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500">Pick a location on the map to auto-fill details</p>
                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mt-1">Latitude, Longitude, State, Country, Pincode will be captured</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationPicker;
