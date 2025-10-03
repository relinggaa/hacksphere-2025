# Tesseract.js OCR Integration untuk KTP Scanning

## Overview
Implementasi Tesseract.js untuk melakukan Optical Character Recognition (OCR) pada foto KTP dan mengekstrak nomor NIK serta data lainnya secara otomatis.

## Technical Implementation

### 1. Tesseract.js Configuration
```javascript
import { createWorker } from 'tesseract.js';

const worker = await createWorker('ind', 1, {
    logger: m => {
        if (m.status === 'recognizing text') {
            setScanProgress(Math.round(m.progress * 100));
        }
    }
});
```

### 2. OCR Processing Flow
```javascript
const processImage = async (imageData) => {
    // Create Tesseract worker
    const worker = await createWorker('ind', 1);
    
    // Perform OCR on the image
    const { data: { text } } = await worker.recognize(imageData);
    
    // Extract KTP data from OCR text
    const extractedData = extractKTPData(text);
    
    // Terminate worker
    await worker.terminate();
    
    return extractedData;
};
```

### 3. NIK Extraction Patterns
```javascript
const nikPatterns = [
    /\b\d{16}\b/g, // Standard 16 digits
    /NIK[\s:]*(\d{16})/i, // NIK: 1234567890123456
    /(\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{2})/g, // With dots
    /(\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2})/g // With spaces
];
```

## Features

### ✅ Implemented Features

#### OCR Engine
- **Tesseract.js**: Client-side OCR processing
- **Indonesian Language**: Support bahasa Indonesia ('ind')
- **Progress Tracking**: Real-time progress indicator
- **Error Handling**: Robust error handling dan recovery

#### NIK Extraction
- **Multiple Patterns**: Support berbagai format NIK
- **Data Cleaning**: Remove dots, spaces, dan karakter non-digit
- **Validation**: Validasi format NIK Indonesia
- **Fallback Data**: Data fallback untuk testing

#### Data Extraction
- **NIK**: 16 digit nomor identitas
- **Nama**: Nama lengkap dari KTP
- **Tanggal Lahir**: Tanggal lahir
- **Alamat**: Alamat lengkap
- **Jenis Kelamin**: Laki-laki/Perempuan
- **Agama**: Agama yang tercantum

#### User Interface
- **Progress Bar**: Real-time OCR progress
- **Result Modal**: Preview hasil ekstraksi
- **Confirmation**: User dapat konfirmasi data
- **Retry Option**: Scan ulang jika hasil tidak akurat

## NIK Validation

### Format Validation
```javascript
const validateNIK = (nik) => {
    if (!nik || nik.length !== 16) return false;
    
    // Check if all characters are digits
    if (!/^\d{16}$/.test(nik)) return false;
    
    // Extract components
    const provinceCode = nik.substring(0, 2);
    const regencyCode = nik.substring(2, 4);
    const districtCode = nik.substring(4, 6);
    const birthDate = nik.substring(6, 12);
    const sequence = nik.substring(12, 15);
    const gender = nik.substring(14, 15);
    
    // Validate province code (01-94)
    const provinceNum = parseInt(provinceCode);
    if (provinceNum < 1 || provinceNum > 94) return false;
    
    // Validate birth date format
    const day = parseInt(birthDate.substring(0, 2));
    const month = parseInt(birthDate.substring(2, 4));
    const year = parseInt(birthDate.substring(4, 6));
    
    // Adjust day for female (add 40)
    const actualDay = parseInt(gender) % 2 === 0 ? day - 40 : day;
    
    if (actualDay < 1 || actualDay > 31) return false;
    if (month < 1 || month > 12) return false;
    
    return true;
};
```

### NIK Structure
| **Position** | **Length** | **Description** | **Example** |
|--------------|------------|-----------------|-------------|
| 1-2 | 2 | Kode Provinsi | 32 (Jawa Barat) |
| 3-4 | 2 | Kode Kabupaten/Kota | 01 (Bogor) |
| 5-6 | 2 | Kode Kecamatan | 01 (Bogor Selatan) |
| 7-12 | 6 | Tanggal Lahir (DDMMYY) | 150895 |
| 13-15 | 3 | Nomor Urut | 001 |
| 16 | 1 | Jenis Kelamin (1=L, 2=P) | 1 |

## Data Extraction Patterns

### Regex Patterns
```javascript
// NIK Extraction
const nikRegex = /\b\d{16}\b/g;

// Name Extraction
const nameRegex = /(?:Nama|NAMA)[\s:]*([A-Z\s]+)/i;

// Birth Date Extraction
const birthDateRegex = /(?:Tempat|TEMPAT)[\s:]*([A-Z\s]+)[\s,]*(\d{2}[-/]\d{2}[-/]\d{4})/i;

// Address Extraction
const addressRegex = /(?:Alamat|ALAMAT)[\s:]*([A-Z0-9\s,.-]+)/i;

// Gender Extraction
const genderRegex = /(?:Jenis|JENIS)[\s:]*Kelamin[\s:]*([A-Z]+)/i;

// Religion Extraction
const religionRegex = /(?:Agama|AGAMA)[\s:]*([A-Z]+)/i;
```

## User Experience Flow

