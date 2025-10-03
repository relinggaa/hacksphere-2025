import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';

export default function DocumentUploadModal({ isOpen, onClose, onScanComplete }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [error, setError] = useState(null);
    const [ocrResult, setOcrResult] = useState(null);
    const [showOCRResult, setShowOCRResult] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isEnhancing, setIsEnhancing] = useState(false);
    
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    if (!isOpen) return null;

    // Handle file selection
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('File harus berupa gambar (JPG, PNG, dll)');
                return;
            }
            
            if (file.size > 10 * 1024 * 1024) {
                setError('Ukuran file maksimal 10MB');
                return;
            }
            
            setSelectedFile(file);
            setError(null);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle camera capture
    const handleCameraCapture = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setError(null);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Start camera for direct capture
    const startCamera = async () => {
        try {
            setError(null);
            setShowCamera(true);
            
            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera if available
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            
            streamRef.current = stream;
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            
        } catch (error) {
            console.error('Camera access error:', error);
            setShowCamera(false);
            
            if (error.name === 'NotAllowedError') {
                setError('Akses kamera ditolak. Silakan izinkan akses kamera dan coba lagi.');
            } else if (error.name === 'NotFoundError') {
                setError('Kamera tidak ditemukan. Pastikan perangkat memiliki kamera.');
            } else if (error.name === 'NotReadableError') {
                setError('Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi lain dan coba lagi.');
            } else {
                setError('Gagal mengakses kamera. Silakan coba lagi.');
            }
        }
    };

    // Enhance image quality
    const enhanceImage = (canvas, context) => {
        // Get image data
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply image enhancement filters
        for (let i = 0; i < data.length; i += 4) {
            // Increase contrast
            const contrast = 1.2;
            data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrast + 128));     // Red
            data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrast + 128)); // Green
            data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrast + 128)); // Blue
            
            // Increase brightness slightly
            const brightness = 10;
            data[i] = Math.min(255, Math.max(0, data[i] + brightness));     // Red
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightness)); // Green
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightness)); // Blue
            
            // Apply sharpening filter (simplified)
            if (i > canvas.width * 4) { // Skip first row
                const sharpeningFactor = 0.1;
                data[i] = Math.min(255, Math.max(0, data[i] + (data[i] - data[i - canvas.width * 4]) * sharpeningFactor));
                data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + (data[i + 1] - data[i + 1 - canvas.width * 4]) * sharpeningFactor));
                data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + (data[i + 2] - data[i + 2 - canvas.width * 4]) * sharpeningFactor));
            }
        }
        
        // Put enhanced image data back
        context.putImageData(imageData, 0, 0);
    };

    // Capture photo from camera with enhancement
    const capturePhoto = async () => {
        if (videoRef.current && canvasRef.current) {
            setIsEnhancing(true);
            
            // Small delay to show enhancement indicator
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            
            // Set canvas size to match video (higher resolution for better quality)
            canvas.width = video.videoWidth * 1.5; // Increase resolution by 50%
            canvas.height = video.videoHeight * 1.5;
            
            // Enable image smoothing for better quality
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = 'high';
            
            // Draw video frame to canvas with scaling
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Apply image enhancement
            enhanceImage(canvas, context);
            
            // Convert to base64 image with higher quality
            const imageData = canvas.toDataURL('image/jpeg', 0.95); // Higher quality JPEG
            
            setCapturedImage(imageData);
            setPreviewImage(imageData);
            setSelectedFile(null); // Clear file selection
            setShowCamera(false);
            setIsEnhancing(false);
            
            // Stop camera stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        }
    };

    // Stop camera
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setShowCamera(false);
    };

    // Process image with OCR
    const processImage = async (imageData) => {
        setIsProcessing(true);
        setScanProgress(0);
        setError(null);
        
        try {
            console.log('Starting OCR processing...');
            
            let worker;
            try {
                worker = await createWorker('ind', 1, {
                    logger: m => {
                        console.log('Tesseract progress:', m);
                        if (m.status === 'recognizing text') {
                            setScanProgress(Math.round(m.progress * 100));
                        }
                    }
                });
                console.log('Indonesian model loaded successfully');
            } catch (indError) {
                console.log('Indonesian model failed, trying English:', indError);
                worker = await createWorker('eng', 1, {
                    logger: m => {
                        console.log('Tesseract progress:', m);
                        if (m.status === 'recognizing text') {
                            setScanProgress(Math.round(m.progress * 100));
                        }
                    }
                });
                console.log('English model loaded successfully');
            }
            
            console.log('Tesseract worker created successfully');
            
            const { data: { text } } = await worker.recognize(imageData);
            
            console.log('OCR completed. Raw text length:', text.length);
            console.log('Raw OCR text:', text);
            
            const extractedData = extractKTPData(text);
            
            console.log('Extracted data:', extractedData);
            
            await worker.terminate();
            console.log('Worker terminated');
            
            setIsProcessing(false);
            
            if (extractedData.nik) {
                console.log('Successfully extracted NIK:', extractedData.nik);
                setOcrResult(extractedData);
                setShowOCRResult(true);
            } else {
                console.log('NIK not found in OCR text:', text);
                console.log('Extracted data:', extractedData);
                setError('NIK tidak ditemukan dalam gambar. Pastikan KTP terlihat jelas dan coba lagi.');
            }
            
        } catch (error) {
            console.error('OCR processing error:', error);
            setIsProcessing(false);
            setError('Gagal memproses gambar KTP. Silakan coba lagi.');
        }
    };

    // Extract KTP data from OCR text
    const extractKTPData = (ocrText) => {
        console.log('OCR Text:', ocrText);
        console.log('OCR Text Length:', ocrText.length);
        console.log('OCR Text Lines:', ocrText.split('\n'));
        
        const nikPatterns = [
            /\b\d{16}\b/g,
            /NIK[\s:]*(\d{16})/i,
            /(\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{2})/g,
            /(\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2})/g,
            /(\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})/g
        ];
        
        let nik = null;
        for (const pattern of nikPatterns) {
            const matches = ocrText.match(pattern);
            if (matches) {
                nik = matches[0].replace(/[.\s-]/g, '');
                if (nik.length === 16 && /^\d{16}$/.test(nik)) {
                    break;
                }
            }
        }
        
        if (nik && !validateNIK(nik)) {
            console.log('NIK validation failed:', nik);
            nik = null;
        }
        
        console.log('Final extracted NIK:', nik);
        
        // Extract name - focus on position relative to NIK
        let name = null;
        
        // First, try to find name that appears after NIK in the text
        if (nik) {
            console.log('Looking for name after NIK:', nik);
            
            // Find the position of NIK in the text
            const nikPosition = ocrText.indexOf(nik);
            if (nikPosition !== -1) {
                console.log('NIK found at position:', nikPosition);
                
                // Get text after NIK
                const textAfterNIK = ocrText.substring(nikPosition + nik.length);
                console.log('Text after NIK:', textAfterNIK);
                
                // Look for capitalized words after NIK (likely the name)
                const nameAfterNIKPatterns = [
                    // Pattern 1: Look for capitalized words immediately after NIK
                    /^[\s\n\r]*([A-Z][A-Z\s]{3,30})/,
                    // Pattern 2: Look for capitalized words on next line
                    /[\s\n\r]+([A-Z][A-Z\s]{3,30})/,
                    // Pattern 3: Look for words that look like names
                    /[\s\n\r]+([A-Z][A-Z\s]{4,25})(?=[\s\n\r]|$)/,
                    // Pattern 4: Look for name pattern with specific length
                    /[\s\n\r]+([A-Z][A-Z\s]{5,20})(?=[\s\n\r]|$|[A-Z]{2,})/
                ];
                
                for (const pattern of nameAfterNIKPatterns) {
                    const match = textAfterNIK.match(pattern);
                    if (match && match[1]) {
                        name = match[1].trim();
                        // Clean name (remove extra spaces, keep only letters and spaces)
                        name = name.replace(/[^A-Z\s]/gi, '').replace(/\s+/g, ' ').trim();
                        
                        console.log('Found potential name after NIK:', name);
                        
                        // Additional validation for name
                        if (name.length >= 3 && name.length <= 50) {
                            const words = name.split(' ').filter(word => word.length > 0);
                            if (words.length >= 2 && words.every(word => word.length >= 2)) {
                                console.log('Valid name found after NIK:', name);
                                break;
                            }
                        }
                        name = null; // Reset if validation fails
                    }
                }
            }
        }
        
        // If no name found after NIK, try traditional patterns
        if (!name) {
            console.log('No name found after NIK, trying traditional patterns...');
            const namePatterns = [
                // Pattern 1: NAMA: JOHN DOE
                /(?:Nama|NAMA)[\s:]*([A-Z][A-Z\s]{2,30})/i,
                // Pattern 2: NAMA LENGKAP: JOHN DOE
                /(?:Nama Lengkap|NAMA LENGKAP)[\s:]*([A-Z][A-Z\s]{2,30})/i,
                // Pattern 3: NAMA PEMEGANG: JOHN DOE
                /(?:Nama Pemegang|NAMA PEMEGANG)[\s:]*([A-Z][A-Z\s]{2,30})/i,
                // Pattern 4: Just look for capitalized words after "NAMA"
                /(?:Nama|NAMA)[\s:]*([A-Z][A-Z\s]+?)(?=\n|\r|$|[A-Z]{2,}\s*:)/i,
                // Pattern 5: Look for common Indonesian names pattern
                /([A-Z][A-Z\s]{4,25})(?=\s*(?:NIK|Tempat|Alamat|Jenis|Agama))/i,
                // Pattern 6: Look for words that start with capital and contain spaces (likely names)
                /([A-Z][A-Z\s]{3,20})(?=\s*\d{16})/i
            ];
            
            for (const pattern of namePatterns) {
                const match = ocrText.match(pattern);
                if (match && match[1]) {
                    name = match[1].trim();
                    // Clean name (remove extra spaces, keep only letters and spaces)
                    name = name.replace(/[^A-Z\s]/gi, '').replace(/\s+/g, ' ').trim();
                    
                    // Additional validation for name
                    if (name.length >= 3 && name.length <= 50) {
                        // Check if it contains at least one space (likely a full name)
                        const words = name.split(' ').filter(word => word.length > 0);
                        if (words.length >= 2 && words.every(word => word.length >= 2)) {
                            console.log('Valid name found with traditional pattern:', name);
                            break;
                        }
                    }
                }
            }
        }
        
        // If no name found with patterns, try line-based approach
        if (!name) {
            console.log('No name found with patterns, trying line-based approach...');
            
            // Split text into lines
            const lines = ocrText.split(/[\n\r]+/).map(line => line.trim()).filter(line => line.length > 0);
            console.log('OCR Lines:', lines);
            
            // Look for NIK line and check the line after it
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                // Check if this line contains NIK
                if (line.includes(nik)) {
                    console.log('Found NIK in line:', i, line);
                    
                    // Check the next line for name
                    if (i + 1 < lines.length) {
                        const nextLine = lines[i + 1];
                        console.log('Next line after NIK:', nextLine);
                        
                        // Extract capitalized words from next line
                        const nameMatch = nextLine.match(/([A-Z][A-Z\s]{3,30})/);
                        if (nameMatch) {
                            name = nameMatch[1].trim();
                            name = name.replace(/[^A-Z\s]/gi, '').replace(/\s+/g, ' ').trim();
                            
                            console.log('Found potential name in next line:', name);
                            
                            // Validate name
                            if (name.length >= 3 && name.length <= 50) {
                                const words = name.split(' ').filter(word => word.length > 0);
                                if (words.length >= 2 && words.every(word => word.length >= 2)) {
                                    console.log('Valid name found in next line:', name);
                                    break;
                                }
                            }
                            name = null; // Reset if validation fails
                        }
                    }
                    
                    // Also check the line before NIK (sometimes name is above NIK)
                    if (i > 0) {
                        const prevLine = lines[i - 1];
                        console.log('Previous line before NIK:', prevLine);
                        
                        // Extract capitalized words from previous line
                        const nameMatch = prevLine.match(/([A-Z][A-Z\s]{3,30})/);
                        if (nameMatch) {
                            name = nameMatch[1].trim();
                            name = name.replace(/[^A-Z\s]/gi, '').replace(/\s+/g, ' ').trim();
                            
                            console.log('Found potential name in previous line:', name);
                            
                            // Validate name
                            if (name.length >= 3 && name.length <= 50) {
                                const words = name.split(' ').filter(word => word.length > 0);
                                if (words.length >= 2 && words.every(word => word.length >= 2)) {
                                    console.log('Valid name found in previous line:', name);
                                    break;
                                }
                            }
                            name = null; // Reset if validation fails
                        }
                    }
                }
            }
        }
        
        // Final fallback: try to find capitalized words
        if (!name) {
            console.log('No name found with line-based approach, trying final fallback...');
            const words = ocrText.match(/[A-Z][A-Z\s]{3,20}/g);
            console.log('Found capitalized words:', words);
            
            if (words) {
                for (const word of words) {
                    const cleanWord = word.replace(/[^A-Z\s]/gi, '').replace(/\s+/g, ' ').trim();
                    const wordArray = cleanWord.split(' ').filter(w => w.length > 0);
                    
                    console.log('Checking word:', cleanWord, 'Words:', wordArray);
                    
                    // Check if it looks like a name (2-4 words, each 2+ chars)
                    if (wordArray.length >= 2 && wordArray.length <= 4 && 
                        wordArray.every(w => w.length >= 2) && 
                        cleanWord.length >= 5 && cleanWord.length <= 30) {
                        
                        // Make sure it's not a field name
                        if (!cleanWord.toLowerCase().includes('nama') && 
                            !cleanWord.toLowerCase().includes('nik') &&
                            !cleanWord.toLowerCase().includes('tempat') &&
                            !cleanWord.toLowerCase().includes('alamat')) {
                            name = cleanWord;
                            console.log('Selected name from final fallback:', name);
                            break;
                        }
                    }
                }
            }
        }
        
        console.log('Final extracted name:', name);
        
        const birthDatePatterns = [
            /(?:Tempat|TEMPAT)[\s:]*([A-Z\s]+)[\s,]*(\d{2}[-/]\d{2}[-/]\d{4})/i,
            /(?:Tempat Lahir|TEMPAT LAHIR)[\s:]*([A-Z\s]+)[\s,]*(\d{2}[-/]\d{2}[-/]\d{4})/i,
            /(\d{2}[-/]\d{2}[-/]\d{4})/g
        ];
        
        let birthDate = null;
        for (const pattern of birthDatePatterns) {
            const match = ocrText.match(pattern);
            if (match) {
                birthDate = match[match.length - 1];
                if (birthDate && /^\d{2}[-/]\d{2}[-/]\d{4}$/.test(birthDate)) {
                    break;
                }
            }
        }
        
        const addressPatterns = [
            /(?:Alamat|ALAMAT)[\s:]*([A-Z0-9\s,.-]+)/i,
            /(?:Alamat Lengkap|ALAMAT LENGKAP)[\s:]*([A-Z0-9\s,.-]+)/i,
            /(?:Domisili|DOMISILI)[\s:]*([A-Z0-9\s,.-]+)/i
        ];
        
        let address = null;
        for (const pattern of addressPatterns) {
            const match = ocrText.match(pattern);
            if (match && match[1]) {
                address = match[1].trim();
                address = address.replace(/\s+/g, ' ').trim();
                if (address.length > 10) {
                    break;
                }
            }
        }
        
        const genderPatterns = [
            /(?:Jenis|JENIS)[\s:]*Kelamin[\s:]*([A-Z]+)/i,
            /(?:Jenis Kelamin|JENIS KELAMIN)[\s:]*([A-Z]+)/i,
            /(?:Laki-laki|LAKI-LAKI|Perempuan|PEREMPUAN)/i
        ];
        
        let gender = null;
        for (const pattern of genderPatterns) {
            const match = ocrText.match(pattern);
            if (match) {
                gender = match[1] || match[0];
                gender = gender.trim();
                if (gender.toLowerCase().includes('laki') || gender.toLowerCase().includes('perempuan')) {
                    break;
                }
            }
        }
        
        const religionPatterns = [
            /(?:Agama|AGAMA)[\s:]*([A-Z]+)/i,
            /(?:Islam|ISLAM|Kristen|KRISTEN|Katolik|KATOLIK|Hindu|HINDU|Buddha|BUDDHA|Konghucu|KONGHUCHU)/i
        ];
        
        let religion = null;
        for (const pattern of religionPatterns) {
            const match = ocrText.match(pattern);
            if (match) {
                religion = match[1] || match[0];
                religion = religion.trim();
                if (religion.length > 2) {
                    break;
                }
            }
        }
        
        return {
            name: name,
            nik: nik,
            birthDate: birthDate,
            address: address,
            gender: gender,
            religion: religion
        };
    };

    // Validate NIK format
    const validateNIK = (nik) => {
        if (!nik || nik.length !== 16) return false;
        
        if (!/^\d{16}$/.test(nik)) return false;
        
        const provinceCode = nik.substring(0, 2);
        const regencyCode = nik.substring(2, 4);
        const districtCode = nik.substring(4, 6);
        const birthDate = nik.substring(6, 12);
        const sequence = nik.substring(12, 15);
        const gender = nik.substring(14, 15);
        
        const provinceNum = parseInt(provinceCode);
        if (provinceNum < 1 || provinceNum > 94) return false;
        
        const day = parseInt(birthDate.substring(0, 2));
        const month = parseInt(birthDate.substring(2, 4));
        const year = parseInt(birthDate.substring(4, 6));
        
        const actualDay = parseInt(gender) % 2 === 0 ? day - 40 : day;
        
        if (actualDay < 1 || actualDay > 31) return false;
        if (month < 1 || month > 12) return false;
        
        return true;
    };

    // Handle upload button click
    const handleUpload = () => {
        if (!selectedFile && !capturedImage) {
            setError('Pilih file atau ambil foto terlebih dahulu');
            return;
        }
        
        // Use captured image if available, otherwise use selected file
        if (capturedImage) {
            processImage(capturedImage);
        } else if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                processImage(e.target.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    // Handle close modal
    const handleClose = () => {
        setSelectedFile(null);
        setPreviewImage(null);
        setIsProcessing(false);
        setScanProgress(0);
        setError(null);
        setShowCamera(false);
        setCapturedImage(null);
        setIsEnhancing(false);
        
        // Stop camera if running
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        onClose();
    };

    // Reset form
    const handleReset = () => {
        setSelectedFile(null);
        setPreviewImage(null);
        setError(null);
        setScanProgress(0);
        setOcrResult(null);
        setShowOCRResult(false);
        setShowCamera(false);
        setCapturedImage(null);
        setIsEnhancing(false);
        
        // Stop camera if running
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
    };

    // Handle OCR result confirmation
    const handleOCRConfirm = (data) => {
        onScanComplete(data);
        handleClose();
    };

    // Handle OCR retry
    const handleOCRRetry = () => {
        setOcrResult(null);
        setShowOCRResult(false);
        setError(null);
        setScanProgress(0);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 m-4 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="text-center">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Upload Dokumen KTP</h3>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Upload Methods */}
                    {!selectedFile && !isProcessing && (
                        <div className="space-y-4 mb-6">
                            <h4 className="text-md font-medium text-gray-800">Pilih cara upload:</h4>
                            
                            {/* File Selection */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full p-4 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors"
                            >
                                <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-sm font-medium text-gray-700">Pilih File dari Galeri</p>
                                <p className="text-xs text-gray-500">JPG, PNG (Max 10MB)</p>
                            </button>
                            
                            {/* Camera Capture */}
                            <button
                                onClick={startCamera}
                                className="w-full p-4 border-2 border-dashed border-green-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors"
                            >
                                <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-sm font-medium text-gray-700">Ambil Foto dengan Kamera</p>
                                <p className="text-xs text-gray-500">Akses kamera langsung</p>
                            </button>
                        </div>
                    )}

                    {/* Hidden File Inputs */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleCameraCapture}
                        className="hidden"
                    />

                    {/* Camera View */}
                    {showCamera && (
                        <div className="mb-6">
                            <h4 className="text-md font-medium text-gray-800 mb-3">Kamera Aktif:</h4>
                            <div className="relative">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
                                />
                                <canvas ref={canvasRef} className="hidden" />
                                
                                {/* Enhancement Indicator */}
                                {isEnhancing && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                        <div className="text-center text-white">
                                            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                            <p className="text-sm">Meningkatkan kualitas gambar...</p>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Camera Controls */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                                    <button
                                        onClick={stopCamera}
                                        disabled={isEnhancing}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={capturePhoto}
                                        disabled={isEnhancing}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isEnhancing ? 'Memproses...' : 'Ambil Foto'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preview Image */}
                    {previewImage && !isProcessing && !showCamera && (
                        <div className="mb-6">
                            <h4 className="text-md font-medium text-gray-800 mb-3">Preview Gambar:</h4>
                            <div className="relative">
                                <img
                                    src={previewImage}
                                    alt="Preview KTP"
                                    className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
                                />
                            </div>
                        </div>
                    )}

                    {/* Processing State */}
                    {isProcessing && (
                        <div className="mb-6">
                            <div className="relative mb-4">
                                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Memproses gambar KTP dengan OCR...</p>
                            <p className="text-xs text-gray-500 mb-2">Mengekstrak NIK dari KTP</p>
                            
                            {/* OCR Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${scanProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500">{scanProgress}% selesai</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                    <h4 className="text-sm font-medium text-red-800">Error</h4>
                                    <p className="text-xs text-red-700 mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="bg-blue-50 rounded-lg p-3 mb-4 text-left">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Petunjuk:</h4>
                        <ul className="text-xs text-blue-800 space-y-1">
                            <li>• Pastikan KTP dalam kondisi baik dan tidak rusak</li>
                            <li>• Atur pencahayaan yang cukup</li>
                            <li>• Pastikan seluruh KTP terlihat dalam gambar</li>
                            <li>• Format file: JPG, PNG (maksimal 10MB)</li>
                            <li>• Foto dari kamera akan otomatis ditingkatkan kualitasnya</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        
                        {(selectedFile || capturedImage) && !isProcessing && !showCamera && (
                            <button
                                onClick={handleReset}
                                className="flex-1 px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors"
                            >
                                Reset
                            </button>
                        )}
                        
                        {(selectedFile || capturedImage) && !isProcessing && !showCamera && (
                            <button
                                onClick={handleUpload}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Upload & Scan
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* OCR Result Modal */}
            {showOCRResult && ocrResult && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-end justify-center">
                    <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Hasil Scan KTP</h3>
                            <button
                                onClick={handleOCRRetry}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">NIK berhasil diekstrak dari KTP</p>

                                {/* Extracted Data */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">NIK</label>
                                        <div className={`text-sm font-medium bg-white px-3 py-2 rounded border ${
                                            ocrResult.nik ? 'text-gray-900' : 'text-red-500'
                                        }`}>
                                            {ocrResult.nik || 'Tidak ditemukan'}
                                        </div>
                                    </div>
                                </div>

                                {/* Data Quality Warning */}
                                {!ocrResult.nik && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            <div>
                                                <h4 className="text-sm font-medium text-yellow-800">NIK Tidak Ditemukan</h4>
                                                <p className="text-xs text-yellow-700 mt-1">
                                                    NIK tidak berhasil diekstrak dari gambar. Pastikan KTP terlihat jelas dan coba scan ulang.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleOCRRetry}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Scan Ulang
                                    </button>
                                    <button
                                        onClick={() => handleOCRConfirm(ocrResult)}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Gunakan Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}