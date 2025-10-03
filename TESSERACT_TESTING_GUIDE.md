# Panduan Testing Tesseract.js OCR untuk KTP

## Overview
Panduan lengkap untuk testing fitur OCR Tesseract.js dalam aplikasi scan KTP.

## Setup Testing

### 1. Prerequisites
- Browser modern (Chrome, Firefox, Safari, Edge)
- Akses kamera (untuk testing real)
- Koneksi internet (untuk download model OCR)
- KTP fisik untuk testing

### 2. Testing Environment
```bash
# Pastikan aplikasi berjalan
npm run dev

# Akses aplikasi di browser
http://localhost:8000/public/jadwal-kereta
```

## Testing Scenarios

### Scenario 1: Happy Path Testing
**Objective**: Test OCR berhasil mengekstrak NIK dari KTP yang jelas

**Steps**:
1. Buka aplikasi di browser
2. Pilih kereta dan klik "Detail Kereta"
3. Klik pada subkelas kereta
4. Klik "Scan KTP" di form booking
5. Klik "Mulai Scan" di modal scanner
6. Izinkan akses kamera
7. Posisikan KTP dalam frame overlay
8. Klik tombol capture (bulat biru)
9. Tunggu proses OCR selesai
10. Review hasil di modal "Hasil Scan KTP"
11. Klik "Gunakan Data" untuk konfirmasi

**Expected Result**:
- OCR berhasil mengekstrak NIK 16 digit
- Nama lengkap terdeteksi
- Data otomatis mengisi form booking
- Modal scanner tertutup

### Scenario 2: Error Handling Testing
**Objective**: Test error handling ketika OCR gagal

**Steps**:
1. Lakukan scan dengan KTP yang blur/tidak jelas
2. Atau scan dengan objek bukan KTP
3. Tunggu proses OCR selesai

**Expected Result**:
- Error message: "NIK tidak ditemukan dalam gambar"
- Tombol "Coba Lagi" tersedia
- User dapat scan ulang

### Scenario 3: Camera Permission Testing
**Objective**: Test handling ketika user menolak akses kamera

**Steps**:
1. Klik "Mulai Scan"
2. Ketika browser minta permission, klik "Block" atau "Deny"
3. Lihat error message yang muncul

**Expected Result**:
- Error message: "Akses kamera ditolak. Silakan izinkan akses kamera untuk melanjutkan."
- Tombol "Coba Lagi" tersedia

### Scenario 4: NIK Validation Testing
**Objective**: Test validasi format NIK

**Steps**:
1. Scan KTP dengan NIK yang valid
2. Test dengan NIK yang tidak valid (jika ada)

**Expected Result**:
- NIK valid: Data diterima dan form terisi
- NIK tidak valid: Error message atau fallback data

## Testing Data

### Sample KTP Data untuk Testing
```javascript
// Data yang diharapkan dari OCR
const expectedKTPData = {
    name: 'RELINGGA ADITYA',
    nik: '3201234567890123',
    birthDate: '15-08-1995',
    address: 'Jl. Contoh Alamat No. 123, Jakarta',
    gender: 'Laki-laki',
    religion: 'Islam'
};
```

### Test Cases untuk NIK Validation
```javascript
// Valid NIK examples
const validNIKs = [
    '3201234567890123', // Jawa Barat, Bogor
    '3171034567890123', // Jakarta Pusat
    '1271034567890123', // Sumatera Utara, Medan
    '5171034567890123', // Bali, Denpasar
];

// Invalid NIK examples
const invalidNIKs = [
    '123456789012345', // 15 digits (too short)
    '12345678901234567', // 17 digits (too long)
    '123456789012345a', // Contains letter
    '0000000000000000', // All zeros
    '9999999999999999', // Invalid province code
];
```

## Performance Testing

### OCR Processing Time
**Expected Performance**:
- Model loading: 2-3 detik (first time)
- OCR processing: 3-5 detik per gambar
- Total time: 5-8 detik end-to-end

**Testing Method**:
1. Measure time dari capture sampai hasil OCR
2. Test dengan berbagai ukuran gambar
3. Monitor memory usage selama processing

### Memory Usage
**Expected Memory**:
- Initial: ~50MB
- During OCR: ~100-150MB
- After cleanup: ~50MB

**Testing Method**:
1. Open browser DevTools
2. Monitor Memory tab
3. Perform OCR scan
4. Check memory usage pattern

## Browser Compatibility Testing

