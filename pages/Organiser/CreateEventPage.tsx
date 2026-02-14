import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { User } from '../../types.ts';
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
  Minus
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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#080c1f] w-full max-w-4xl rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Select Location</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>
        <div className="h-[500px] relative">
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ChangeView center={position} />
            <LocationMarker />
          </MapContainer>
          <div className="absolute bottom-4 left-4 z-[1001] bg-[#050716] p-3 rounded-xl border border-slate-800 text-[10px] text-slate-400">
            {loading ? 'Fetching address...' : 'Click on map to set Latitude, Longitude & Address'}
          </div>
        </div>
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
          >
            Confirm Location
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
    <div className="flex flex-col min-h-screen bg-[#0b0c14]">
      <header className="h-20 bg-[#080c1f] border-b border-slate-800/60 px-12 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center gap-10">
          <h1 className="text-xl font-bold text-slate-200">{t('add_event')}</h1>
          <nav className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
            <Home size={14} className="hover:text-amber-500 cursor-pointer" onClick={() => navigate('/organiser/dashboard')} />
            <ChevronRight size={12} className="text-slate-700" />
            <span className="hover:text-slate-300 cursor-pointer">Event Management</span>
            <ChevronRight size={12} className="text-slate-700" />
            <span className="hover:text-slate-300 cursor-pointer">Choose Event Type</span>
            <ChevronRight size={12} className="text-slate-700" />
            <span className="text-slate-300">Add Event</span>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <button className="bg-[#1d4ed8] hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-lg" onClick={() => navigate(-1)}>
            <ChevronLeft size={16} /> Back
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <button
            onClick={() => { setFormData({ ...formData, isVirtual: true }); setCurrentStep('DETAILS'); }}
            className="bg-[#080c1f] group rounded-2xl p-10 text-center border border-slate-800/60 hover:border-green-500/50 transition-all hover:bg-[#0a0f26] shadow-xl flex flex-col items-center justify-center gap-4"
          >
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 group-hover:scale-105 transition-transform border border-green-500/20">
              <CloudUpload size={24} />
            </div>
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-[0.2em]">Online Event</h3>
          </button>

          <button
            onClick={() => { setFormData({ ...formData, isVirtual: false }); setCurrentStep('DETAILS'); }}
            className="bg-[#080c1f] group rounded-2xl p-10 text-center border border-slate-800/60 hover:border-amber-500/50 transition-all hover:bg-[#0a0f26] shadow-xl flex flex-col items-center justify-center gap-4"
          >
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform border border-amber-500/20">
              <MapPin size={24} />
            </div>
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-[0.2em]">Venue Event</h3>
          </button>
        </div>
      </main>
    </div>
  );

  const renderStepDetails = () => (
    <div className="min-h-screen bg-[#050716] font-inter text-slate-400">
      <header className="h-20 bg-[#080c1f] border-b border-slate-800/60 px-12 flex items-center justify-between sticky top-0 z-[100] shadow-xl">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-black text-slate-200 uppercase italic">Add Event</h1>
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
            <Home size={14} className="text-slate-700" />
            <ChevronRight size={10} />
            <span>Event Management</span>
            <ChevronRight size={10} />
            <span>Choose Event Type</span>
            <ChevronRight size={10} />
            <span className="text-amber-500">Add Event</span>
          </nav>
        </div>
        <button
          onClick={() => setCurrentStep('TYPE')}
          className="bg-[#1d4ed8] hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-[10px] font-black flex items-center gap-2 transition-all uppercase tracking-widest shadow-lg"
        >
          <ChevronLeft size={16} /> Back
        </button>
      </header>

      <main className="p-12 max-w-[1200px] mx-auto space-y-8 pb-32">
        <div className="bg-[#080c1f] rounded-2xl border border-slate-800/60 shadow-2xl overflow-hidden p-8 space-y-12">
          {/* Gallery Images Section */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Gallery Images **</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((img, i) => (
                <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-slate-800">
                  <img src={img} className="w-full h-full object-cover" alt="gallery" />
                  <button
                    onClick={() => setGallery(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed border-slate-800 rounded-2xl aspect-video bg-[#050716]/50 flex flex-col items-center justify-center group hover:border-amber-500/40 transition-all cursor-pointer">
                <input type="file" multiple className="hidden" onChange={handleGalleryChange} />
                <Plus size={20} className="text-slate-600 group-hover:text-amber-500 transition-colors" />
                <p className="text-[8px] font-bold uppercase mt-2 tracking-widest text-slate-600">Add Image</p>
              </label>
            </div>
            <p className="text-amber-500/60 text-[10px] font-bold uppercase tracking-widest italic">Image Size 1170x570</p>
          </div>

          {/* Thumbnail Image Section */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Thumbnail Image*</label>
            <div className="flex flex-col gap-6">
              <div className="w-[320px] h-[230px] bg-[#050716] border border-slate-800 rounded-xl flex flex-col items-center justify-center gap-4 overflow-hidden">
                {thumbnails ? (
                  <img src={thumbnails} className="w-full h-full object-cover" alt="thumbnail" />
                ) : (
                  <>
                    <div className="w-16 h-16 bg-slate-800/30 rounded-full flex items-center justify-center text-slate-700">
                      <LucideImage size={32} />
                    </div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No Image Found</p>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="bg-[#1d4ed8] hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest self-start transition-all cursor-pointer">
                  Choose Image
                  <input type="file" className="hidden" onChange={handleThumbnailChange} />
                </label>
                <p className="text-amber-500/60 text-[10px] font-bold uppercase tracking-widest italic">Image Size : 320x230</p>
              </div>
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Date Type*</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#050716] border border-slate-800 rounded-xl">
                <button
                  onClick={() => setDateType('SINGLE')}
                  className={`py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${dateType === 'SINGLE' ? 'bg-[#1b2140] text-white' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  Single
                </button>
                <button
                  onClick={() => setDateType('MULTIPLE')}
                  className={`py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${dateType === 'MULTIPLE' ? 'bg-[#1b2140] text-white' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  Multiple
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Countdown Status*</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#050716] border border-slate-800 rounded-xl">
                <button
                  onClick={() => setCountdownStatus('ACTIVE')}
                  className={`py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${countdownStatus === 'ACTIVE' ? 'bg-[#1b2140] text-white' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  Active
                </button>
                <button
                  onClick={() => setCountdownStatus('DEACTIVE')}
                  className={`py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${countdownStatus === 'DEACTIVE' ? 'bg-[#1b2140] text-white' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  Deactive
                </button>
              </div>
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Start Date*</label>
              <input type="date" className="w-full bg-[#050716] border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 outline-none focus:border-amber-500/50" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Start Time*</label>
              <input type="time" className="w-full bg-[#050716] border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 outline-none focus:border-amber-500/50" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">End Date*</label>
              <input type="date" className="w-full bg-[#050716] border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 outline-none focus:border-amber-500/50" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">End Time*</label>
              <input type="time" className="w-full bg-[#050716] border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 outline-none focus:border-amber-500/50" />
            </div>
          </div>

          {/* Status & Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Status*</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#050716] border border-slate-800 rounded-xl px-6 py-3.5 text-xs text-slate-400 outline-none focus:border-amber-500/50"
              >
                <option>Draft</option>
                <option>Published</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Is Feature*</label>
              <select
                value={formData.isFeature}
                onChange={(e) => setFormData({ ...formData, isFeature: e.target.value })}
                className="w-full bg-[#050716] border border-slate-800 rounded-xl px-6 py-3.5 text-xs text-slate-400 outline-none focus:border-amber-500/50"
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>
          </div>

          {/* Translation Block (Dynamic Based on Selected Regional Language) */}
          <div className="rounded-2xl border border-slate-800/60 overflow-hidden bg-[#050716]/30">
            <div className="bg-[#6366f1] px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white flex items-center justify-between">
              <span>{currentLanguage.name} Language ({currentLanguage.code === 'en' ? 'Default' : 'Regional'})</span>
              <Globe size={14} />
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{t('event_title')}*</label>
                  <input
                    type="text"
                    className="w-full bg-[#050716] border border-slate-800 rounded-xl px-6 py-3.5 text-xs text-slate-300 outline-none focus:border-amber-500/50"
                    placeholder="Enter Event Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{t('category')}*</label>
                  <select className="w-full bg-[#050716] border border-slate-800 rounded-xl px-6 py-3.5 text-xs text-slate-400 outline-none focus:border-amber-500/50">
                    <option>Select Category</option>
                    <option>Concert</option>
                    <option>Sports</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{t('address')}*</label>
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      className="w-full bg-[#050716] border border-slate-800 rounded-xl px-6 py-3.5 text-xs text-slate-300 outline-none focus:border-amber-500/50"
                      placeholder="Enter Address"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                    <button
                      onClick={() => setShowMap(true)}
                      className="bg-[#1d4ed8] hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest self-start transition-all"
                    >
                      {t('show_map')}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Latitude</label>
                  <input
                    type="text"
                    readOnly
                    className="w-full bg-[#050716] border border-slate-800 rounded-xl px-6 py-3.5 text-xs text-slate-400 cursor-not-allowed"
                    value={formData.latitude}
                    placeholder="Latitude"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Longitude</label>
                  <input
                    type="text"
                    readOnly
                    className="w-full bg-[#050716] border border-slate-800 rounded-xl px-6 py-3.5 text-xs text-slate-400 cursor-not-allowed"
                    value={formData.longitude}
                    placeholder="Longitude"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Country*</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({
                      ...formData,
                      country: e.target.value,
                      state: 'Select a State',
                      district: 'Select a District',
                      city: 'Select a City'
                    })}
                    className="w-full bg-[#050716] border border-slate-800 rounded-xl px-6 py-3.5 text-xs text-slate-400 outline-none focus:border-amber-500/50"
                  >
                    <option disabled>Select a Country</option>
                    {getCountries().map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">State*</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({
                      ...formData,
                      state: e.target.value,
                      district: 'Select a District',
                      city: 'Select a City'
                    })}
                    disabled={formData.country === 'Select a Country'}
                    className="w-full bg-[#050716] border border-slate-800 rounded-xl px-6 py-3.5 text-xs text-slate-400 outline-none focus:border-amber-500/50 disabled:opacity-50"
                  >
                    <option disabled>Select a State</option>
                    {getStatesForCountry(formData.country).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">District*</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({
                      ...formData,
                      district: e.target.value,
                      city: 'Select a City'
                    })}
                    disabled={formData.state === 'Select a State'}
                    className="w-full bg-[#050716] border border-slate-800 rounded-xl px-6 py-3.5 text-xs text-slate-400 outline-none focus:border-amber-500/50 disabled:opacity-50"
                  >
                    <option disabled>Select a District</option>
                    {getDistrictsForState(formData.country, formData.state).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{t('city')}*</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={formData.district === 'Select a District'}
                    className="w-full bg-[#050716] border border-slate-800 rounded-xl px-6 py-3.5 text-xs text-slate-400 outline-none focus:border-amber-500/50 disabled:opacity-50"
                  >
                    <option disabled>Select a City</option>
                    {getCitiesForDistrict(formData.country, formData.state, formData.district).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{t('zip')}</label>
                  <input
                    type="text"
                    className="w-full bg-[#050716] border border-slate-800 rounded-xl px-6 py-3.5 text-xs text-slate-300"
                    placeholder="Enter Zip/Post Code"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  />
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{t('description')}*</label>
                <div className="bg-[#050716] border border-slate-800 rounded-xl overflow-hidden min-h-[300px]">
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    modules={quillModules}
                    placeholder="Enter Detailed Event Description..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Refund Policy*</label>
                <textarea
                  className="w-full bg-[#050716] border border-slate-800 rounded-xl px-6 py-3 text-xs text-slate-400 min-h-[100px]"
                  placeholder="Enter Refund Policy"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-8 flex justify-center">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-16 py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-green-500/10"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>Save <Save size={18} /></>}
            </button>
          </div>
        </div>

        <footer className="py-12 text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] text-center border-t border-slate-800/40">
          <p>Copyright ©2026. All Rights Reserved.</p>
        </footer>
      </main>
    </div>
  );

  return (
    <>
      {currentStep === 'TYPE' ? renderStepType() : renderStepDetails()}
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
    </>
  );
};

export default CreateEventPage;