### OCR Process Flow
1. **Capture Photo** → Ambil foto KTP dengan kamera
2. **OCR Processing** → Tesseract.js memproses gambar
3. **Progress Tracking** → Progress bar menunjukkan kemajuan
4. **Data Extraction** → Ekstrak NIK dan data lainnya
5. **Result Preview** → Modal menampilkan hasil ekstraksi
6. **User Confirmation** → User konfirmasi atau scan ulang
7. **Auto-fill Form** → Data otomatis mengisi form

### Error Handling
- **OCR Failure**: "Gagal memproses gambar KTP"
- **NIK Not Found**: "NIK tidak ditemukan dalam gambar"
- **Invalid NIK**: "Format NIK tidak valid"
- **Retry Option**: Scan ulang dengan kamera yang sama

## Performance Optimization

### Worker Management
```javascript
// Create worker
const worker = await createWorker('ind', 1);

// Process image
const result = await worker.recognize(imageData);

// Terminate worker
await worker.terminate();
```

### Memory Management
- **Worker Cleanup**: Terminate worker setelah selesai
- **Image Compression**: Compress gambar sebelum OCR
- **Progress Tracking**: Real-time progress untuk UX
- **Error Recovery**: Robust error handling

## Browser Compatibility

### Supported Browsers
- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support

### Mobile Support
- **iOS Safari**: ✅ OCR processing
- **Android Chrome**: ✅ OCR processing
- **Mobile Firefox**: ✅ OCR processing

## Accuracy Optimization

### Image Quality Requirements
- **Resolution**: Minimum 1280x720
- **Lighting**: Pencahayaan yang cukup
- **Focus**: KTP harus fokus dan jelas
- **Angle**: KTP harus tegak lurus
- **Distance**: Jarak optimal 15-20 cm

### OCR Settings
```javascript
const worker = await createWorker('ind', 1, {
    logger: m => {
        if (m.status === 'recognizing text') {
            setScanProgress(Math.round(m.progress * 100));
        }
    }
});
```

## Testing Data

### Sample KTP Data
```javascript
const sampleKTPData = {
    name: 'RELINGGA ADITYA',
    nik: '3201234567890123',
    birthDate: '15-08-1995',
    address: 'Jl. Contoh Alamat No. 123, Jakarta',
    gender: 'Laki-laki',
    religion: 'Islam'
};
```

### Test Scenarios
1. **Clear KTP**: KTP dalam kondisi baik
2. **Blurry Image**: KTP tidak fokus
3. **Poor Lighting**: Pencahayaan buruk
4. **Angled KTP**: KTP tidak tegak lurus
5. **Damaged KTP**: KTP rusak atau terlipat
6. **Different Formats**: Berbagai format KTP

## Security & Privacy

### Data Protection
- **Local Processing**: OCR diproses di browser
- **No Upload**: Gambar tidak diupload ke server
- **Temporary Storage**: Data hanya disimpan sementara
- **User Control**: User dapat membatalkan kapan saja

### Privacy Considerations
- **Data Minimization**: Hanya ekstrak data yang diperlukan
- **No Persistence**: Data tidak disimpan permanen
- **User Consent**: Explicit consent untuk processing
- **Data Accuracy**: User dapat review dan edit data

## Future Enhancements

### Advanced OCR Features
1. **Multiple Languages**: Support bahasa daerah
2. **Handwriting Recognition**: OCR tulisan tangan
3. **Image Enhancement**: Auto brightness/contrast
4. **Batch Processing**: Multiple KTP scanning

### Integration Options
1. **Cloud OCR**: Google Vision API, Azure Computer Vision
2. **Hybrid Processing**: Local + cloud processing
3. **Offline Support**: Cache OCR models
4. **Real-time Processing**: Live OCR dengan kamera

### Performance Improvements
1. **Web Workers**: Background processing
2. **Image Preprocessing**: Enhance image sebelum OCR
3. **Caching**: Cache OCR results
4. **Progressive Loading**: Load OCR models progressively

## Deployment Notes

### Dependencies
```json
{
  "dependencies": {
    "tesseract.js": "^4.1.1"
  }
}
```

### Bundle Size
- **Tesseract.js**: ~2MB (compressed)
- **Indonesian Model**: ~10MB
- **Total Impact**: ~12MB untuk OCR functionality

### Performance Impact
- **Initial Load**: ~2-3 detik untuk load model
- **OCR Processing**: ~3-5 detik per gambar
- **Memory Usage**: ~50-100MB selama processing
- **CPU Usage**: High selama OCR processing

## Troubleshooting

### Common Issues
1. **Model Loading Failed**: Check internet connection
2. **OCR Accuracy Low**: Improve image quality
3. **NIK Not Detected**: Check NIK format dan visibility
4. **Performance Slow**: Reduce image size atau quality

### Debug Information
```javascript
// Enable debug logging
console.log('OCR Text:', ocrText);
console.log('Extracted Data:', extractedData);
console.log('NIK Validation:', validateNIK(nik));
```

### Error Recovery
- **Retry OCR**: Process gambar ulang
- **Manual Input**: Fallback ke input manual
- **Image Enhancement**: Improve image quality
- **Different Angle**: Capture dari angle berbeda
