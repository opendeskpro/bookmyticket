
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Theater, Screen, SeatTier } from '../../../types';
import { toast } from 'react-hot-toast';
import { MapPin, Monitor, Plus, Settings } from 'lucide-react';

const ManageTheaters = () => {
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
    const [screens, setScreens] = useState<Screen[]>([]);
    const [cities, setCities] = useState<any[]>([]); // simplified

    // Load initial data
    useEffect(() => {
        loadTheaters();
        loadCities();
    }, []);

    // Load screens when theater selected
    useEffect(() => {
        if (selectedTheater) {
            loadScreens(selectedTheater.id);
        } else {
            setScreens([]);
        }
    }, [selectedTheater]);

    const loadTheaters = async () => {
        const { data } = await supabase.from('theaters').select('*');
        if (data) setTheaters(data);
    };

    const loadCities = async () => {
        const { data } = await supabase.from('cities').select('*');
        if (data) setCities(data);
    };

    const loadScreens = async (theaterId: string) => {
        const { data } = await supabase.from('screens').select('*').eq('theater_id', theaterId);
        if (data) setScreens(data);
    };

    const handleCreateTheater = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        // ... simplified form extraction
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const cityId = (form.elements.namedItem('city') as HTMLSelectElement).value;

        const { error } = await supabase.from('theaters').insert([{
            name, city_id: cityId, owner_id: (await supabase.auth.getUser()).data.user?.id, address: 'Address'
        }]);

        if (!error) {
            toast.success("Theater added");
            loadTheaters();
            form.reset();
        } else {
            toast.error(error.message);
        }
    };

    const handleCreateScreen = async () => {
        if (!selectedTheater) return;
        const name = prompt("Screen Name (e.g. Screen 1):");
        if (!name) return;

        const { data, error } = await supabase.from('screens').insert([{
            theater_id: selectedTheater.id,
            name,
            type: 'Standard'
        }]).select().single();

        if (!error && data) {
            setScreens([...screens, data]);
            // Auto create default tiers
            await createDefaultTiers(data.id);
            toast.success("Screen created with default tiers");
        }
    };

    const createDefaultTiers = async (screenId: string) => {
        await supabase.from('seat_tiers').insert([
            { screen_id: screenId, name: 'Standard', price: 150, display_order: 1 },
            { screen_id: screenId, name: 'Premium', price: 250, display_order: 2 },
            { screen_id: screenId, name: 'Gold', price: 350, display_order: 3 },
        ]);
    };

    const generateSeats = async (screenId: string) => {
        // Simplified seed for demo
        if (!window.confirm("This will generate a demo layout for this screen. Continue?")) return;

        // Get standard tier
        const { data: tier } = await supabase.from('seat_tiers').select('id').eq('screen_id', screenId).eq('name', 'Standard').single();
        if (!tier) return toast.error("No Standard tier found");

        const rows = ['A', 'B', 'C', 'D', 'E'];
        const seats = [];

        for (let r = 0; r < rows.length; r++) {
            for (let s = 1; s <= 10; s++) {
                seats.push({
                    screen_id: screenId,
                    tier_id: tier.id,
                    row_label: rows[r],
                    seat_number: s,
                    grid_row: r,
                    grid_col: s,
                    is_aisle: s === 5
                });
            }
        }

        const { error } = await supabase.from('seats').insert(seats);
        if (!error) toast.success("50 Seats generated!");
        else toast.error(error.message);
    };

    return (
        <div className="p-8 h-[calc(100vh-64px)] grid grid-cols-12 gap-8">
            {/* Sidebar - List Theaters */}
            <div className="col-span-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-lg">Theaters</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {theaters.map(theater => (
                        <div
                            key={theater.id}
                            onClick={() => setSelectedTheater(theater)}
                            className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedTheater?.id === theater.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-gray-100 hover:border-indigo-100'}`}
                        >
                            <h3 className="font-bold text-gray-800">{theater.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                <MapPin size={12} /> {cities.find(c => c.id === theater.city_id)?.name || 'City'}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <h3 className="text-xs font-bold uppercase text-gray-400 mb-3">Add New Theater</h3>
                    <form onSubmit={handleCreateTheater} className="space-y-3">
                        <input name="name" placeholder="Theater Name" required className="w-full text-sm px-3 py-2 border rounded-lg" />
                        <select name="city" required className="w-full text-sm px-3 py-2 border rounded-lg">
                            <option value="">Select City</option>
                            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <button className="w-full bg-indigo-600 text-white text-sm font-bold py-2 rounded-lg">Create</button>
                    </form>
                </div>
            </div>

            {/* Main Content - Screens */}
            <div className="col-span-8 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                {selectedTheater ? (
                    <>
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h2 className="font-bold text-xl flex items-center gap-2"><Monitor className="text-indigo-600" /> {selectedTheater.name} Screens</h2>
                                <p className="text-sm text-gray-500 mt-1">{screens.length} Screens Configured</p>
                            </div>
                            <button onClick={handleCreateScreen} className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-100">
                                <Plus size={16} /> Add Screen
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-2 gap-6">
                            {screens.map(screen => (
                                <div key={screen.id} className="border border-gray-200 rounded-xl p-6 relative group hover:shadow-md transition-shadow">
                                    <h3 className="font-bold text-lg mb-2">{screen.name}</h3>
                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-600">{screen.type}</span>

                                    <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                                        <button
                                            onClick={() => generateSeats(screen.id)}
                                            className="flex-1 text-xs font-bold text-indigo-600 bg-indigo-50 py-2 rounded hover:bg-indigo-100"
                                        >
                                            Generate Layout
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-gray-600">
                                            <Settings size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {screens.length === 0 && (
                                <div className="col-span-2 text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                    No screens added yet. Click "Add Screen" to begin.
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <Monitor size={48} className="mb-4 opacity-20" />
                        <p>Select a theater to manage screens</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageTheaters;
