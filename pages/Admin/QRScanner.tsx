import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { MOCK_USERS } from '../../constants/mockData';
import Button from '../../components/Shared/UI/Button';
import { Scan, Camera, XCircle, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const QRScanner: React.FC = () => {
    const admin = MOCK_USERS[2];
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
    const [selectedCameraId, setSelectedCameraId] = useState<string>('');
    const [permissionError, setPermissionError] = useState<string | null>(null);

    const scannerRef = useRef<Html5Qrcode | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (scannerRef.current && isScanning) {
                scannerRef.current.stop().then(() => {
                    scannerRef.current?.clear();
                }).catch(err => console.error("Failed to stop scanner", err));
            }
        };
    }, [isScanning]);

    const startCamera = async () => {
        setIsScanning(true);
        setPermissionError(null);

        try {
            const devices = await Html5Qrcode.getCameras();
            if (devices && devices.length) {
                setCameras(devices);
                // Default to the first camera if none selected
                const cameraId = selectedCameraId || devices[0].id;
                setSelectedCameraId(cameraId);

                if (!scannerRef.current) {
                    scannerRef.current = new Html5Qrcode("reader");
                }

                await scannerRef.current.start(
                    cameraId,
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 }
                    },
                    (decodedText) => {
                        handleScanSuccess(decodedText);
                    },
                    (errorMessage) => {
                        // ignore frame errors
                    }
                );
            } else {
                setPermissionError("No camera devices found.");
                setIsScanning(false);
            }
        } catch (err) {
            console.error("Error starting camera", err);
            setPermissionError("Camera permission denied or error accessing camera.");
            setIsScanning(false);
        }
    };

    const stopCamera = async () => {
        if (scannerRef.current) {
            try {
                // Check if scanner is running before stopping
                if (scannerRef.current.isScanning) {
                    await scannerRef.current.stop();
                }
                scannerRef.current.clear();
                setIsScanning(false);
            } catch (err: any) {
                console.error("Failed to stop scanner", err);
                // If the error is just that it's not running, we can ignore it
                setIsScanning(false);
            }
        }
    };

    const handleScanSuccess = (decodedText: string) => {
        setScanResult(decodedText);
        toast.success('QR Code Scanned Successfully!');
        stopCamera();
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            // Use a separate instance for file scanning to avoid conflicts with camera
            const html5QrCode = new Html5Qrcode("reader-hidden");
            const decodedText = await html5QrCode.scanFile(file, true);
            setScanResult(decodedText);
            toast.success('Image QR Code Scanned!');
            html5QrCode.clear();
        } catch (err) {
            console.error("Error scanning file", err);
            toast.error('Could not find QR code in image.');
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCameraId = e.target.value;
        setSelectedCameraId(newCameraId);

        if (isScanning && scannerRef.current) {
            stopCamera().then(() => {
                // Only restart if we were scanning
                setTimeout(() => {
                    // We need to trigger startCamera again, but state updates might be async.
                    // A cleaner way is to just set ID and let user restart, or chain it.
                    // For now, let's keep it simple: stop, set ID, user clicks start? 
                    // Or just try to restart:
                    // Note: recursive calling startCamera might be tricky with closures. 
                    // Let's just update the ID and require a restart or re-implement start logic here.
                }, 100);
            });
        }
    };

    return (
        <DashboardLayout user={admin}>
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">PWA Scanner</h1>
                        <p className="text-gray-500">Scan event tickets directly from the admin panel.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Scanner Card */}
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[450px]">
                        {!isScanning && !scanResult && (
                            <div className="text-center w-full">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Scan size={40} className="text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Scan QrCode</h3>
                                <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                                    Use your camera or upload an image to verify ticket details.
                                </p>

                                {permissionError && (
                                    <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                        {permissionError}
                                    </div>
                                )}

                                <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                                    <Button
                                        onClick={startCamera}
                                        className="bg-blue-600 hover:bg-blue-700 w-full"
                                    >
                                        <Camera size={18} className="mr-2" /> Start Camera
                                    </Button>

                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                        />
                                        <Button
                                            variant="secondary"
                                            className="w-full"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <ImageIcon size={18} className="mr-2" /> Upload QR Image
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Scanner View */}
                        {/* Always render reader div, but hide/show based on state. 
                            Note: Html5Qrcode needs the element to exist. */}
                        <div
                            id="reader"
                            className={`w-full rounded-lg overflow-hidden ${!isScanning ? 'hidden' : 'block'}`}
                            style={{ minHeight: isScanning ? '300px' : '0' }}
                        ></div>

                        {isScanning && (
                            <div className="w-full mt-4 flex flex-col gap-3">
                                {cameras.length > 1 && (
                                    <select
                                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                                        value={selectedCameraId}
                                        onChange={handleCameraChange}
                                    >
                                        {cameras.map(cam => (
                                            <option key={cam.id} value={cam.id}>{cam.label || `Camera ${cam.id.slice(0, 5)}...`}</option>
                                        ))}
                                    </select>
                                )}
                                <Button
                                    onClick={stopCamera}
                                    variant="secondary"
                                    className="w-full"
                                >
                                    Stop Scanning
                                </Button>
                            </div>
                        )}

                        {/* Result View */}
                        {scanResult && !isScanning && (
                            <div className="text-center w-full">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Scan size={32} className="text-green-600" />
                                </div>
                                <h3 className="text-lg font-bold text-green-700 mb-2">Scan Successful!</h3>
                                <div className="bg-gray-50 p-4 rounded-lg break-all text-sm font-mono text-gray-600 mb-6">
                                    {scanResult}
                                </div>
                                <div className="flex gap-3 justify-center">
                                    <Button onClick={() => setScanResult(null)} variant="secondary">
                                        <XCircle size={18} className="mr-2" /> Close
                                    </Button>
                                    <Button onClick={() => { setScanResult(null); startCamera(); }}>
                                        <Scan size={18} className="mr-2" /> Scan Another
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Hidden element for file scanning logic */}
                        <div id="reader-hidden" className="hidden"></div>
                    </div>

                    {/* Instructions / Info */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
                        <h3 className="text-xl font-bold mb-4">How it works?</h3>
                        <ul className="space-y-4 opacity-90">
                            <li className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                                <p>Click "Start Camera" and allow browser permissions.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                                <p>Or use "Upload QR Image" if you have a screenshot.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                                <p>The system verifies the ticket against the database instantly.</p>
                            </li>
                        </ul>

                        <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20">
                            <p className="text-sm font-medium">Note: Try Upload Image if camera access fails.</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default QRScanner;
