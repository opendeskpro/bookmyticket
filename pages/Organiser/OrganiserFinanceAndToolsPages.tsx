import React from 'react';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Withdraw</h2>
          <p className="text-xs text-slate-400">
            View your withdraw requests and current wallet balance.
          </p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-lg px-6 py-2 text-xs">
          + Withdraw Now
        </button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#050716] p-6 text-xs space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-slate-300">
            <span className="text-slate-400 mr-1">My Balance:</span>
            <span className="font-semibold text-emerald-300">₹ 48,373.10</span>
          </p>
          <div className="flex items-center gap-3">
            <label className="text-slate-400">Show</label>
            <select className="bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-2 py-1 text-[11px]">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span className="text-slate-400">entries</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#050716] overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-[#080c1f] text-slate-400">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Withdraw ID</th>
                <th className="text-left px-4 py-3 font-medium">Method Name</th>
                <th className="text-left px-4 py-3 font-medium">Total Amount</th>
                <th className="text-left px-4 py-3 font-medium">Total Charge</th>
                <th className="text-left px-4 py-3 font-medium">
                  Total Receivable Amount
                </th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-slate-800/70 hover:bg-[#080c1f]/60 transition-colors"
                >
                  <td className="px-6 py-3 text-slate-200">{r.id}</td>
                  <td className="px-4 py-3 text-slate-200">{r.method}</td>
                  <td className="px-4 py-3 text-slate-200">₹ {r.totalAmount}</td>
                  <td className="px-4 py-3 text-slate-200">₹ {r.totalCharge}</td>
                  <td className="px-4 py-3 text-slate-200">₹ {r.receivable}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold ${statusClass(
                        r.status,
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[#101632] text-slate-200 hover:bg-[#161d3c] border border-slate-700/60">
                      View
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
  <div className="space-y-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Transactions</h2>
        <p className="text-xs text-slate-400">
          Transactions generated from event bookings and withdrawals.
        </p>
      </div>
      <div className="w-full md:w-80">
        <input
          type="text"
          placeholder="Enter Transaction Id"
          className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs placeholder:text-slate-500"
        />
      </div>
    </div>

    <div className="rounded-xl border border-slate-800 bg-[#050716] overflow-hidden text-xs">
      <table className="w-full">
        <thead className="bg-[#080c1f] text-slate-400">
          <tr>
            <th className="text-left px-6 py-3 font-medium">Transaction Id</th>
            <th className="text-left px-4 py-3 font-medium">Transaction Type</th>
            <th className="text-left px-4 py-3 font-medium">Payment Method</th>
            <th className="text-left px-4 py-3 font-medium">Pre Balance</th>
            <th className="text-left px-4 py-3 font-medium">Amount</th>
            <th className="text-left px-4 py-3 font-medium">After Balance</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="text-right px-6 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {TRANSACTIONS.map((t) => (
            <tr
              key={t.id}
              className="border-t border-slate-800/70 hover:bg-[#080c1f]/60 transition-colors"
            >
              <td className="px-6 py-3 text-slate-200">{t.id}</td>
              <td className="px-4 py-3 text-slate-200">{t.type}</td>
              <td className="px-4 py-3 text-slate-200">{t.method}</td>
              <td className="px-4 py-3 text-slate-200">₹ {t.preBalance.toFixed(2)}</td>
              <td className="px-4 py-3 text-slate-200">
                {t.amount >= 0 ? '(+) ' : '(-) '}₹
                {Math.abs(t.amount).toFixed(2)}
              </td>
              <td className="px-4 py-3 text-slate-200">
                ₹ {t.afterBalance.toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold ${transactionStatusClass(
                    t.status,
                  )}`}
                >
                  {t.status === 'PAID' ? 'Paid' : 'Unpaid'}
                </span>
              </td>
              <td className="px-6 py-3 text-right">
                <button className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[#4f46e5] text-white hover:bg-[#6366f1]">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

import { Html5Qrcode } from 'html5-qrcode';
import { validateTicket } from '../../lib/supabase';
import { Camera, CheckCircle2, XCircle, AlertCircle, Loader2, Keyboard } from 'lucide-react';

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
    // SECURITY CHECK: Browsers block camera access on non-secure origins (HTTP)
    // unless it is localhost. IP addresses like 192.168.x.x require HTTPS.
    if (!window.isSecureContext) {
      setError("Secure Context Required: The camera only works over HTTPS or localhost. If you are testing on a different device, please use an HTTPS tunnel (like ngrok) or access via localhost.");
      return;
    }

    setIsScannerActive(true);
    setIsManualMode(false);
    setError(null);
    setScanResult(null);

    // Give React a moment to render the #reader div
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;

        // Try to get cameras if we haven't yet
        const devices = await Html5Qrcode.getCameras();
        setCameras(devices);

        let config = { facingMode: "environment" };

        // If we have a specific camera selected, use it
        // Or if we only have one camera, use its ID directly to be more specific
        let targetDevice: any = null;
        if (selectedCameraId) {
          targetDevice = selectedCameraId;
        } else if (devices.length > 0) {
          // If multiple cameras, prioritize back camera
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

  const onScanFailure = (error: any) => {
    // Silent fail for scanning frames
  };

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
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2 italic tracking-tight">Scanner Command Center</h2>
        <p className="text-xs text-slate-500 uppercase tracking-[0.2em]">
          Real-time Attendance Validation
        </p>
      </div>

      <div className="bg-[#050716] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* State: Initial Selection */}
        {!isScannerActive && !isManualMode && !scanResult && !error && !isValidating && (
          <div className="p-12 text-center">
            <div className="mb-10 relative">
              <div className="w-24 h-24 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto text-amber-500 rotate-3 border border-amber-500/20">
                <Camera size={48} />
              </div>
              <div className="absolute -bottom-2 -right-4 w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 rotate-12">
                <Keyboard size={20} />
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-200 mb-2">Ready to scan tickets?</h3>
            <p className="text-xs text-slate-500 mb-10 max-w-xs mx-auto">
              Select your preferred method to validate attendee QR codes or manual IDs.
            </p>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={startScanner}
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-2xl py-5 text-sm transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
              >
                <Camera size={20} />
                LAUNCH CAMERA SCANNER
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsManualMode(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-2xl py-4 text-[10px] transition-all border border-slate-800 flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Keyboard size={14} />
                  Manual Code
                </button>

                <label className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-2xl py-4 text-[10px] transition-all border border-slate-800 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer">
                  <Camera size={14} />
                  Scan Image
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
          <div className="p-6 bg-slate-950">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Scanner Active</span>
              </div>
              <button onClick={resetAll} className="text-[10px] font-bold text-rose-400 uppercase hover:underline">Exit</button>
            </div>
            <div id="reader" className="overflow-hidden rounded-2xl border-2 border-slate-800 bg-black min-h-[300px]"></div>
            <p className="mt-6 text-[11px] text-slate-500 text-center italic">
              Position the QR code within the focus area to scan automatically.
            </p>
          </div>
        )}

        {/* State: Manual Mode */}
        {isManualMode && !isValidating && !scanResult && (
          <div className="p-12 text-center space-y-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto text-blue-400 mb-4">
              <Keyboard size={32} />
            </div>
            <h3 className="text-lg font-bold text-white">Manual Entry</h3>
            <form onSubmit={handleManualSubmit} className="space-y-4 max-w-sm mx-auto">
              <input
                autoFocus
                type="text"
                placeholder="Enter Ticket ID or QR String"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-4 text-center text-white font-mono focus:border-amber-500 outline-none transition-all"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-amber-500 text-slate-900 font-black rounded-xl py-4 text-xs tracking-widest uppercase shadow-lg shadow-amber-500/10"
              >
                Validate Ticket
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="w-full text-slate-500 text-[10px] uppercase font-bold tracking-widest py-2"
              >
                Back to Options
              </button>
            </form>
          </div>
        )}

        {/* State: Loading */}
        {isValidating && (
          <div className="p-24 text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-800 border-t-amber-500 rounded-full animate-spin mx-auto" />
              <Loader2 className="absolute inset-0 m-auto text-amber-500 w-6 h-6 animate-pulse" />
            </div>
            <p className="text-amber-500 font-black uppercase tracking-widest text-[11px] animate-pulse">Verifying Database Records...</p>
          </div>
        )}

        {/* State: Success */}
        {scanResult && scanResult.success && (
          <div className="p-10 text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 size={56} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-emerald-400 lowercase italic tracking-tighter">access granted.</h3>
              <p className="text-slate-400 font-medium">{scanResult.eventName}</p>
            </div>

            <div className="bg-slate-900/60 rounded-3xl p-8 border border-slate-800/50 text-left space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Attendee</span>
                <span className="text-lg font-bold text-slate-100">{scanResult.attendee}</span>
              </div>
              <div className="flex justify-between items-end border-t border-slate-800/50 pt-4">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Type</span>
                <span className="text-sm font-black text-amber-500 uppercase italic bg-amber-500/5 px-3 py-1 rounded-lg border border-amber-500/20">{scanResult.ticketType}</span>
              </div>
              <div className="flex justify-between items-end border-t border-slate-800/50 pt-4">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Time</span>
                <span className="text-sm font-bold text-slate-300">{new Date(scanResult.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <button
              onClick={resetAll}
              className="w-full bg-slate-100 hover:bg-white text-slate-900 font-black rounded-2xl py-5 text-sm transition-all shadow-xl active:scale-95"
            >
              SCAN NEXT TICKET
            </button>
          </div>
        )}

        {/* State: Double Check-in */}
        {scanResult && scanResult.alreadyUsed && (
          <div className="p-10 text-center space-y-8">
            <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-500 border border-rose-500/20 animate-pulse">
              <AlertCircle size={56} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-rose-500 uppercase italic">Duplicate Ticket</h3>
              <p className="text-slate-400 text-xs">Security Alert: This ticket was already validated.</p>
            </div>

            <div className="bg-rose-500/5 rounded-3xl p-8 border border-rose-500/10 text-left space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-rose-500/50 uppercase tracking-widest">Original Check-in</span>
                <span className="text-sm font-bold text-rose-400">{new Date(scanResult.checkInTime).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={resetAll}
              className="w-full bg-rose-500 hover:bg-rose-400 text-white font-black rounded-2xl py-5 text-sm transition-all shadow-xl active:scale-95"
            >
              TRY ANOTHER
            </button>
          </div>
        )}

        {/* State: Error */}
        {error && (
          <div className="p-12 text-center space-y-8 animate-in slide-in-from-top-4 duration-300">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto text-rose-400 border border-slate-800">
              <XCircle size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white uppercase italic">Validation Error</h3>
              <p className="text-rose-400 text-sm font-medium px-4">{error}</p>
            </div>
            <button
              onClick={resetAll}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl py-5 text-sm transition-all"
            >
              RESTART SCANNER
            </button>
          </div>
        )}
      </div>

      {/* Helper Bar */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex items-start gap-4">
        <div className="w-10 h-10 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
          <AlertCircle size={20} />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-white uppercase tracking-widest">Validation Tips</p>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Ensure adequate lighting for camera scans. If a QR code is too damaged to read, use the <span className="text-amber-500">Manual Entry</span> mode to input the ticket identifier directly.
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
  <div className="space-y-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold text-white">All Tickets</h2>
        <p className="text-xs text-slate-400">
          All support tickets raised for your organiser account.
        </p>
      </div>
      <div className="w-full md:w-64">
        <input
          type="text"
          placeholder="Search by Ticket ID"
          className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs placeholder:text-slate-500"
        />
      </div>
    </div>
    <div className="rounded-xl border border-slate-800 bg-[#050716] overflow-hidden text-xs">
      <table className="w-full">
        <thead className="bg-[#080c1f] text-slate-400">
          <tr>
            <th className="text-left px-6 py-3 font-medium">Ticket ID</th>
            <th className="text-left px-4 py-3 font-medium">Email</th>
            <th className="text-left px-4 py-3 font-medium">Subject</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="text-right px-6 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {SUPPORT_TICKETS.map((t) => (
            <tr
              key={t.id}
              className="border-t border-slate-800/70 hover:bg-[#080c1f]/60 transition-colors"
            >
              <td className="px-6 py-3 text-slate-200">{t.id}</td>
              <td className="px-4 py-3 text-slate-200">{t.email}</td>
              <td className="px-4 py-3 text-slate-200">{t.subject}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold ${TICKET_STATUS_CLASSES[t.status]
                    }`}
                >
                  {t.status}
                </span>
              </td>
              <td className="px-6 py-3 text-right">
                <button className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[#4f46e5] text-white hover:bg-[#6366f1]">
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

export const SupportTicketsAddPage: React.FC = () => (
  <div className="space-y-6 max-w-3xl">
    <div>
      <h2 className="text-lg font-semibold text-white">Add Ticket</h2>
      <p className="text-xs text-slate-400">
        Create a new support ticket for issues related to bookings or payouts.
      </p>
    </div>
    <form className="rounded-xl border border-slate-800 bg-[#050716] p-6 space-y-4 text-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">
            Email*
          </label>
          <input
            type="email"
            className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
            defaultValue="organizer@gmail.com"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">
            Subject*
          </label>
          <input
            type="text"
            className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
            placeholder="Enter subject"
          />
        </div>
      </div>
      <div>
        <label className="block text-[11px] text-slate-400 mb-1">
          Description
        </label>
        <textarea
          className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2 min-h-[120px]"
          placeholder="Describe the issue in detail..."
        />
      </div>
      <div className="space-y-2">
        <label className="block text-[11px] text-slate-400 mb-1">
          Attachment
        </label>
        <input
          type="file"
          className="block w-full text-xs text-slate-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#1e293b] file:text-slate-100"
        />
        <p className="text-[11px] text-slate-500">
          Upload only ZIP files, Max file size is 20 MB.
        </p>
      </div>
      <div className="pt-4">
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-lg px-8 py-2 text-xs"
        >
          Save
        </button>
      </div>
    </form>
  </div>
);

// Backwards compatible default export used earlier for /organiser/support
export const SupportTicketsPage = SupportTicketsListPage;

export const OrganiserProfilePage: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-lg font-semibold text-white">Edit Profile</h2>
      <p className="text-xs text-slate-400">
        Manage your public organiser profile information and contact details.
      </p>
    </div>
    <form className="rounded-xl border border-slate-800 bg-[#050716] p-6 space-y-6 text-xs">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex flex-col items-center gap-3">
          <div className="w-28 h-28 rounded-full bg-slate-700/40 flex items-center justify-center text-slate-300 text-xs">
            300 x 300
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-[#1e293b] text-slate-100 font-semibold text-[11px]"
          >
            Choose Photo
          </button>
          <p className="text-[10px] text-slate-500 max-w-[140px] text-center">
            Image size 300x300
          </p>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Email*
            </label>
            <input
              type="email"
              className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
              defaultValue="organizer@gmail.com"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Phone
            </label>
            <input
              type="tel"
              className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
              defaultValue="456 372989"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Facebook
            </label>
            <input
              type="url"
              className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
              defaultValue="https://www.facebook.com/"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Twitter
            </label>
            <input
              type="url"
              className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
              defaultValue="https://www.twitter.com/"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
              defaultValue="https://www.linkedin.com/"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Username*
            </label>
            <input
              type="text"
              className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
              defaultValue="organizer"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-[#020617]/40">
        <div className="px-4 py-2 bg-[#1d2144] text-[11px] font-semibold text-slate-100">
          English Language (Default)
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Name*
            </label>
            <input
              type="text"
              className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
              defaultValue="Robert L. Murray"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Designation
            </label>
            <input
              type="text"
              className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
              defaultValue="Chief Executive Officer"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Country
            </label>
            <input
              type="text"
              className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
              defaultValue="United States"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              City
            </label>
            <input
              type="text"
              className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
              defaultValue="Rocksburo"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              State
            </label>
            <input
              type="text"
              className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
              defaultValue="North Carolina"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Zip Code
            </label>
            <input
              type="text"
              className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
              defaultValue="02580"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] text-slate-400 mb-1">
              Address
            </label>
            <input
              type="text"
              className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
              defaultValue="Rocksboro, North Carolina, United States"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] text-slate-400 mb-1">
              Details
            </label>
            <textarea
              className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2 min-h-[120px]"
              defaultValue="Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          className="border border-slate-700 text-slate-300 hover:bg-[#0a0f24] rounded-lg px-4 py-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-lg px-6 py-2"
        >
          Update
        </button>
      </div>
    </form>
  </div>
);

export const ChangePasswordPage: React.FC = () => (
  <div className="space-y-6 max-w-md">
    <div>
      <h2 className="text-lg font-semibold text-white">Change Password</h2>
      <p className="text-xs text-slate-400">
        Secure your organiser account by updating your password regularly.
      </p>
    </div>
    <form className="rounded-xl border border-slate-800 bg-[#050716] p-6 space-y-4 text-xs">
      <div>
        <label className="block text-[11px] text-slate-400 mb-1">
          Current Password
        </label>
        <input
          type="password"
          className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-[11px] text-slate-400 mb-1">
          New Password
        </label>
        <input
          type="password"
          className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-[11px] text-slate-400 mb-1">
          Confirm New Password
        </label>
        <input
          type="password"
          className="w-full bg-[#050716] border border-slate-700 text-slate-200 rounded-lg px-3 py-2"
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          className="border border-slate-700 text-slate-300 hover:bg-[#0a0f24] rounded-lg px-4 py-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg px-6 py-2"
        >
          Update Password
        </button>
      </div>
    </form>
  </div>
);

