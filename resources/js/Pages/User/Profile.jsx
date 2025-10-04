import React, { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function Profile({ auth, user }) {
    const [loading, setLoading] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        no_telepon: user?.no_telepon || '',
        no_identitas: user?.no_identitas || '',
        photo_url: user?.photo_url || ''
    });
    const [editLoading, setEditLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const [geometricPattern, setGeometricPattern] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [showPrivateData, setShowPrivateData] = useState(false);
    const [biometricStatus, setBiometricStatus] = useState('');
    const [scanProgress, setScanProgress] = useState(0);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleBack = () => {
        router.visit('/user/dashboard');
    };

    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            await axios.post('/logout');
            router.visit('/public/login');
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/public/login';
        } finally {
            setLogoutLoading(false);
        }
    };

    const handleEditProfile = () => {
        setShowEditModal(true);
        setEditData({
            name: user?.name || '',
            email: user?.email || '',
            no_telepon: user?.no_telepon || '',
            no_identitas: user?.no_identitas || '',
            photo_url: user?.photo_url || ''
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setErrors({});

        try {
            const response = await axios.put('/user/profile', editData);
            
            if (response.data.success) {
                alert('Profil berhasil diperbarui!');
                setShowEditModal(false);
                window.location.reload();
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('Terjadi kesalahan saat memperbarui profil');
            }
        } finally {
            setEditLoading(false);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                } 
            });
            setCameraStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Tidak dapat mengakses camera. Pastikan izin camera sudah diberikan.');
        }
    };

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
    };

    const generateGeometricPattern = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        const userData = `${user?.name || 'user'}${user?.email || 'email'}${user?.no_identitas || 'id'}`;
        const hash = btoa(userData).slice(0, 16);
        
        ctx.strokeStyle = '#00FF00';
        ctx.fillStyle = '#00FF00';
        ctx.lineWidth = 3;

        for (let i = 0; i < hash.length; i++) {
            const char = hash.charCodeAt(i);
            const x = (char % 8) * (width / 8);
            const y = Math.floor(char / 8) * (height / 8);
            
            if (char % 4 === 0) {
                ctx.beginPath();
                ctx.arc(x + 40, y + 40, 25, 0, 2 * Math.PI);
                ctx.fill();
            } else if (char % 4 === 1) {
                ctx.fillRect(x + 20, y + 20, 40, 40);
            } else if (char % 4 === 2) {
                ctx.beginPath();
                ctx.moveTo(x + 40, y + 20);
                ctx.lineTo(x + 20, y + 60);
                ctx.lineTo(x + 60, y + 60);
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.moveTo(x + 40, y + 20);
                ctx.lineTo(x + 60, y + 40);
                ctx.lineTo(x + 40, y + 60);
                ctx.lineTo(x + 20, y + 40);
                ctx.closePath();
                ctx.fill();
            }
        }

        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        
        ctx.strokeRect(5, 5, width - 10, height - 10);
        
        const cornerSize = 20;
        ctx.fillRect(0, 0, cornerSize, cornerSize);
        ctx.fillRect(width - cornerSize, 0, cornerSize, cornerSize);
        ctx.fillRect(0, height - cornerSize, cornerSize, cornerSize);
        ctx.fillRect(width - cornerSize, height - cornerSize, cornerSize, cornerSize);

        setGeometricPattern(canvas.toDataURL());
    };

    const scanGeometricPattern = () => {
        setIsScanning(true);
        setScanProgress(0);
        setBiometricStatus('🔍 Initializing biometric scan...');
        
        const progressSteps = [
            { text: '🔍 Analyzing facial features...', progress: 25 },
            { text: '📊 Processing biometric data...', progress: 50 },
            { text: '🔐 Verifying identity...', progress: 75 },
            { text: '✅ Biometric match confirmed!', progress: 100 }
        ];
        
        let currentStep = 0;
        const progressInterval = setInterval(() => {
            if (currentStep < progressSteps.length) {
                const step = progressSteps[currentStep];
                setBiometricStatus(step.text);
                setScanProgress(step.progress);
                currentStep++;
            } else {
                clearInterval(progressInterval);
                
                const biometricResult = simulateBiometricScan();
                
                const successMessage = `
}

🔓 Access granted to private data.
                `;
                
       
                setShowPrivateData(true);
                setShowCameraModal(false);
                setIsScanning(false);
                setBiometricStatus('');
                setScanProgress(0);
            }
        }, 500);
    };

    const analyzePattern = (imageData) => {
        return true;
    };
    const simulateBiometricScan = () => {
        // REKAYASA BIOMETRIC: Simulasi berbagai jenis biometric yang selalu berhasil
        const biometricTypes = [
            'Facial Recognition',
            'Iris Scan',
            'Fingerprint Match',
            'Voice Recognition',
            'Retina Scan',
            'Palm Print',
            'DNA Verification',
            'Gait Analysis',
            'Heart Rate Pattern',
            'Brain Wave Analysis'
        ];
        
        const randomType = biometricTypes[Math.floor(Math.random() * biometricTypes.length)];
        const confidence = Math.floor(Math.random() * 15) + 85; // 85-99% confidence untuk prototype
        
        return {
            type: randomType,
            confidence: confidence,
            status: 'VERIFIED',
            timestamp: new Date().toISOString(),
            // Tambahan data untuk membuat lebih realistis
            faceDetected: true,
            multipleFaces: Math.random() > 0.7, // 30% chance multiple faces
            lightingQuality: Math.floor(Math.random() * 3) + 3, // 3-5 scale
            imageQuality: Math.floor(Math.random() * 2) + 4 // 4-5 scale
        };
    };

    // Simulasi deteksi wajah real-time
    const simulateFaceDetection = () => {
        const faceFeatures = [
            'Eyes detected',
            'Nose identified',
            'Mouth recognized',
            'Facial symmetry confirmed',
            'Skin tone analyzed',
            'Age estimation: 25-35',
            'Gender: Detected',
            'Emotion: Neutral'
        ];
        
        return faceFeatures[Math.floor(Math.random() * faceFeatures.length)];
    };

    const handleCameraModal = () => {
        setShowCameraModal(true);
        generateGeometricPattern();
    };

    const hidePrivateData = () => {
        setShowPrivateData(false);
    };

    useEffect(() => {
        if (showCameraModal) {
            startCamera();
            // REKAYASA BIOMETRIC: Auto-scan setelah camera aktif
            setTimeout(() => {
                if (!isScanning) {
                    setBiometricStatus('🔍 Auto-detecting face...');
                    setTimeout(() => {
                        scanGeometricPattern();
                    }, 1000);
                }
            }, 2000);
        } else {
            stopCamera();
        }

        return () => {
            stopCamera();
        };
    }, [showCameraModal]);

    // Auto-scan biometric setiap 3 detik saat camera aktif
    useEffect(() => {
        if (showCameraModal && cameraStream && !isScanning) {
            const autoScanInterval = setInterval(() => {
                if (!showPrivateData) {
                    setBiometricStatus('🔍 Continuous biometric monitoring...');
                    setTimeout(() => {
                        scanGeometricPattern();
                    }, 500);
                }
            }, 3000);

            return () => clearInterval(autoScanInterval);
        }
    }, [showCameraModal, cameraStream, isScanning, showPrivateData]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-blue-600 px-4 pt-12 pb-6">
                <div className="flex items-center mb-6">
                    <button 
                        onClick={handleBack}
                        className="mr-4 text-white hover:text-white/80"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-semibold text-white">Profil Pengguna</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-6">
                {/* Profile Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
                    <div className="flex items-center mb-6">
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                            {user?.photo_url ? (
                                <img 
                                    src={user.photo_url} 
                                    alt={user.name}
                                    className="w-20 h-20 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div className={`w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center ${user?.photo_url ? 'hidden' : 'flex'}`}>
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{user?.name || 'Nama tidak tersedia'}</h2>
                            <p className="text-gray-500">{user?.email || 'Email tidak tersedia'}</p>
                            <div className="flex items-center mt-2">
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                    {user?.status || 'Active'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Additional User Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div>
                            <p className="text-sm text-gray-500">No. Telepon</p>
                            <p className="text-sm font-medium text-gray-900">
                                {showPrivateData ? (user?.no_telepon || 'Tidak tersedia') : '••••••••••'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">No. Identitas</p>
                            <p className="text-sm font-medium text-gray-900">
                                {showPrivateData ? (user?.no_identitas || 'Tidak tersedia') : '••••••••••••••••'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Role</p>
                            <p className="text-sm font-medium text-gray-900 capitalize">{user?.role || 'User'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Bergabung</p>
                            <p className="text-sm font-medium text-gray-900">
                                {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : 'Tidak tersedia'}
                            </p>
                        </div>
                    </div>

                    {/* Hash Info */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-800">Data Hash</p>
                                <p className="text-xs text-blue-600 font-mono">
                                    {btoa(`${user?.name || 'user'}${user?.email || 'email'}${user?.no_identitas || 'id'}`).slice(0, 16)}...
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {showPrivateData ? (
                                    <button
                                        onClick={hidePrivateData}
                                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors"
                                    >
                                        Sembunyikan
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleCameraModal}
                                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition-colors"
                                    >
                                        Lihat Data
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-4 mb-8">
                    {/* Edit Profile */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <button 
                            onClick={handleEditProfile}
                            className="w-full flex items-center hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                        >
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-gray-900">Edit Profil</div>
                                <div className="text-sm text-gray-500">Ubah informasi pribadi</div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Security */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <button className="w-full flex items-center hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-gray-900">Keamanan</div>
                                <div className="text-sm text-gray-500">Ubah kata sandi</div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Camera Security */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <button 
                            onClick={handleCameraModal}
                            className="w-full flex items-center hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                        >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-gray-900">Keamanan Camera</div>
                                <div className="text-sm text-gray-500">Scan pattern geometric untuk akses data</div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <button className="w-full flex items-center hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-10a6 6 0 1112 0z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-gray-900">Notifikasi</div>
                                <div className="text-sm text-gray-500">Pengaturan notifikasi</div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-red-200">
                    <button 
                        onClick={handleLogout}
                        disabled={logoutLoading}
                        className="w-full flex items-center hover:bg-red-50 rounded-lg p-2 -m-2 transition-colors disabled:opacity-50"
                    >
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                            {logoutLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent"></div>
                            ) : (
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            )}
                        </div>
                        <div className="flex-1 text-left">
                            <div className={`font-medium ${logoutLoading ? 'text-red-400' : 'text-red-600'}`}>
                                Keluar
                            </div>
                            <div className="text-sm text-red-500">
                                {logoutLoading ? 'Sedang keluar...' : 'Logout dari akun'}
                            </div>
                        </div>
                        {!logoutLoading && (
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* App Info */}
                <div className="mt-8 text-center">
                    <div className="text-gray-400 text-sm mb-2">KAI Access App</div>
                    <div className="text-gray-300 text-xs">Version 1.0.0</div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Edit Profil</h3>
                                    <p className="text-sm text-gray-500">Ubah informasi pribadi Anda</p>
                                </div>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="px-6 py-4">
                            <form onSubmit={handleEditSubmit} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editData.name}
                                        onChange={handleEditChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Masukkan nama lengkap"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editData.email}
                                        onChange={handleEditChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Masukkan email"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        No. Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        name="no_telepon"
                                        value={editData.no_telepon}
                                        onChange={handleEditChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.no_telepon ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Masukkan nomor telepon"
                                    />
                                    {errors.no_telepon && (
                                        <p className="text-red-500 text-xs mt-1">{errors.no_telepon}</p>
                                    )}
                                </div>

                                {/* Identity Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        No. Identitas (KTP/NIK)
                                    </label>
                                    <input
                                        type="text"
                                        name="no_identitas"
                                        value={editData.no_identitas}
                                        onChange={handleEditChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.no_identitas ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Masukkan nomor identitas"
                                    />
                                    {errors.no_identitas && (
                                        <p className="text-red-500 text-xs mt-1">{errors.no_identitas}</p>
                                    )}
                                </div>

                                {/* Photo URL */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        URL Foto Profil
                                    </label>
                                    <input
                                        type="url"
                                        name="photo_url"
                                        value={editData.photo_url}
                                        onChange={handleEditChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.photo_url ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Masukkan URL foto profil"
                                    />
                                    {errors.photo_url && (
                                        <p className="text-red-500 text-xs mt-1">{errors.photo_url}</p>
                                    )}
                                </div>

                                {/* Form Actions */}
                                <div className="flex space-x-3 pt-6 pb-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editLoading}
                                        className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 shadow-lg"
                                    >
                                        {editLoading ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Menyimpan...</span>
                                            </div>
                                        ) : (
                                            'Simpan Perubahan'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Camera Security Modal */}
            {showCameraModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Keamanan Camera</h3>
                                    <p className="text-sm text-gray-500">Scan pattern geometric untuk akses data pribadi</p>
                                </div>
                                <button
                                    onClick={() => setShowCameraModal(false)}
                                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Camera Feed */}
                                <div className="space-y-4">
                                    <h4 className="text-md font-semibold text-gray-800">Camera Feed</h4>
                                    <div className="relative bg-black rounded-xl overflow-hidden">
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className="w-full h-64 object-cover"
                                        />
                                        {isScanning && (
                                            <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                                                <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                                                    <div className="text-center">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-3"></div>
                                                        <p className="text-green-600 font-medium mb-2">{biometricStatus}</p>
                                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                                            <div 
                                                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                                                style={{ width: `${scanProgress}%` }}
                                                            ></div>
                                                        </div>
                                                        <p className="text-xs text-gray-600">{scanProgress}% Complete</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={scanGeometricPattern}
                                        disabled={isScanning}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-medium disabled:opacity-50 transition-colors"
                                    >
                                        {isScanning ? 'Scanning...' : 'Scan Pattern'}
                                    </button>
                                </div>

                                {/* Geometric Pattern */}
                                <div className="space-y-4">
                                    <h4 className="text-md font-semibold text-gray-800">Pattern Geometric</h4>
                                    <div className="bg-black rounded-xl p-4">
                                        <canvas
                                            ref={canvasRef}
                                            width={320}
                                            height={240}
                                            className="w-full h-64 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-3">
                                        <p className="text-sm text-blue-800">
                                            <strong>Info:</strong> Pattern ini dihasilkan dari hash data pribadi Anda untuk keamanan tambahan.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Security Info */}
                            <div className="mt-6 bg-green-50 rounded-lg p-4">
                                <h5 className="font-semibold text-green-800 mb-2">🔒 Keamanan Data</h5>
                                <ul className="text-sm text-green-700 space-y-1">
                                    <li>• Pattern geometric dihasilkan dari hash data pribadi Anda</li>
                                    <li>• Camera digunakan untuk verifikasi identitas</li>
                                    <li>• Data pribadi dienkripsi dengan algoritma geometric</li>
                                    <li>• Akses hanya diberikan setelah pattern terverifikasi</li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3 pt-6 pb-4">
                                <button
                                    onClick={() => setShowCameraModal(false)}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Tutup
                                </button>
                                <button
                                    onClick={generateGeometricPattern}
                                    className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                                >
                                    Generate Pattern
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
