
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { User } from '../../types';
import {
  ChevronLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  MapPin,
  ImageIcon,
  X,
  Globe,
  Settings,
  Moon,
  ChevronRight,
  Zap,
  ChevronDown,
  Image as LucideImage,
  Eye,
  FileSearch,
  Save,
  LayoutDashboard,
  CloudUpload,
  Home,
  Plus,
  Minus,
  Check,
  Info
} from 'lucide-react';
import { generateEventDescription } from '../../services/geminiService.ts';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

import {
  getCountries,
  getStatesForCountry,
  getDistrictsForState,
  getCitiesForDistrict
} from '../../lib/locations.ts';

interface MapModalProps {
  onClose: () => void;
  onSelect: (lat: number, lng: number, address: string) => void;
  initialPos?: [number, number];
}

const MapModal: React.FC<MapModalProps> = ({ onClose, onSelect, initialPos }) => {
  const [position, setPosition] = useState<[number, number]>(initialPos || [19.0760, 72.8777]);
  const [loading, setLoading] = useState(false);

  const fetchAddress = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await response.json();
      const address = data.display_name || `${lat}, ${lng}`;
      onSelect(lat, lng, address);
    } catch (error) {
      console.error("Error fetching address:", error);
      onSelect(lat, lng, `${lat}, ${lng}`);
    } finally {
      setLoading(false);
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        fetchAddress(lat, lng);
      },
    });

    return <Marker position={position} />;
  };

  const ChangeView = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    map.setView(center);
    return null;
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#050716]/90 backdrop-blur-2xl p-12 animate-in fade-in duration-500">
      <div className="bg-slate-900/80 w-full max-w-5xl rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col backdrop-blur-3xl animate-in zoom-in-95">
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="space-y-1">
            <h3 className="text-[10px] font-black text-[#FFB703] uppercase tracking-[0.5em]">Coordinate Sector</h3>
            <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase">Geographic Hub Selection</h4>
          </div>
          <button onClick={onClose} className="w-14 h-14 rounded-full bg-white/5 hover:bg-[#FF006E] flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/10 shadow-xl">
            <X size={28} />
          </button>
        </div>
        <div className="h-[550px] relative">
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%', filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ChangeView center={position} />
            <LocationMarker />
          </MapContainer>
          <div className="absolute bottom-8 left-8 z-[1001] bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 text-[10px] font-black text-white/60 flex items-center gap-4 uppercase tracking-widest shadow-2xl">
            {loading ? <Loader2 size={16} className="animate-spin text-[#FFB703]" /> : <MapPin size={16} className="text-[#FFB703]" />}
            {loading ? 'CALIBRATING POSITION...' : 'MAP INFRASTRUCTURE READY // CLICK TO DEPLOY PIN'}
          </div>
        </div>
        <div className="p-10 border-t border-white/5 flex justify-end bg-white/5">
          <button
            onClick={onClose}
            className="bg-[#38B000] text-white px-12 py-5 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-green-500/20 hover:bg-white hover:text-[#38B000] italic active:scale-95"
          >
            Confirm Coordinate Sync
          </button>
        </div>
      </div>
    </div>
  );
};

interface CreateEventPageProps {
  user: User;
  onAdd: (event: any) => void;
  onVerifyUser: () => void;
}

type CreateStep = 'TYPE' | 'DETAILS';

