import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Event } from '../types';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket } from 'lucide-react';

// Fix for default marker icon in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface EventMapProps {
    events: Event[];
    center?: [number, number];
    zoom?: number;
}

const EventMap: React.FC<EventMapProps> = ({ events, center = [11.0168, 76.9558], zoom = 12 }) => {
    return (
        <div className="w-full h-[600px] rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl relative z-0">
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {events.map((event) => (
                    event.latitude && event.longitude && (
                        <Marker key={event.id} position={[Number(event.latitude), Number(event.longitude)]}>
                            <Popup className="event-popup">
                                <div className="p-2 min-w-[200px] space-y-3">
                                    <div className="aspect-video rounded-xl overflow-hidden mb-2">
                                        <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="font-bold text-[14px] text-[#484848] leading-tight">{event.title}</h3>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-[11px] font-medium text-[#767676]">
                                            <Calendar size={14} className="text-[#ff5862]" />
                                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-medium text-[#767676]">
                                            <MapPin size={14} className="text-[#ff5862]" />
                                            {event.city}
                                        </div>
                                    </div>
                                    <Link
                                        to={`/event/${event.id}`}
                                        className="block w-full py-2 bg-[#ff5862] text-white text-center rounded-lg text-[12px] font-bold hover:bg-[#ff385c] transition-all mt-2"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
};

export default EventMap;
