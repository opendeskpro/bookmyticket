import React, { useState } from 'react';
import Button from '../Shared/UI/Button';
import { Plus, Trash2, Save } from 'lucide-react';
import Card from '../Shared/UI/Card';

interface SeatTier {
    name: string;
    price: number;
    rows: string[]; // e.g., ["A", "B", "C"]
    seatsPerRow: number;
}

interface SeatLayoutBuilderProps {
    onSave: (layout: SeatTier[]) => void;
    initialData?: SeatTier[];
}

const SeatLayoutBuilder: React.FC<SeatLayoutBuilderProps> = ({ onSave, initialData = [] }) => {
    const [tiers, setTiers] = useState<SeatTier[]>(initialData.length > 0 ? initialData : [
        { name: 'VIP', price: 1000, rows: ['A', 'B'], seatsPerRow: 10 },
        { name: 'Standard', price: 500, rows: ['C', 'D', 'E'], seatsPerRow: 12 }
    ]);

    const addTier = () => {
        setTiers([...tiers, { name: 'New Tier', price: 0, rows: [], seatsPerRow: 10 }]);
    };

    const removeTier = (index: number) => {
        setTiers(tiers.filter((_, i) => i !== index));
    };

    const updateTier = (index: number, field: keyof SeatTier, value: any) => {
        const newTiers = [...tiers];
        if (field === 'rows') {
            // Simple string parsing for demo: "A,B,C" -> ["A", "B", "C"]
            newTiers[index][field] = typeof value === 'string' ? value.split(',').map(s => s.trim().toUpperCase()) : value;
        } else {
            newTiers[index][field] = value;
        }
        setTiers(newTiers);
    };

    // Calculate total capacity
    const totalCapacity = tiers.reduce((acc, tier) => acc + (tier.rows.length * tier.seatsPerRow), 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Seat Layout Configuration</h3>
                <div className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                    Total Capacity: <span className="font-bold text-gray-900">{totalCapacity}</span>
                </div>
            </div>

            <div className="space-y-4">
                {tiers.map((tier, index) => (
                    <Card key={index} className="p-4 border-l-4 border-l-[#FF006E]">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-gray-700">Category {index + 1}</h4>
                            <button onClick={() => removeTier(index)} className="text-red-400 hover:text-red-600">
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Tier Name</label>
                                <input
                                    type="text"
                                    value={tier.name}
                                    onChange={(e) => updateTier(index, 'name', e.target.value)}
                                    className="w-full p-2 border border-gray-200 rounded"
                                    placeholder="e.g. VIP"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Price (₹)</label>
                                <input
                                    type="number"
                                    value={tier.price}
                                    onChange={(e) => updateTier(index, 'price', parseInt(e.target.value) || 0)}
                                    className="w-full p-2 border border-gray-200 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Rows (comma separated)</label>
                                <input
                                    type="text"
                                    value={tier.rows.join(', ')}
                                    onChange={(e) => updateTier(index, 'rows', e.target.value)}
                                    className="w-full p-2 border border-gray-200 rounded"
                                    placeholder="A, B, C"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Seats/Row</label>
                                <input
                                    type="number"
                                    value={tier.seatsPerRow}
                                    onChange={(e) => updateTier(index, 'seatsPerRow', parseInt(e.target.value) || 0)}
                                    className="w-full p-2 border border-gray-200 rounded"
                                />
                            </div>
                        </div>

                        {/* simple visual preview of rows */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {tier.rows.map(row => (
                                <span key={row} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 flex items-center gap-1">
                                    Row {row} <span className="text-[10px] bg-gray-200 px-1 rounded-full">{tier.seatsPerRow} seats</span>
                                </span>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex gap-4">
                <Button variant="outline" onClick={addTier} leftIcon={<Plus size={18} />} className="flex-1 border-dashed">
                    Add Ticket Tier
                </Button>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
                <Button onClick={() => onSave(tiers)} leftIcon={<Save size={18} />}>
                    Save Layout
                </Button>
            </div>
        </div>
    );
};

export default SeatLayoutBuilder;