### Desktop Browsers
| **Browser** | **Version** | **Camera Access** | **OCR Performance** |
|-------------|-------------|-------------------|---------------------|
| Chrome | 90+ | ✅ | Excellent |
| Firefox | 88+ | ✅ | Good |
| Safari | 14+ | ✅ | Good |
| Edge | 90+ | ✅ | Excellent |

### Mobile Browsers
| **Browser** | **Camera Access** | **OCR Performance** |
|-------------|-------------------|---------------------|
| iOS Safari | ✅ | Good |
| Android Chrome | ✅ | Excellent |
| Mobile Firefox | ✅ | Good |

## Debug Information

### Console Logs
```javascript
// Enable debug logging
console.log('OCR Text:', ocrText);
console.log('Extracted Data:', extractedData);
console.log('NIK Validation:', validateNIK(nik));
console.log('Processing Time:', processingTime);
```

### Common Debug Messages
- `"OCR Text: [extracted text]"` - Raw OCR output
- `"Successfully extracted KTP data: [data]"` - Successful extraction
- `"NIK not found in OCR text: [text]"` - NIK extraction failed
- `"OCR processing error: [error]"` - OCR processing failed

## Troubleshooting

### Common Issues dan Solutions

#### 1. OCR Accuracy Low
**Symptoms**: NIK tidak terdeteksi atau salah
**Solutions**:
- Pastikan KTP dalam kondisi baik
- Perbaiki pencahayaan
- Pastikan KTP tegak lurus dengan kamera
- Jaga jarak optimal 15-20 cm

#### 2. Camera Access Denied
**Symptoms**: Error "Akses kamera ditolak"
**Solutions**:
- Check browser permissions
- Restart browser
- Clear browser cache
- Try different browser

#### 3. OCR Processing Slow
**Symptoms**: Processing lebih dari 10 detik
**Solutions**:
- Check internet connection
- Reduce image size
- Close other browser tabs
- Restart browser

#### 4. Model Loading Failed
**Symptoms**: Error saat load Tesseract model
**Solutions**:
- Check internet connection
- Clear browser cache
- Try different network
- Wait and retry

## Testing Checklist

### Pre-Testing Setup
- [ ] Browser updated to latest version
- [ ] Camera access granted
- [ ] Internet connection stable
- [ ] KTP ready for testing
- [ ] DevTools open for debugging

### Functional Testing
- [ ] Camera opens successfully
- [ ] Photo capture works
- [ ] OCR processing completes
- [ ] NIK extraction works
- [ ] Data validation passes
- [ ] Form auto-fill works
- [ ] Error handling works

### Performance Testing
- [ ] OCR processing time < 10 seconds
- [ ] Memory usage reasonable
- [ ] No memory leaks
- [ ] Smooth UI animations
- [ ] Progress indicators work

### Error Handling Testing
- [ ] Camera permission denied
- [ ] Poor image quality
- [ ] No NIK detected
- [ ] Invalid NIK format
- [ ] Network issues
- [ ] Browser compatibility

### User Experience Testing
- [ ] Clear instructions
- [ ] Intuitive UI flow
- [ ] Proper error messages
- [ ] Smooth transitions
- [ ] Responsive design
- [ ] Accessibility features

## Success Criteria

### Functional Requirements
- ✅ OCR successfully extracts NIK from clear KTP images
- ✅ NIK validation works correctly
- ✅ Form auto-fill functions properly
- ✅ Error handling provides clear feedback
- ✅ Camera access works across browsers

### Performance Requirements
- ✅ OCR processing completes within 10 seconds
- ✅ Memory usage stays under 200MB
- ✅ UI remains responsive during processing
- ✅ No memory leaks after cleanup

### User Experience Requirements
- ✅ Clear visual feedback during processing
- ✅ Intuitive user flow
- ✅ Helpful error messages
- ✅ Easy retry mechanism
- ✅ Professional UI design

## Reporting Issues

### Bug Report Template
```
Title: [Brief description]
Browser: [Browser and version]
OS: [Operating system]
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Result: [What should happen]
Actual Result: [What actually happened]
Console Logs: [Any error messages]
Screenshot: [If applicable]
```

### Performance Report Template
```
Test Date: [Date]
Browser: [Browser and version]
Device: [Device specifications]
OCR Processing Time: [Time in seconds]
Memory Usage: [Peak memory in MB]
Success Rate: [Percentage]
Issues Found: [List of issues]
```
