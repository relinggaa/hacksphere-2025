# TSReact KTP Scanner Integration

## Overview
Implementasi fitur scan KTP otomatis menggunakan TSReact untuk mengisi form nama dan NIK secara otomatis.

## Components

### 1. TicketBookingModal.jsx
- **Form Fields**: Hanya menampilkan Nama Lengkap dan NIK
- **Scan Button**: Tombol "Scan KTP" dengan ikon kamera
- **Auto-fill**: Data dari scan otomatis mengisi form

### 2. TSReactKTPScanner.jsx
- **Camera Simulation**: Simulasi kamera untuk scan KTP
- **Progress Indicator**: Progress bar dan animasi loading
- **Instructions**: Petunjuk penggunaan scan KTP
- **Error Handling**: Tombol retry dan cancel

## Features

### ✅ Implemented Features
- **Simplified Form**: Hanya nama dan NIK (sesuai permintaan)
- **Scan Button**: Tombol scan dengan ikon kamera yang jelas
- **Auto-fill**: Data scan otomatis mengisi form
- **Progress Animation**: Loading animation saat scan
- **User Instructions**: Petunjuk penggunaan yang jelas
- **Error Handling**: Tombol retry dan cancel

### 🔧 TSReact Integration Points
```javascript
// Real TSReact integration would look like this:
const handleKTPScan = async () => {
    try {
        const result = await TSReact.scanKTP({
            camera: 'back',
            quality: 'high',
            timeout: 30000
        });
        
        setOrderDetails({
            name: result.name,
            nik: result.nik
        });
    } catch (error) {
        console.error('Scan failed:', error);
    }
};
```

## Data Flow

1. **User clicks "Scan KTP"** → Opens TSReactKTPScanner modal
2. **Camera opens** → Shows scanning interface with instructions
3. **User positions KTP** → Camera captures KTP image
4. **TSReact processes** → Extracts name and NIK from KTP
5. **Data returned** → Auto-fills form fields
6. **Modal closes** → User sees filled form

## UI/UX Features

### Form Design
- **Clean Layout**: Hanya 2 field (nama dan NIK)
- **Scan Button**: Prominent blue button dengan ikon kamera
- **Helper Text**: Instruksi penggunaan scan
- **Validation**: NIK max 16 karakter

### Scanner Interface
- **Camera View**: Simulated camera preview
- **Frame Guide**: Visual guide untuk positioning KTP
- **Progress Bar**: Real-time scanning progress
- **Instructions**: Step-by-step guidance
- **Error Recovery**: Retry dan cancel options

## Testing Data

### Sample KTP Data
```javascript
const scannedData = {
    name: 'RELINGGA ADITYA',
    nik: '3201234567890123',
    birthDate: '15-08-1995',
    address: 'Jl. Contoh Alamat No. 123, Jakarta',
    gender: 'Laki-laki',
    religion: 'Islam'
};
```

## Future Enhancements

### Real TSReact Integration
1. **Install TSReact SDK**
2. **Camera Permissions**: Request camera access
3. **Real OCR**: Integrate actual KTP OCR
4. **Error Handling**: Handle scan failures
5. **Offline Support**: Cache scanned data

### Additional Features
- **Multiple Passengers**: Scan KTP untuk multiple passengers
- **Data Validation**: Validate NIK format
- **Photo Storage**: Save scanned KTP images
- **History**: Keep scan history
- **Export**: Export passenger data

## Security Considerations

- **Data Privacy**: KTP data tidak disimpan permanen
- **Camera Access**: Request permission secara explicit
- **Data Encryption**: Encrypt sensitive data
- **Local Processing**: Process KTP locally jika memungkinkan
