import React from 'react';
import { Smartphone, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const GetAppPage = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-black text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#FF006E_0%,_transparent_50%)]"></div>
                </div>

                <div className="max-w-[1440px] w-[95%] mx-auto px-4 py-20 lg:py-32 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Content */}
                        <div className="flex-1 space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FF006E] text-sm font-medium">
                                <Smartphone size={16} />
                                <span>Mobile App</span>
                            </div>

                            <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                                Book Tickets Faster<br />
                                <span className="text-[#FF006E]">Anytime, Anywhere.</span>
                            </h1>

                            <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Experience the ultimate convenience with the BookMyTicket mobile app.
                                Get exclusive deals, real-time notifications, and paperless entry
                                to your favorite events.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                                <button className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-9 w-9 object-contain" />
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-xs font-medium text-gray-800">Get it on</span>
                                        <span className="text-base font-bold">Google Play</span>
                                    </div>
                                </button>
                                <button className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                                    <div className="h-9 w-9 flex items-center justify-center">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg" alt="App Store" className="h-8 w-8 object-contain invert" />
                                    </div>
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-xs font-medium text-gray-800">Get it on the</span>
                                        <span className="text-base font-bold">App Store</span>
                                    </div>
                                </button>
                            </div>

                            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-sm font-medium text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-black flex items-center justify-center text-xs">
                                                U{i}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-white">50K+ Downloads</span>
                                </div>
                                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                                <div className="flex items-center gap-1">
                                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-white">4.8/5 Rating</span>
                                </div>
                            </div>
                        </div>

                        {/* Visual / Mockup Placeholder */}
                        <div className="flex-1 relative">
                            <div className="relative w-[300px] h-[600px] mx-auto bg-gray-800 rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden">
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-6 bg-gray-900 rounded-b-2xl z-20"></div>
                                {/* Screen Content */}
                                <div className="w-full h-full bg-white flex flex-col pt-12">
                                    <div className="px-6 pb-4">
                                        <div className="h-8 w-8 rounded-full bg-gray-100 mb-4"></div>
                                        <div className="h-6 w-3/4 bg-gray-100 rounded mb-2"></div>
                                        <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                                    </div>
                                    <div className="flex-1 bg-gray-50 p-4 space-y-3">
                                        <div className="h-32 bg-white rounded-xl shadow-sm"></div>
                                        <div className="h-32 bg-white rounded-xl shadow-sm"></div>
                                        <div className="h-32 bg-white rounded-xl shadow-sm"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Floating Elements */}
                            <div className="absolute top-20 -right-10 bg-white text-black p-4 rounded-xl shadow-xl animate-bounce">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-full">
                                        <Check size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">Booking Confirmed</p>
                                        <p className="font-bold">Concert Ticket x2</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-[1440px] w-[95%] mx-auto py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Why Download the App?</h2>
                    <p className="text-gray-500">Enhance your event experience with exclusive mobile-only features.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Instant Access', desc: 'Your tickets are always available on your phone, even offline.', icon: '⚡' },
                        { title: 'Real-time Alerts', desc: 'Get notified about gate changes, delays, and exclusive offers.', icon: '🔔' },
                        { title: 'Seamless Booking', desc: 'Secure checkout in seconds with saved payment methods.', icon: '💳' }
                    ].map((feature, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-gray-100">
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GetAppPage;
