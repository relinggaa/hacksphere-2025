# Real Camera Integration untuk KTP Scanning

## Overview
Implementasi akses kamera lokal menggunakan WebRTC API untuk mengambil foto KTP secara real-time dan memprosesnya untuk ekstraksi data.

## Technical Implementation

### 1. WebRTC getUserMedia API
```javascript
const stream = await navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: 'environment', // Back camera on mobile
        width: { ideal: 1280 },
        height: { ideal: 720 }
    },
    audio: false
});
```

### 2. Camera States Management
- **Initial State**: Menampilkan tombol "Mulai Scan"
- **Scanning State**: Kamera aktif dengan overlay frame
- **Processing State**: Loading animation saat memproses gambar
- **Error State**: Error handling dengan pesan yang jelas

### 3. Photo Capture Process
```javascript
const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to base64 image
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    
    // Process the captured image
    processImage(imageData);
};
```

## Features

### ✅ Implemented Features

#### Camera Access
- **Real Camera**: Menggunakan WebRTC getUserMedia API
- **Back Camera**: Otomatis menggunakan kamera belakang di mobile
- **High Quality**: Resolusi ideal 1280x720
- **Auto Focus**: Kamera otomatis fokus pada objek

#### User Interface
- **Live Preview**: Video stream real-time dari kamera
- **Frame Overlay**: Panduan visual untuk positioning KTP
- **Capture Button**: Tombol capture yang besar dan mudah diakses
- **Loading States**: Animasi loading saat memproses
- **Error Handling**: Pesan error yang informatif

#### Error Handling
- **Permission Denied**: "Akses kamera ditolak"
- **No Camera**: "Kamera tidak ditemukan"
- **Camera Busy**: "Kamera sedang digunakan"
- **Browser Support**: "Browser tidak mendukung akses kamera"

#### Photo Processing
- **Canvas Capture**: Menggunakan HTML5 Canvas untuk capture
- **Base64 Encoding**: Konversi gambar ke base64
- **OCR Simulation**: Simulasi ekstraksi data dari KTP
- **Auto-fill Form**: Data otomatis mengisi form

## UI/UX Features

### Camera Interface
| **Element** | **Description** | **Function** |
|-------------|-----------------|--------------|
| **Video Element** | Live camera feed | Menampilkan preview real-time |
| **Frame Overlay** | Blue border dengan label | Panduan positioning KTP |
| **Capture Button** | Large circular button | Ambil foto KTP |
| **Loading Animation** | Spinner dengan progress | Indikator processing |
| **Error Message** | Red alert dengan icon | Informasi error yang jelas |

### User Flow
1. **Click "Mulai Scan"** → Request camera permission
2. **Camera Opens** → Live video feed dengan overlay
3. **Position KTP** → Dalam frame overlay biru
4. **Click Capture** → Ambil foto dan proses
5. **Processing** → Loading animation 2 detik
6. **Auto-fill** → Form terisi dengan data KTP
7. **Close Modal** → Kembali ke form booking

## Error Handling

### Camera Permission Errors
```javascript
const getCameraErrorMessage = (error) => {
    switch (error.name) {
        case 'NotAllowedError':
            return 'Akses kamera ditolak. Silakan izinkan akses kamera untuk melanjutkan.';
        case 'NotFoundError':
            return 'Kamera tidak ditemukan. Pastikan perangkat memiliki kamera.';
        case 'NotSupportedError':
            return 'Browser tidak mendukung akses kamera.';
        case 'NotReadableError':
            return 'Kamera sedang digunakan oleh aplikasi lain.';
        default:
            return 'Terjadi kesalahan saat mengakses kamera.';
    }
};
```

### Recovery Options
- **Retry Button**: Coba lagi akses kamera
- **Manual Input**: Fallback ke input manual
- **Close Modal**: Keluar dari scanner

## Security & Privacy

### Data Handling
- **Local Processing**: Gambar diproses di browser
- **No Upload**: Gambar tidak diupload ke server
- **Temporary Storage**: Data hanya disimpan sementara
- **Auto Cleanup**: Stream kamera dihentikan setelah selesai

### Privacy Considerations
- **Permission Request**: Explicit permission untuk kamera
- **User Control**: User dapat membatalkan kapan saja
- **Data Minimization**: Hanya ekstrak data yang diperlukan
- **No Persistence**: Data tidak disimpan permanen

## Browser Compatibility

### Supported Browsers
- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support (iOS 11+)
- **Edge**: ✅ Full support

### Mobile Support
- **iOS Safari**: ✅ Camera access
- **Android Chrome**: ✅ Camera access
- **Mobile Firefox**: ✅ Camera access

## Performance Optimization

### Camera Settings
```javascript
const stream = await navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: 'environment',
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        frameRate: { ideal: 30, max: 60 }
    }
});
```

### Memory Management
- **Stream Cleanup**: Otomatis stop stream saat selesai
- **Canvas Cleanup**: Clear canvas setelah capture
- **Event Listeners**: Remove listeners saat unmount

## Future Enhancements

### Real OCR Integration
1. **Tesseract.js**: Client-side OCR library
2. **Google Vision API**: Cloud-based OCR
3. **Azure Computer Vision**: Microsoft OCR service
4. **AWS Textract**: Amazon OCR service

### Advanced Features
- **Image Enhancement**: Brightness, contrast adjustment
- **Multiple Languages**: Support bahasa Indonesia
- **Data Validation**: Validate NIK format
- **Batch Processing**: Multiple KTP scanning

### Mobile Optimizations
- **Touch Gestures**: Pinch to zoom, tap to focus
- **Orientation Lock**: Lock orientation saat scan
- **Flash Control**: Toggle flash untuk pencahayaan
- **Haptic Feedback**: Vibration saat capture

## Testing

### Test Scenarios
1. **Permission Grant**: User mengizinkan akses kamera
2. **Permission Deny**: User menolak akses kamera
3. **No Camera**: Perangkat tidak memiliki kamera
4. **Camera Busy**: Kamera sedang digunakan aplikasi lain
5. **Poor Lighting**: Kondisi pencahayaan buruk
6. **Blurry Image**: KTP tidak fokus
7. **Network Issues**: Masalah koneksi internet

### Test Data
```javascript
// Sample KTP data untuk testing
const testKTPData = {
    name: 'RELINGGA ADITYA',
    nik: '3201234567890123',
    birthDate: '15-08-1995',
    address: 'Jl. Contoh Alamat No. 123, Jakarta',
    gender: 'Laki-laki',
    religion: 'Islam'
};
```

## Deployment Notes

### HTTPS Requirement
- **WebRTC**: Memerlukan HTTPS untuk akses kamera
- **Local Development**: HTTP hanya untuk localhost
- **Production**: Wajib menggunakan HTTPS

### Environment Variables
```env
# Camera settings
CAMERA_QUALITY=high
CAMERA_TIMEOUT=30000
OCR_TIMEOUT=10000
```

### Performance Monitoring
- **Camera Load Time**: Monitor waktu loading kamera
- **Capture Success Rate**: Track success rate capture
- **Processing Time**: Monitor waktu processing OCR
- **Error Rate**: Track frequency error kamera
