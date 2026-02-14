
import React, { useState } from 'react';
import { Play, Star, Calendar, Clock, MapPin, Search, Ticket, Heart, Zap, Loader2 } from 'lucide-react';

const MOCK_MOVIES = [
  {
    id: 'm1',
    title: 'Interstellar: The Re-Release',
    genre: 'Sci-Fi / Drama',
    rating: '9.4',
    language: 'English',
    duration: '2h 49m',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&h=1200&auto=format&fit=crop',
    status: 'Bookable'
  },
  {
    id: 'm2',
    title: 'Neon Nights: Cyberpunk 2077',
    genre: 'Action / Sci-Fi',
    rating: '8.7',
    language: 'English',
    duration: '2h 15m',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=800&h=1200&auto=format&fit=crop',
    status: 'Bookable'
  },
  {
    id: 'm3',
    title: 'The Great Indian Kitchen',
    genre: 'Drama / Family',
    rating: '9.1',
    language: 'Hindi',
    duration: '1h 58m',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&h=1200&auto=format&fit=crop',
    status: 'Coming Soon'
  },
  {
    id: 'm4',
    title: 'Avatar: Way of Water',
    genre: 'Adventure / Fantasy',
    rating: '8.2',
    language: 'English',
    duration: '3h 12m',
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=800&h=1200&auto=format&fit=crop',
    status: 'Bookable'
  }
];

