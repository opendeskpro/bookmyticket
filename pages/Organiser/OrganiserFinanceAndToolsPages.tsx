import React from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { validateTicket } from '../../lib/supabase';
import {
  Camera,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Keyboard,
  Plus,
  Search,
  ScanLine,
  ChevronRight,
  Globe,
  IndianRupee,
  TrendingUp,
  Calendar,
  CreditCard,
  Zap,
  Clock,
  History,
  TrendingDown,
  Info,
  KeyRound,
  PlusCircle,
  Headset
} from 'lucide-react';

export const WithdrawPage: React.FC = () => {
  const rows = [
    {
      id: '69084f102e30be',
      method: 'Bank Transfer',
      totalAmount: 100,
      totalCharge: 28,
      receivable: 72,
      status: 'PENDING',
    },
    {
      id: '68e9c98e1c842f',
      method: 'UPI',
      totalAmount: 150,
      totalCharge: 5,
      receivable: 145,
      status: 'PENDING',
    },
    {
      id: '68e39d7c517c7',
      method: 'PayPal',
      totalAmount: 100,
      totalCharge: 6.88,
      receivable: 93.12,
      status: 'DECLINED',
    },
  ];

  const statusClass = (status: string) => {
    if (status === 'PENDING') {
      return 'bg-amber-500/10 text-amber-300 border border-amber-500/40';
    }
    if (status === 'DECLINED') {
      return 'bg-rose-500/10 text-rose-300 border border-rose-500/40';
    }
    return 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40';
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Financial Withdraw</h2>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            Securely extract your earnings to verified bank nodes.
          </p>
        </div>
        <button className="px-8 py-3.5 bg-[#38B000] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#38B000] transition-all shadow-2xl shadow-green-500/20 active:scale-95 italic flex items-center gap-3">
          <Plus size={16} /> Withdraw Now
        </button>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 p-10 overflow-hidden shadow-2xl relative">
        <div className="flex items-center justify-between mb-10 relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Total Terminal Balance</span>
            <span className="text-2xl font-black text-[#38B000] italic">₹ 48,373.10</span>
          </div>
          <div className="flex items-center gap-6">
            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Display</label>
            <select className="bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 outline-none">
              <option className="bg-[#050716]">10</option>
              <option className="bg-[#050716]">25</option>
              <option className="bg-[#050716]">50</option>
            </select>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/5 bg-black/20 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest border-b border-white/5">
                <th className="px-8 py-5">Withdraw ID</th>
                <th className="px-6 py-5">Method</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Charge</th>
                <th className="px-6 py-5">Receivable</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action Hub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-8 py-6 text-[11px] font-black text-white/60 font-mono italic">{r.id}</td>
                  <td className="px-6 py-6 font-black text-white text-[11px] uppercase tracking-widest italic">{r.method}</td>
                  <td className="px-6 py-6 font-black text-white text-[11px]">₹ {r.totalAmount}</td>
                  <td className="px-6 py-6 font-black text-[#FF006E] text-[11px]">₹ {r.totalCharge}</td>
                  <td className="px-6 py-6 font-black text-[#38B000] text-[11px]">₹ {r.receivable}</td>
                  <td className="px-6 py-6">
                    <span
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${statusClass(
                        r.status,
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 text-white/40 border border-white/10 hover:bg-white hover:text-black hover:scale-105 transition-all shadow-xl active:scale-95 italic">
                      Verify Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

type TransactionStatus = 'PAID' | 'UNPAID';

interface TransactionRow {
  id: string;
  type: string;
  method: string;
  preBalance: number;
  amount: number;
  afterBalance: number;
  status: TransactionStatus;
}

const TRANSACTIONS: TransactionRow[] = [
  {
    id: '#1763201580',
    type: 'Event Booking',
    method: 'Citibank',
    preBalance: 48164.1,
    amount: 209,
    afterBalance: 48373.1,
    status: 'PAID',
  },
  {
    id: '#1762929501',
    type: 'Event Booking',
    method: 'Citibank',
    preBalance: 47819.3,
    amount: 344.85,
    afterBalance: 48164.15,
    status: 'PAID',
  },
  {
    id: '#1762844935',
    type: 'Event Booking',
    method: 'Citibank',
    preBalance: 47463.4,
    amount: 173.94,
    afterBalance: 47819.34,
    status: 'PAID',
  },
  {
    id: '#1762844751',
    type: 'Event Booking',
    method: 'Citibank',
    preBalance: 47300.6,
    amount: 344.85,
    afterBalance: 47645.45,
    status: 'PAID',
  },
  {
    id: '#1762606685',
    type: 'Event Booking',
    method: 'Citibank',
    preBalance: 47126.7,
    amount: 173.94,
    afterBalance: 47300.64,
    status: 'PAID',
  },
  {
    id: '#1762413407',
    type: 'Event Booking',
    method: 'Citibank',
    preBalance: 46936.7,
    amount: 190,
    afterBalance: 47126.7,
    status: 'PAID',
  },
  {
    id: '#1762169656',
    type: 'Event Booking',
    method: 'Citibank',
    preBalance: 46915.8,
    amount: 20.9,
    afterBalance: 46936.7,
    status: 'PAID',
  },
  {
    id: '#1762169496',
    type: 'Event Booking',
    method: 'Citibank',
    preBalance: 46894.9,
    amount: 20.9,
    afterBalance: 46915.8,
    status: 'PAID',
  },
  {
    id: '#1762168999',
    type: 'Event Booking',
    method: 'Bank of America',
    preBalance: 46875.9,
    amount: 19,
    afterBalance: 46894.9,
    status: 'PAID',
  },
  {
    id: '#1762148848',
    type: 'Withdraw',
    method: 'Bitcoin',
    preBalance: 46975.9,
    amount: -100,
    afterBalance: 46875.9,
    status: 'UNPAID',
  },
];

const transactionStatusClass = (status: TransactionStatus) =>
  status === 'PAID'
    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40'
    : 'bg-rose-500/10 text-rose-300 border border-rose-500/40';

export const TransactionsPage: React.FC = () => (
  <div className="space-y-10 animate-in fade-in duration-700">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div>
        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Audit Ledger</h2>
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
          End-to-end telemetry of all financial mutations across global nodes.
        </p>
      </div>
      <div className="w-full md:w-96">
        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 backdrop-blur-xl group focus-within:border-white/30 transition-all shadow-2xl shadow-black/40">
          <Search size={16} className="text-white/20 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="SECURE SEARCH BY TXID // PAYLOAD"
            className="w-full bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder:text-white/10 outline-none border-none"
          />
        </div>
      </div>
    </div>

    <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest border-b border-white/5">
            <th className="px-10 py-7">Mutation Origin</th>
            <th className="px-8 py-7">Methodology</th>
            <th className="px-8 py-7">Pre-Balance</th>
            <th className="px-8 py-7">Quantum</th>
            <th className="px-8 py-7">Post-Balance</th>
            <th className="px-8 py-7">Integrity</th>
            <th className="px-10 py-7 text-right">Action Hub</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {TRANSACTIONS.map((t) => (
            <tr
              key={t.id}
              className="hover:bg-white/5 transition-colors group"
            >
              <td className="px-10 py-8 text-[11px] font-black text-white/60 font-mono italic">{t.id}</td>
              <td className="px-8 py-8">
                <div className="font-black text-white text-[12px] uppercase tracking-widest italic leading-none">{t.type}</div>
                <div className="text-[9px] font-bold text-white/20 mt-2 uppercase tracking-[0.2em]">{t.method}</div>
              </td>
              <td className="px-8 py-8 font-black text-white/60 text-[11px]">₹ {t.preBalance.toFixed(2)}</td>
              <td className={`px-8 py-8 font-black text-[12px] italic ${t.amount >= 0 ? 'text-[#38B000]' : 'text-[#FF006E]'}`}>
                {t.amount >= 0 ? '+' : '-'} ₹{Math.abs(t.amount).toFixed(2)}
              </td>
              <td className="px-8 py-8 font-black text-white text-[12px]">₹ {t.afterBalance.toFixed(2)}</td>
              <td className="px-8 py-8">
                <span
                  className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border ${transactionStatusClass(
                    t.status,
                  )}`}
                >
                  {t.status === 'PAID' ? 'Verified' : 'Pending'}
                </span>
              </td>
              <td className="px-10 py-8 text-right">
                <button className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/10 text-white border border-white/10 hover:bg-white hover:text-black hover:scale-105 transition-all shadow-xl active:scale-95 italic">
                  Select
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);



export const PwaScannerPage: React.FC = () => {
  const [scanResult, setScanResult] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isValidating, setIsValidating] = React.useState(false);
  const [isScannerActive, setIsScannerActive] = React.useState(false);
  const [isManualMode, setIsManualMode] = React.useState(false);
  const [manualCode, setManualCode] = React.useState('');
  const [cameras, setCameras] = React.useState<any[]>([]);
  const [selectedCameraId, setSelectedCameraId] = React.useState<string | null>(null);
  const scannerRef = React.useRef<Html5Qrcode | null>(null);

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
    }
  };

  const startScanner = async () => {
    if (!window.isSecureContext) {
      setError("Secure Context Required: The camera only works over HTTPS or localhost.");
      return;
    }

    setIsScannerActive(true);
    setIsManualMode(false);
    setError(null);
    setScanResult(null);

    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;
        const devices = await Html5Qrcode.getCameras();
        setCameras(devices);

        let targetDevice: any = null;
        if (selectedCameraId) {
          targetDevice = selectedCameraId;
        } else if (devices.length > 0) {
          const backCamera = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear'));
          targetDevice = backCamera ? backCamera.id : devices[0].id;
        }

        await scanner.start(
          targetDevice || { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          onScanSuccess,
          onScanFailure
        );
      } catch (err: any) {
        console.error("Scanner start error:", err);
        setError(err.message || "Could not start camera. Please check permissions.");
        setIsScannerActive(false);
      }
    }, 100);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    validate(manualCode.trim());
  };

  const onScanSuccess = async (decodedText: string) => {
    await stopScanner();
    setIsScannerActive(false);
    validate(decodedText);
  };

  const onScanFailure = (error: any) => { };

  const validate = async (code: string) => {
    setIsValidating(true);
    setError(null);
    try {
      const result = await validateTicket(code);
      setScanResult(result);
    } catch (err: any) {
      setError(err.message || "Invalid Ticket Code");
    } finally {
      setIsValidating(false);
    }
  };

  const resetAll = async () => {
    await stopScanner();
    setScanResult(null);
    setError(null);
    setIsScannerActive(false);
    setIsManualMode(false);
    setManualCode('');
  };

  React.useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-4xl mx-auto pb-20">
      <div className="text-center">
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Scanner Command</h2>
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
          Real-time Attendance Validation Node
        </p>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl relative">
        {/* State: Initial Selection */}
        {!isScannerActive && !isManualMode && !scanResult && !error && !isValidating && (
          <div className="p-20 text-center">
            <div className="mb-12 relative flex justify-center">
              <div className="w-32 h-32 bg-[#FFB703]/10 rounded-[2.5rem] flex items-center justify-center text-[#FFB703] rotate-3 border border-[#FFB703]/20 shadow-2xl">
                <Camera size={56} />
              </div>
              <div className="absolute -bottom-4 right-[35%] w-14 h-14 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 -rotate-12 backdrop-blur-3xl">
                <Keyboard size={24} />
              </div>
            </div>

            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-3">Syncing Ready.</h3>
            <p className="text-[11px] font-black text-white/30 mb-12 max-w-xs mx-auto uppercase tracking-widest">
              Select validation methodology to begin node synchronization.
            </p>

            <div className="grid grid-cols-1 gap-6">
              <button
                onClick={startScanner}
                className="bg-[#38B000] hover:bg-white hover:text-[#38B000] text-white font-black rounded-3xl py-6 text-[11px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-green-500/20 flex items-center justify-center gap-4 active:scale-95 italic"
              >
                <Camera size={22} />
                INITIALIZE CAMERA SCANNER
              </button>

              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => setIsManualMode(true)}
                  className="bg-white/5 hover:bg-white/10 text-white/60 font-black rounded-3xl py-5 text-[10px] transition-all border border-white/10 flex items-center justify-center gap-3 uppercase tracking-widest italic"
                >
                  <Keyboard size={16} />
                  Manual Entry
                </button>

                <label className="bg-white/5 hover:bg-white/10 text-white/60 font-black rounded-3xl py-5 text-[10px] transition-all border border-white/10 flex items-center justify-center gap-3 uppercase tracking-widest italic cursor-pointer">
                  <ScanLine size={16} />
                  Scan Files
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsValidating(true);
                      setError(null);
                      try {
                        const scanner = new Html5Qrcode("reader");
                        const decodedText = await scanner.scanFile(file, true);
                        validate(decodedText);
                      } catch (err: any) {
                        setError("Could not find a valid QR code in this image.");
                        setIsValidating(false);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* State: Camera Active */}
        {isScannerActive && (
          <div className="p-10 bg-black/40">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic">Live Telemetry Active // Node #0x32</span>
              </div>
              <button onClick={resetAll} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <XCircle size={20} />
              </button>
            </div>
            <div id="reader" className="overflow-hidden rounded-[3rem] border border-white/10 bg-slate-900 shadow-inner min-h-[400px]"></div>
            <p className="mt-10 text-[10px] text-white/20 text-center italic font-black uppercase tracking-widest">
              Center the cryptographically signed QR within focus area.
            </p>
          </div>
        )}

        {/* State: Manual Mode */}
        {isManualMode && !isValidating && !scanResult && (
          <div className="p-20 text-center space-y-10">
            <div className="w-20 h-20 bg-[#219EBC]/10 rounded-3xl flex items-center justify-center mx-auto text-[#219EBC] mb-6 border border-[#219EBC]/20">
              <Keyboard size={36} />
            </div>
            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Manual Entry Protocol</h3>
            <form onSubmit={handleManualSubmit} className="space-y-6 max-w-sm mx-auto">
              <input
                autoFocus
                type="text"
                placeholder="INPUT TICKET_ID // STRING"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-center text-white font-black italic text-[15px] focus:border-[#219EBC] outline-none transition-all placeholder:text-white/10 uppercase tracking-widest"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-[#219EBC] text-white font-black rounded-2xl py-5 text-[10px] tracking-widest uppercase shadow-2xl shadow-blue-500/20 hover:bg-white hover:text-[#219EBC] transition-all italic active:scale-95"
              >
                Validate Identity
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="w-full text-white/20 text-[9px] uppercase font-black tracking-[0.3em] py-4 hover:text-white transition-colors"
              >
                RETURN TO GRID
              </button>
            </form>
          </div>
        )}

        {/* State: Loading */}
        {isValidating && (
          <div className="p-32 text-center space-y-8 animate-pulse">
            <div className="relative flex justify-center">
              <div className="w-20 h-20 border-4 border-white/5 border-t-[#FF006E] rounded-full animate-spin mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="text-[#FF006E] w-8 h-8 animate-bounce" />
              </div>
            </div>
            <p className="text-[#FF006E] font-black uppercase tracking-[0.4em] text-[10px] italic">Verifying Global Ledger...</p>
          </div>
        )}

        {/* State: Success */}
        {scanResult && scanResult.success && (
          <div className="p-16 text-center space-y-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-32 h-32 bg-[#38B000]/20 rounded-[3rem] flex items-center justify-center mx-auto text-[#38B000] border border-[#38B000]/30 shadow-[0_0_50px_rgba(56,176,0,0.2)]">
              <CheckCircle2 size={64} />
            </div>
            <div className="space-y-3">
              <h3 className="text-4xl font-black text-[#38B000] italic tracking-tighter uppercase leading-none">Access Granted</h3>
              <p className="text-white/40 font-black uppercase tracking-widest text-[11px]">{scanResult.eventName}</p>
            </div>

            <div className="bg-white/5 rounded-[2.5rem] p-10 border border-white/10 text-left space-y-6 shadow-2xl backdrop-blur-3xl">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em]">Identity</span>
                <span className="text-xl font-black text-white italic">{scanResult.attendee}</span>
              </div>
              <div className="flex justify-between items-end border-t border-white/5 pt-6">
                <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em]">Protocol</span>
                <span className="text-[10px] font-black text-[#FFB703] uppercase italic bg-[#FFB703]/10 px-4 py-2 rounded-xl border border-[#FFB703]/20">{scanResult.ticketType}</span>
              </div>
              <div className="flex justify-between items-end border-t border-white/5 pt-6">
                <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em]">Timestamp</span>
                <span className="text-lg font-black text-white/60 font-mono italic">{new Date(scanResult.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <button
              onClick={resetAll}
              className="w-full bg-white text-black font-black rounded-3xl py-6 text-[11px] uppercase tracking-[0.2em] transition-all shadow-2xl hover:scale-105 active:scale-95 italic"
            >
              SYNC NEXT SEQUENCE
            </button>
          </div>
        )}

        {/* State: Double Check-in */}
        {scanResult && scanResult.alreadyUsed && (
          <div className="p-16 text-center space-y-10">
            <div className="w-32 h-32 bg-[#FF006E]/10 rounded-[3rem] flex items-center justify-center mx-auto text-[#FF006E] border border-[#FF006E]/20 animate-pulse shadow-[0_0_50px_rgba(255,0,110,0.1)]">
              <AlertCircle size={64} />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-[#FF006E] uppercase italic tracking-tighter">Collision Detected</h3>
              <p className="text-white/30 font-black uppercase tracking-widest text-[10px]">Security Alert: Identity already synchronized.</p>
            </div>

            <div className="bg-[#FF006E]/5 rounded-[2.5rem] p-10 border border-[#FF006E]/10 text-left space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-[#FF006E]/40 uppercase tracking-[0.3em]">Mutation Peak</span>
                <span className="text-lg font-black text-[#FF006E]/60 italic">{new Date(scanResult.checkInTime).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={resetAll}
              className="w-full bg-[#FF006E] hover:bg-white hover:text-[#FF006E] text-white font-black rounded-3xl py-6 text-[11px] uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 italic"
            >
              REBOOT SCANNER
            </button>
          </div>
        )}

        {/* State: Error */}
        {error && (
          <div className="p-20 text-center space-y-10 animate-in slide-in-from-top-4 duration-500">
            <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto text-[#FF006E] border border-white/10 shadow-2xl">
              <XCircle size={48} />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Protocol Failure</h3>
              <p className="text-[#FF006E] text-[10px] font-black uppercase tracking-widest px-6 italic">{error}</p>
            </div>
            <button
              onClick={resetAll}
              className="w-full bg-white/10 hover:bg-white hover:text-black text-white font-black rounded-3xl py-6 text-[11px] uppercase tracking-[0.2em] transition-all italic border border-white/10"
            >
              INITIALIZE RETRY
            </button>
          </div>
        )}
      </div>

      {/* Helper Bar */}
      <div className="p-10 bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] flex items-start gap-8 shadow-2xl">
        <div className="w-14 h-14 bg-[#FFB703]/10 rounded-2xl flex items-center justify-center text-[#FFB703] shrink-0 border border-[#FFB703]/20 shadow-xl">
          <AlertCircle size={24} />
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-black text-white italic uppercase tracking-[0.4em]">Sector Guidelines</p>
          <p className="text-xs text-white/30 leading-relaxed font-bold uppercase tracking-widest">
            Ensure photon intensity for optimal camera data extraction. If QR node integrity is compromised, utilize the <span className="text-[#FFB703]">Manual Entry Pulse</span> to input the cryptographic attendee hash directly.
          </p>
        </div>
      </div>
    </div>
  );
};

const TICKET_STATUS_CLASSES: Record<string, string> = {
  Open: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40',
  Pending: 'bg-sky-500/10 text-sky-300 border border-sky-500/40',
  Closed: 'bg-rose-500/10 text-rose-300 border border-rose-500/40',
};

interface SupportTicketRow {
  id: number;
  email: string;
  subject: string;
  status: keyof typeof TICKET_STATUS_CLASSES;
}

const SUPPORT_TICKETS: SupportTicketRow[] = [
  {
    id: 16,
    email: 'organizer@gmail.com',
    subject: 'Why my event has no ticket?',
    status: 'Open',
  },
  {
    id: 15,
    email: 'organizer@gmail.com',
    subject: 'Feature a Event',
    status: 'Pending',
  },
  {
    id: 12,
    email: 'organizer@gmail.com',
    subject: 'Withdraw Rejected',
    status: 'Closed',
  },
];

export const SupportTicketsListPage: React.FC = () => (
  <div className="space-y-10 animate-in fade-in duration-700">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div>
        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Support Hub</h2>
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
          Monitoring real-time ticket mutations and resolution protocols.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 flex items-center gap-4 backdrop-blur-xl">
          <Search size={16} className="text-white/20" />
          <input
            type="text"
            placeholder="FILTER BY TICKET_ID"
            className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder:text-white/10 outline-none border-none w-48"
          />
        </div>
        <button className="px-8 py-3.5 bg-[#FF006E] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#FF006E] transition-all shadow-2xl shadow-[#FF006E]/20 active:scale-95 italic flex items-center gap-3">
          <PlusCircle size={16} /> New Ticket
        </button>
      </div>
    </div>

    <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest border-b border-white/5">
            <th className="px-10 py-7">Ticket Identity</th>
            <th className="px-8 py-7">Origin Email</th>
            <th className="px-8 py-7">Subject Vector</th>
            <th className="px-8 py-7">Resolution Status</th>
            <th className="px-10 py-7 text-right">Action Hub</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {SUPPORT_TICKETS.map((t) => (
            <tr
              key={t.id}
              className="hover:bg-white/5 transition-colors group"
            >
              <td className="px-10 py-8 text-[11px] font-black text-white/60 font-mono italic">#{t.id}</td>
              <td className="px-8 py-8 text-[11px] font-black text-white uppercase tracking-widest italic">{t.email}</td>
              <td className="px-8 py-8">
                <div className="font-black text-white text-[13px] italic leading-tight">{t.subject}</div>
              </td>
              <td className="px-8 py-8">
                <span
                  className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border ${TICKET_STATUS_CLASSES[t.status]
                    }`}
                >
                  {t.status}
                </span>
              </td>
              <td className="px-10 py-8 text-right">
                <button className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 text-white/40 border border-white/10 hover:bg-white hover:text-black hover:scale-105 transition-all shadow-xl active:scale-95 italic">
                  Inspect Node
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const SupportTicketsAddPage: React.FC = () => (
  <div className="space-y-10 animate-in fade-in duration-700 max-w-4xl">
    <div>
      <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">New Support Request</h2>
      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
        Initiate a Resolution Sequence for technical or financial anomalies.
      </p>
    </div>
    <form className="bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 p-12 space-y-8 shadow-2xl relative overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">
            Identity Email
          </label>
          <input
            type="email"
            className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl px-6 py-4 outline-none focus:border-[#FF006E] transition-all text-[13px] tracking-widest"
            defaultValue="organizer@gmail.com"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">
            Subject Vector
          </label>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl px-6 py-4 outline-none focus:border-[#FF006E] transition-all text-[13px] tracking-widest"
            placeholder="Critical Issue // Mutation Error"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">
          Problem Payload
        </label>
        <textarea
          className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-[2rem] px-6 py-6 min-h-[180px] outline-none focus:border-[#FF006E] transition-all text-[13px] tracking-widest no-scrollbar"
          placeholder="Detailed anomaly report and sequence of occurrences..."
        />
      </div>
      <div className="space-y-4">
        <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">
          Evidence Attachment
        </label>
        <div className="relative group">
          <input
            type="file"
            className="block w-full text-[11px] font-black text-white/40 uppercase tracking-[0.2em] file:mr-6 file:px-8 file:py-4 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:bg-white/10 file:text-white file:cursor-pointer hover:file:bg-white hover:file:text-black transition-all"
          />
        </div>
        <p className="text-[9px] text-white/10 font-black uppercase tracking-[0.3em] px-4">
          Allowed: .ZIP .LOG .IMG | Max Size: 20 MB
        </p>
      </div>
      <div className="pt-6">
        <button className="w-full py-5 bg-[#FF006E] text-white font-black rounded-3xl text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-pink-500/20 hover:bg-white hover:text-[#FF006E] transition-all italic active:scale-95">
          Submit Resolution Protocol
        </button>
      </div>
    </form>
  </div>
);

// Backwards compatible default export used earlier for /organiser/support
export const SupportTicketsPage = SupportTicketsListPage;

export const OrganiserProfilePage: React.FC = () => (
  <div className="space-y-10 animate-in fade-in duration-700 max-w-5xl">
    <div>
      <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Global Profile Registry</h2>
      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
        Encryption of your public identity across the coordinate system.
      </p>
    </div>
    <form className="bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 p-12 space-y-10 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="flex flex-col items-center gap-6 group">
          <div className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/10 text-[10px] font-black uppercase tracking-widest relative overflow-hidden shadow-2xl transition-all group-hover:border-white/30">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            300 x 300
          </div>
          <button
            type="button"
            className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all border border-white/10 italic"
          >
            Upload Photo
          </button>
          <p className="text-[9px] text-white/10 font-black uppercase tracking-[0.3em] text-center max-w-[120px]">
            Node Identity Capture
          </p>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">
              Communication Relay (Email)
            </label>
            <input
              type="email"
              className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl px-6 py-4 outline-none focus:border-[#7209B7] transition-all text-[13px] tracking-widest"
              defaultValue="organizer@gmail.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">
              Voice Frequency (Phone)
            </label>
            <input
              type="tel"
              className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl px-6 py-4 outline-none focus:border-[#7209B7] transition-all text-[13px] tracking-widest"
              defaultValue="456 372989"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">
              Social Vector (Facebook)
            </label>
            <input
              type="url"
              className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl px-6 py-4 outline-none focus:border-[#7209B7] transition-all text-[13px] tracking-widest"
              defaultValue="https://www.facebook.com/"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">
              Social Vector (LinkedIn)
            </label>
            <input
              type="url"
              className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl px-6 py-4 outline-none focus:border-[#7209B7] transition-all text-[13px] tracking-widest"
              defaultValue="https://www.linkedin.com/"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">
              Global Hash (Username)
            </label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl px-6 py-4 outline-none focus:border-[#7209B7] transition-all text-[13px] tracking-widest"
              defaultValue="organizer"
            />
          </div>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-white/5 bg-white/5 overflow-hidden">
        <div className="px-8 py-5 bg-white/5 text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic border-b border-white/5">
          Localization Protocol: English (Primary)
        </div>
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 font-black flex-wrap">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Legal Alias*</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl px-6 py-4 outline-none focus:border-[#7209B7] transition-all text-[13px] tracking-widest"
              defaultValue="Robert L. Murray"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Corporate Role</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl px-6 py-4 outline-none focus:border-[#7209B7] transition-all text-[13px] tracking-widest"
              defaultValue="Chief Executive Officer"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Territory (Country)</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl px-6 py-4 outline-none focus:border-[#7209B7] transition-all text-[13px] tracking-widest"
              defaultValue="United States"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Coordinate City</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl px-6 py-4 outline-none focus:border-[#7209B7] transition-all text-[13px] tracking-widest"
              defaultValue="Rocksburo"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Full Address Mapping</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl px-6 py-4 outline-none focus:border-[#7209B7] transition-all text-[13px] tracking-widest"
              defaultValue="Rocksboro, North Carolina, United States"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Operational Summary</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-[2rem] px-8 py-6 min-h-[140px] outline-none focus:border-[#7209B7] transition-all text-[13px] tracking-widest no-scrollbar"
              defaultValue="Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-6 pt-6">
        <button
          type="button"
          className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all italic underline decoration-white/10 underline-offset-8"
        >
          Cancel Mutation
        </button>
        <button
          type="submit"
          className="px-10 py-4 bg-[#7209B7] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#7209B7] transition-all shadow-2xl shadow-purple-500/20 italic active:scale-95"
        >
          Synchronize Changes
        </button>
      </div>
    </form>
  </div>
);

export const ChangePasswordPage: React.FC = () => (
  <div className="space-y-10 animate-in fade-in duration-700 max-w-2xl">
    <div>
      <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Access Protocol Update</h2>
      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
        Refreshing cryptographic node keys for maximum security persistence.
      </p>
    </div>
    <form className="bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 p-12 space-y-8 shadow-2xl relative overflow-hidden">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Current Cryptokey</label>
          <div className="relative">
            <KeyRound size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" />
            <input
              type="password"
              className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl pl-16 pr-6 py-4 outline-none focus:border-[#FFB703] transition-all text-[13px] tracking-widest"
              placeholder="••••••••••••"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">New Secret Sequence</label>
          <div className="relative">
            <Zap size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" />
            <input
              type="password"
              className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl pl-16 pr-6 py-4 outline-none focus:border-[#FFB703] transition-all text-[13px] tracking-widest"
              placeholder="••••••••••••"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Confirm Mutation Sequence</label>
          <div className="relative">
            <CheckCircle2 size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" />
            <input
              type="password"
              className="w-full bg-white/5 border border-white/10 text-white font-black italic rounded-2xl pl-16 pr-6 py-4 outline-none focus:border-[#FFB703] transition-all text-[13px] tracking-widest"
              placeholder="••••••••••••"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-6 pt-4">
        <button
          type="button"
          className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all italic underline decoration-white/10 underline-offset-8"
        >
          Abort Protocol
        </button>
        <button
          type="submit"
          className="px-10 py-4 bg-[#FFB703] text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#FFB703] transition-all shadow-2xl shadow-yellow-500/20 italic active:scale-95"
        >
          Finalize Re-Encryption
        </button>
      </div>
    </form>
  </div>
);

