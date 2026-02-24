import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { User } from '../../types';
import { supabase } from '../../lib/supabase';
import { CreditCard, Shield, Key, Eye, EyeOff, Save, Info } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentSettingsProps {
    user: User | null;
}

const PaymentSettings: React.FC<PaymentSettingsProps> = ({ user }) => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [activeGateway, setActiveGateway] = useState('razorpay');
    const [showKey, setShowKey] = useState<Record<string, boolean>>({});

    const [config, setConfig] = useState<any>({
        razorpay: { enabled: true, key_id: '', key_secret: '', mode: 'test' },
        stripe: { enabled: false, publishable_key: '', secret_key: '', mode: 'test' },
        payu: { enabled: false, merchant_key: '', salt: '', mode: 'test' }
    });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const { data, error } = await supabase
                    .from('site_config')
                    .select('config_value')
                    .eq('section_key', 'payment_gateways')
                    .single();

                if (error && error.code !== 'PGRST116') throw error;
                if (data) {
                    setConfig(data.config_value);
                }
            } catch (error) {
                console.error('Error fetching payment config:', error);
            } finally {
                setFetching(false);
            }
        };
        fetchConfig();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('site_config')
                .upsert({
                    section_key: 'payment_gateways',
                    config_value: config
                }, { onConflict: 'section_key' });

            if (error) throw error;
            toast.success('Payment settings updated successfully');
        } catch (error: any) {
            toast.error('Failed to save settings');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateGatewayField = (gateway: string, field: string, value: any) => {
        setConfig((prev: any) => ({
            ...prev,
            [gateway]: {
                ...prev[gateway],
                [field]: value
            }
        }));
    };

    const toggleKeyVisibility = (field: string) => {
        setShowKey(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const gateways = [
        { id: 'razorpay', name: 'Razorpay', color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'stripe', name: 'Stripe', color: 'text-[#635BFF]', bg: 'bg-[#635BFF]/10' },
        { id: 'payu', name: 'PayU', color: 'text-[#ABC32E]', bg: 'bg-[#ABC32E]/10' }
    ];

    if (fetching) {
        return (
            <DashboardLayout user={user}>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7c3aed]"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Payment Gateways</h1>
                        <p className="text-gray-500 text-sm font-medium">Configure and manage your payment service providers.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 bg-[#7c3aed] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#6d28d9] transition-all disabled:opacity-50"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                        Save Settings
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar Tabs */}
                    <div className="md:col-span-1 space-y-2">
                        {gateways.map((g) => (
                            <button
                                key={g.id}
                                onClick={() => setActiveGateway(g.id)}
                                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-between ${activeGateway === g.id
                                        ? `${g.bg} ${g.color} ring-1 ring-inset ring-current`
                                        : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                {g.name}
                                {config[g.id].enabled && <div className="w-2 h-2 rounded-full bg-green-500" />}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${gateways.find(g => g.id === activeGateway)?.bg}`}>
                                    <CreditCard className={gateways.find(g => g.id === activeGateway)?.color} />
                                </div>
                                <h3 className="font-black text-lg text-gray-900">{gateways.find(g => g.id === activeGateway)?.name} Configuration</h3>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={config[activeGateway].enabled}
                                    onChange={(e) => updateGatewayField(activeGateway, 'enabled', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                <span className="ms-3 text-sm font-bold text-gray-700">Enable</span>
                            </label>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Environment Mode</label>
                                <div className="flex gap-4">
                                    {['test', 'live'].map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => updateGatewayField(activeGateway, 'mode', mode)}
                                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold border transition-all ${config[activeGateway].mode === mode
                                                    ? 'bg-[#7c3aed] border-[#7c3aed] text-white'
                                                    : 'bg-white border-gray-200 text-gray-500 hover:border-[#7c3aed]'
                                                }`}
                                        >
                                            {mode.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {activeGateway === 'razorpay' && (
                                <>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Key ID</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#7c3aed]/20"
                                                placeholder="rzp_test_..."
                                                value={config.razorpay.key_id}
                                                onChange={(e) => updateGatewayField('razorpay', 'key_id', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Key Secret</label>
                                        <div className="relative">
                                            <input
                                                type={showKey.razorpay_secret ? 'text' : 'password'}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-12 text-sm font-bold outline-none focus:ring-2 focus:ring-[#7c3aed]/20"
                                                placeholder="••••••••••••••••"
                                                value={config.razorpay.key_secret}
                                                onChange={(e) => updateGatewayField('razorpay', 'key_secret', e.target.value)}
                                            />
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <button
                                                onClick={() => toggleKeyVisibility('razorpay_secret')}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showKey.razorpay_secret ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeGateway === 'stripe' && (
                                <>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Publishable Key</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#7c3aed]/20"
                                            placeholder="pk_test_..."
                                            value={config.stripe.publishable_key}
                                            onChange={(e) => updateGatewayField('stripe', 'publishable_key', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Secret Key</label>
                                        <div className="relative">
                                            <input
                                                type={showKey.stripe_secret ? 'text' : 'password'}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-12 text-sm font-bold outline-none focus:ring-2 focus:ring-[#7c3aed]/20"
                                                placeholder="sk_test_..."
                                                value={config.stripe.secret_key}
                                                onChange={(e) => updateGatewayField('stripe', 'secret_key', e.target.value)}
                                            />
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <button
                                                onClick={() => toggleKeyVisibility('stripe_secret')}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showKey.stripe_secret ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeGateway === 'payu' && (
                                <>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Merchant Key</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#7c3aed]/20"
                                            value={config.payu.merchant_key}
                                            onChange={(e) => updateGatewayField('payu', 'merchant_key', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Salt</label>
                                        <div className="relative">
                                            <input
                                                type={showKey.payu_salt ? 'text' : 'password'}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-12 text-sm font-bold outline-none focus:ring-2 focus:ring-[#7c3aed]/20"
                                                value={config.payu.salt}
                                                onChange={(e) => updateGatewayField('payu', 'salt', e.target.value)}
                                            />
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <button
                                                onClick={() => toggleKeyVisibility('payu_salt')}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showKey.payu_salt ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl flex gap-3">
                            <Info className="text-blue-500 shrink-0" size={20} />
                            <p className="text-[13px] text-blue-700 font-medium leading-relaxed">
                                <strong>Important:</strong> Ensure you are using the correct credentials for the selected mode (Test or Live). Webhooks should be configured in your payment provider dashboard to handle asynchronous events.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PaymentSettings;