const MoviesPage: React.FC = () => {
  const [bookingMovie, setBookingMovie] = useState<any>(null);
  const [step, setStep] = useState(1); // 1: Info, 2: Seating, 3: Success
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSeat = (id: string) => {
    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter(s => s !== id));
    } else {
      setSelectedSeats([...selectedSeats, id]);
    }
  };

  const handleBook = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  return (
    <div className="bg-[#fffcfd] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div>
            <h1 className="text-5xl font-black text-slate-900 mb-4 flex items-center gap-4">
              Movies at Book My Ticket <Play className="text-[#ff3b5c]" size={40} fill="currentColor" />
            </h1>
            <p className="text-slate-500 text-lg font-medium">Grab your popcorn! The biggest blockbusters are here.</p>
          </div>
          <div className="flex gap-4 p-1.5 bg-white rounded-2xl border shadow-sm w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search movies..." 
              className="px-4 py-2 outline-none font-bold text-sm w-full md:w-64"
            />
            <button className="bg-[#ff3b5c] text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-pink-100">
              Find
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {MOCK_MOVIES.map(movie => (
            <div key={movie.id} className="group cursor-pointer">
              <div className="aspect-[2/3] rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-slate-200 mb-6">
                <img src={movie.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={movie.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                   <button 
                     onClick={() => { if (movie.status === 'Bookable') setBookingMovie(movie); }}
                     className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all ${movie.status === 'Bookable' ? 'bg-[#ff3b5c] text-white hover:bg-[#ff1f45]' : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`}
                   >
                     {movie.status === 'Bookable' ? 'Book Now' : 'Coming Soon'}
                   </button>
                </div>
                {movie.status === 'Coming Soon' && (
                  <div className="absolute top-6 left-6">
                    <span className="bg-yellow-400 text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Coming Soon</span>
                  </div>
                )}
                <div className="absolute top-6 right-6">
                   <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                      <Star size={12} className="text-yellow-500" fill="currentColor" />
                      <span className="text-[10px] font-black text-slate-900">{movie.rating}</span>
                   </div>
                </div>
              </div>
              <h3 className="font-black text-slate-900 text-xl mb-2 leading-tight group-hover:text-[#ff3b5c] transition-colors">{movie.title}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                {movie.genre} • {movie.language}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingMovie && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => { setBookingMovie(null); setStep(1); }}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh]">
            <div className="w-full md:w-80 bg-slate-900 text-white p-10 flex flex-col">
               <img src={bookingMovie.image} className="w-40 h-60 rounded-2xl object-cover shadow-2xl mx-auto mb-8" />
               <h2 className="text-2xl font-black mb-4">{bookingMovie.title}</h2>
               <div className="space-y-4 mb-auto">
                  <div className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                    <Star size={18} className="text-yellow-400" /> {bookingMovie.rating}/10
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                    <Clock size={18} className="text-[#ff3b5c]" /> {bookingMovie.duration}
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                    <MapPin size={18} className="text-[#ff3b5c]" /> Cinepolis, Coimbatore
                  </div>
               </div>
               <div className="pt-8 border-t border-white/10 mt-8">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Selected Seats</p>
                  <div className="flex flex-wrap gap-2">
                     {selectedSeats.map(s => <span key={s} className="bg-[#ff3b5c] text-white px-3 py-1 rounded-lg text-xs font-black">{s}</span>)}
                     {selectedSeats.length === 0 && <span className="text-slate-600 italic text-xs">None</span>}
                  </div>
               </div>
            </div>

            <div className="flex-1 p-10 flex flex-col overflow-y-auto">
              {step === 1 && (
                <div className="space-y-12 h-full flex flex-col">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-8">Select Showtime</h3>
                    <div className="flex flex-wrap gap-4">
                      {['10:30 AM', '01:45 PM', '05:00 PM', '08:30 PM', '11:45 PM'].map((time, i) => (
                        <button key={time} className={`px-6 py-4 rounded-2xl border-2 font-black text-sm transition-all ${i === 2 ? 'border-[#ff3b5c] bg-pink-50 text-[#ff3b5c]' : 'border-slate-50 hover:border-pink-200'}`}>
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-900 mb-8">Select Seats</h3>
                    <div className="flex flex-col items-center gap-4">
                       <div className="w-full h-2 bg-slate-200 rounded-full mb-12 relative">
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Screen this way</span>
                       </div>
                       <div className="grid grid-cols-10 gap-3">
                         {Array.from({length: 60}).map((_, i) => {
                           const row = String.fromCharCode(65 + Math.floor(i / 10));
                           const num = (i % 10) + 1;
                           const id = `${row}${num}`;
                           const isSelected = selectedSeats.includes(id);
                           const isReserved = [12, 13, 25, 42].includes(i);
                           return (
                             <button 
                               key={id} 
                               disabled={isReserved}
                               onClick={() => toggleSeat(id)}
                               className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${
                                 isReserved ? 'bg-slate-100 text-slate-300 cursor-not-allowed' :
                                 isSelected ? 'bg-[#ff3b5c] text-white shadow-lg' :
                                 'bg-slate-50 text-slate-500 hover:bg-pink-100'
                               }`}
                             >
                               {id}
                             </button>
                           );
                         })}
                       </div>
                    </div>
                  </div>

                  <button 
                    disabled={selectedSeats.length === 0}
                    onClick={() => setStep(2)}
                    className="w-full bg-[#ff3b5c] hover:bg-[#ff1f45] disabled:opacity-50 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-pink-200 transition-all flex items-center justify-center gap-3 mt-8"
                  >
                    Confirm Seats (₹{selectedSeats.length * 250}) <Zap size={20} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="h-full flex flex-col justify-center max-w-md mx-auto w-full">
                   <h3 className="text-3xl font-black text-slate-900 mb-8 text-center">Checkout</h3>
                   <div className="space-y-4 mb-12">
                      <div className="flex justify-between font-bold text-slate-600">
                         <span>Tickets ({selectedSeats.length})</span>
                         <span>₹{selectedSeats.length * 250}</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-600">
                         <span>Convenience Fee</span>
                         <span>₹45</span>
                      </div>
                      <div className="pt-4 border-t flex justify-between text-2xl font-black text-slate-900">
                         <span>Total</span>
                         <span className="text-[#ff3b5c]">₹{selectedSeats.length * 250 + 45}</span>
                      </div>
                   </div>
                   <button 
                     onClick={handleBook}
                     disabled={loading}
                     className="w-full bg-[#ff3b5c] hover:bg-[#ff1f45] text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-pink-200 transition-all flex items-center justify-center gap-3"
                   >
                     {loading ? <Loader2 className="animate-spin" /> : "Pay & Book Tickets"}
                   </button>
                </div>
              )}

              {step === 3 && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                   <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-8 border border-green-100">
                      <Ticket size={48} />
                   </div>
                   <h3 className="text-4xl font-black text-slate-900 mb-4">Tickets Booked!</h3>
                   <p className="text-slate-500 font-medium mb-12 max-w-sm">
                     Your reservation at Cinepolis is confirmed. Check your 'My Tickets' section for the QR code.
                   </p>
                   <button 
                     onClick={() => { setBookingMovie(null); setStep(1); }}
                     className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black shadow-xl hover:bg-slate-800 transition-all"
                   >
                     Awesome, Take Me Back
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