const CreateEventPage: React.FC<CreateEventPageProps> = ({ user, onAdd }) => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const [currentStep, setCurrentStep] = useState<CreateStep>('TYPE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [dateType, setDateType] = useState<'SINGLE' | 'MULTIPLE'>('SINGLE');
  const [countdownStatus, setCountdownStatus] = useState<'ACTIVE' | 'DEACTIVE'>('ACTIVE');
  const [showMap, setShowMap] = useState(false);
  const [thumbnails, setThumbnails] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    isVirtual: false,
    title: '',
    category: 'Select Category',
    description: '',
    location: '',
    date: '',
    time: '',
    status: 'Draft',
    isFeature: 'No',
    refundPolicy: '',
    country: 'Select a Country',
    state: 'Select a State',
    district: 'Select a District',
    city: 'Select a City',
    zip: '',
    latitude: '',
    longitude: ''
  });

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'clean']
    ],
  };

  const handleDescriptionChange = (content: string) => {
    setFormData({ ...formData, description: content });
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnails(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setGallery(prev => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const handleAIDescription = async () => {
    if (!formData.title) {
      alert("Please enter an event title first.");
      return;
    }
    setLoadingAI(true);
    try {
      const desc = await generateEventDescription(formData.title, formData.category);
      setFormData(prev => ({ ...prev, description: desc }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Event saved successfully!");
      navigate('/organiser/dashboard');
    }, 1500);
  };

  const renderStepType = () => (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-1">
            DEPLOY NEW NODE
          </h2>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            Select the dimensional architecture for your upcoming event legacy.
          </p>
        </div>
        <button
          onClick={() => navigate('/organiser/dashboard')}
          className="bg-white/5 border border-white/10 text-white/40 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all italic active:scale-95"
        >
          Cancel Sequence
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
        <button
          onClick={() => { setFormData({ ...formData, isVirtual: true }); setCurrentStep('DETAILS'); }}
          className="bg-slate-900/40 group rounded-[4rem] p-20 text-center border border-white/5 hover:border-emerald-500/30 transition-all hover:bg-slate-900/60 shadow-2xl flex flex-col items-center justify-center gap-10 backdrop-blur-3xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all border border-emerald-500/20 shadow-2xl relative z-10">
            <CloudUpload size={48} />
          </div>
          <div className="space-y-4 relative z-10">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Online Mutation</h3>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Virtual Coordinate Feed</p>
          </div>
          <div className="absolute top-10 right-10">
            <Zap size={20} className="text-emerald-500/40" />
          </div>
        </button>

        <button
          onClick={() => { setFormData({ ...formData, isVirtual: false }); setCurrentStep('DETAILS'); }}
          className="bg-slate-900/40 group rounded-[4rem] p-20 text-center border border-white/5 hover:border-[#FF006E]/30 transition-all hover:bg-slate-900/60 shadow-2xl flex flex-col items-center justify-center gap-10 backdrop-blur-3xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#FF006E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-24 h-24 bg-[#FF006E]/10 rounded-[2rem] flex items-center justify-center text-[#FF006E] group-hover:scale-110 group-hover:bg-[#FF006E] group-hover:text-white transition-all border border-[#FF006E]/20 shadow-2xl relative z-10">
            <MapPin size={48} />
          </div>
          <div className="space-y-4 relative z-10">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Physical Venue</h3>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Atomic Locale Deployment</p>
          </div>
          <div className="absolute top-10 right-10">
            <Globe size={20} className="text-[#FF006E]/40" />
          </div>
        </button>
      </div>
    </div>
  );

  const renderStepDetails = () => (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentStep('TYPE')}
              className="w-12 h-12 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-white hover:text-black transition-all active:scale-95"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
              Node Parameters<br />
              <span className="text-[10px] not-italic tracking-[0.4em] text-[#FF006E] font-bold">CONFIGURATION PHASE</span>
            </h2>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="bg-white/5 border border-white/10 text-white/40 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all italic flex items-center gap-3">
            <Save size={16} /> Save as Draft
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-[#7209B7] text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#7209B7] transition-all shadow-2xl shadow-purple-500/20 italic flex items-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>Deploy Pulse <Zap size={18} /></>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Configuration Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Metadata Block */}
          <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 p-16 space-y-12 shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-[11px] font-black text-[#FF006E] uppercase tracking-[0.5em] italic">Identity & Descriptor</h3>
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Core linguistic and categorical node definitions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Event Title*</label>
                <input
                  type="text"
                  placeholder="Enter Kinetic Event Title"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[14px] font-black text-white italic outline-none focus:border-[#7209B7] transition-all placeholder:text-white/5"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Sector Category*</label>
                <div className="relative">
                  <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[13px] font-black text-white italic appearance-none outline-none focus:border-[#7209B7] transition-all cursor-pointer">
                    <option className="bg-[#050716]">Select Core Category</option>
                    <option className="bg-[#050716]">Musical Frequency (Concert)</option>
                    <option className="bg-[#050716]">Kinetic Motion (Sports)</option>
                    <option className="bg-[#050716]">Intellectual Sync (Conference)</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Neural Description*</label>
                <button
                  onClick={handleAIDescription}
                  disabled={loadingAI}
                  className="flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-[#7209B7] to-[#FF006E] rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:scale-105 transition-all shadow-xl active:scale-95 disabled:opacity-50 italic"
                >
                  {loadingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI Generate
                </button>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden min-h-[400px] quill-dark">
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  modules={quillModules}
                  placeholder="Inject Detailed Node Description..."
                />
              </div>
            </div>
          </div>

          {/* Temporal & Spatial Block */}
          <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 p-16 space-y-12 shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.5em] italic">Temporal & Spatial Grid</h3>
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Chronological sequencing and locale coordinates.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Chronos Type</label>
                <div className="p-1.5 bg-white/5 border border-white/10 rounded-2xl grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDateType('SINGLE')}
                    className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic ${dateType === 'SINGLE' ? 'bg-[#7209B7] text-white shadow-xl' : 'text-white/20 hover:text-white/40'}`}
                  >
                    Single Pulse
                  </button>
                  <button
                    onClick={() => setDateType('MULTIPLE')}
                    className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic ${dateType === 'MULTIPLE' ? 'bg-[#7209B7] text-white shadow-xl' : 'text-white/20 hover:text-white/40'}`}
                  >
                    Multi Cycle
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Countdown Heartbeat</label>
                <div className="p-1.5 bg-white/5 border border-white/10 rounded-2xl grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCountdownStatus('ACTIVE')}
                    className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic ${countdownStatus === 'ACTIVE' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/10' : 'text-white/20 hover:text-white/40'}`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setCountdownStatus('DEACTIVE')}
                    className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic ${countdownStatus === 'DEACTIVE' ? 'bg-[#FF006E] text-white shadow-xl shadow-pink-500/10' : 'text-white/20 hover:text-white/40'}`}
                  >
                    Muted
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Start Cycle', type: 'date' },
                { label: 'Sync Time', type: 'time' },
                { label: 'End Cycle', type: 'date' },
                { label: 'Decay Time', type: 'time' }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] ml-2">{item.label}</label>
                  <input type={item.type} className="w-full bg-white/5 border border-white/10 rounded-[1.2rem] px-5 py-4 text-[12px] font-black text-white italic outline-none focus:border-[#7209B7] transition-all color-scheme-dark" />
                </div>
              ))}
            </div>

            {!formData.isVirtual && (
              <div className="space-y-8 pt-6 border-t border-white/5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between ml-4">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Locale Address*</label>
                    <button
                      onClick={() => setShowMap(true)}
                      className="text-[9px] font-black text-[#FFB703] uppercase tracking-widest flex items-center gap-2 hover:underline underline-offset-4 active:scale-95 transition-all italic"
                    >
                      <MapPin size={12} /> Sync with Orbital Map
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Atomic Locale Address"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[14px] font-black text-white italic outline-none focus:border-[#7209B7] transition-all placeholder:text-white/5"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Country Node</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[12px] font-black text-white italic appearance-none outline-none focus:border-[#7209B7] transition-all cursor-pointer">
                      <option className="bg-[#050716]">Select Geo-Node</option>
                      {getCountries().map(c => <option key={c.code} value={c.code} className="bg-[#050716]">{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">State/Region</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[12px] font-black text-white italic outline-none" placeholder="Region ID" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">City/Coordinate</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[12px] font-black text-white italic outline-none" placeholder="Locale ID" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-12">
          {/* Artifact Upload Block */}
          <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 p-12 space-y-12 shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-[11px] font-black text-[#FFB703] uppercase tracking-[0.5em] italic">Artifact Imagery</h3>
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Visual transmission synchronization hubs.</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Core Thumbnail*</label>
                <div className="relative group aspect-[320/230] rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-white/20 transition-all">
                  {thumbnails ? (
                    <img src={thumbnails} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Thumbnail" />
                  ) : (
                    <>
                      <LucideImage size={48} className="text-white/10 group-hover:text-[#FFB703]/40 transition-colors" />
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-6">Inject Identity Hub</p>
                    </>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleThumbnailChange} />
                </div>
                <p className="text-white/10 text-[9px] font-black uppercase tracking-widest text-center italic">Optimized Resolution: 320x230</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between ml-4">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Gallery Mesh**</label>
                  <span className="text-[9px] font-black text-[#FFB703] italic">{gallery.length}/10 Nodes</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {gallery.slice(0, 3).map((img, i) => (
                    <div key={i} className="aspect-square rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative group">
                      <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      <button onClick={() => setGallery(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 p-1.5 bg-[#FF006E] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all group">
                    <Plus size={24} className="text-white/10 group-hover:text-[#FFB703] transition-colors" />
                    <input type="file" multiple className="hidden" onChange={handleGalleryChange} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Protocol Block */}
          <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 p-12 space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-[#38B000]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-[#38B000]/10 rounded-2xl flex items-center justify-center text-[#38B000] border border-[#38B000]/20 shadow-2xl">
                <Settings size={28} />
              </div>
              <div>
                <h4 className="font-black text-white text-xl italic uppercase tracking-tighter">System Pulse</h4>
                <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Global Status Registry</p>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Deployment Slot</label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[12px] font-black text-white italic appearance-none outline-none focus:border-emerald-400 transition-all cursor-pointer"
                  >
                    <option className="bg-[#050716]">Protocol: Draft</option>
                    <option className="bg-[#050716]">Protocol: Publish</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between ml-4">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Featured Beacon</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={formData.isFeature === 'Yes'} onChange={(e) => setFormData({ ...formData, isFeature: e.target.checked ? 'Yes' : 'No' })} />
                    <div className="w-14 h-8 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/20 after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500/40 peer-checked:after:bg-emerald-400 border border-white/5"></div>
                  </label>
                </div>
                <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.3em] px-4 leading-relaxed">
                  *Activating the beacon will prioritize this node in the global discovery feed for maximum orbital visibility.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#050716]/60 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/5 space-y-6">
            <div className="flex items-center gap-4 text-white/20 group">
              <Info size={16} className="group-hover:text-emerald-400 transition-colors" />
              <p className="text-[9px] font-black uppercase tracking-widest italic leading-tight">By deploying this node, you agree to the High-Frequency Integrity Standards of the Evento Grid.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent font-inter relative overflow-hidden">
      {/* Absolute Background Image Layer */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('file:///home/raja/.gemini/antigravity/brain/6e645366-9b22-4abc-9ec9-a36d5dd0694f/premium_sidebar_bg_1771147469027.png')` }}
      />
      <div className="fixed inset-0 z-0 bg-[#050716]/95 backdrop-blur-3xl" />

      <main className="relative z-10 px-20 py-24 pb-48">
        {currentStep === 'TYPE' ? renderStepType() : renderStepDetails()}
      </main>

      {showMap && (
        <MapModal
          onClose={() => setShowMap(false)}
          onSelect={(lat, lng, address) => setFormData({
            ...formData,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6),
            location: address
          })}
          initialPos={formData.latitude && formData.longitude ? [parseFloat(formData.latitude), parseFloat(formData.longitude)] : undefined}
        />
      )}
    </div>
  );
};

export default CreateEventPage;
