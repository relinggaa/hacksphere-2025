# Panduan Troubleshooting OCR KTP

## Masalah: "Gagal memproses gambar KTP"

### 🔍 **Kemungkinan Penyebab:**

#### 1. **Masalah Koneksi Internet**
- **Gejala**: Error saat membuat Tesseract worker
- **Penyebab**: Model OCR tidak bisa di-download
- **Solusi**: 
  - Pastikan koneksi internet stabil
  - Coba lagi setelah beberapa saat
  - Gunakan jaringan yang lebih cepat

#### 2. **Kualitas Gambar Buruk**
- **Gejala**: OCR berjalan tapi tidak menemukan NIK
- **Penyebab**: Gambar KTP tidak jelas atau blur
- **Solusi**:
  - Pastikan KTP dalam kondisi baik
  - Atur pencahayaan yang cukup (tidak terlalu terang/silau)
  - Jaga jarak kamera 15-20 cm dari KTP
  - Pastikan seluruh KTP terlihat dalam frame

#### 3. **Model OCR Tidak Tersedia**
- **Gejala**: Error "Gagal membuat OCR worker"
- **Penyebab**: Model bahasa Indonesia tidak tersedia
- **Solusi**: 
  - Sistem akan otomatis fallback ke bahasa Inggris
  - Tunggu proses loading model selesai
  - Refresh halaman jika masih gagal

#### 4. **Browser Compatibility**
- **Gejala**: Error JavaScript atau camera tidak bisa diakses
- **Penyebab**: Browser tidak mendukung WebRTC atau Tesseract.js
- **Solusi**:
  - Gunakan browser modern (Chrome, Firefox, Safari, Edge)
  - Update browser ke versi terbaru
  - Enable JavaScript dan camera permissions

### 🛠️ **Langkah Troubleshooting:**

#### **Step 1: Check Console Logs**
```javascript
// Buka Developer Tools (F12)
// Lihat tab Console untuk error messages:
// - "Starting OCR processing..."
// - "Tesseract worker created successfully"
// - "OCR completed. Raw text length: X"
// - "Extracted data: {...}"
```

#### **Step 2: Verify Camera Access**
```javascript
// Pastikan camera permission sudah diberikan
// Check di browser settings:
// Chrome: Settings > Privacy > Camera
// Firefox: Settings > Privacy > Permissions > Camera
```

#### **Step 3: Test Image Quality**
- Ambil foto KTP dengan pencahayaan yang baik
- Pastikan KTP tidak terlipat atau rusak
- Hindari silau atau bayangan
- Pastikan teks KTP terlihat jelas

#### **Step 4: Check Network Connection**
- Pastikan koneksi internet stabil
- Model OCR (~10MB) perlu di-download pertama kali
- Tunggu proses loading selesai

### 📱 **Tips untuk Hasil Terbaik:**

#### **Pencahayaan Optimal:**
- Gunakan pencahayaan natural (siang hari)
- Hindari lampu yang terlalu terang atau silau
- Pastikan tidak ada bayangan pada KTP
- Gunakan flash jika diperlukan

#### **Posisi KTP:**
- Letakkan KTP pada permukaan datar
- Pastikan KTP tidak terlipat atau rusak
- Posisikan KTP tegak lurus dengan kamera
- Jaga jarak 15-20 cm dari kamera

#### **Frame KTP:**
- Pastikan seluruh KTP terlihat dalam frame
- Hindari memotong bagian penting KTP
- Gunakan overlay frame sebagai panduan
- Pastikan KTP tidak miring

### 🔧 **Debug Information:**

#### **Console Logs yang Harus Muncul:**
```javascript
// 1. Camera access
"Starting camera access..."

// 2. Photo capture
"Photo captured, dimensions: 1280 x 720"

// 3. OCR processing
"Starting OCR processing..."
"Image data length: 123456"
"Tesseract worker created successfully"
"Indonesian model loaded successfully" // atau "English model loaded successfully"

// 4. OCR completion
"OCR completed. Raw text length: 150"
"Raw OCR text: [extracted text]"

// 5. Data extraction
"Extracted data: {name: '...', nik: '...', ...}"

// 6. Success or failure
"Successfully extracted KTP data: {...}" // atau
"NIK not found in OCR text: [text]"
```

#### **Error Messages yang Mungkin Muncul:**
```javascript
// Network issues
"Gagal mengunduh model OCR. Periksa koneksi internet dan coba lagi."

// Worker issues
"Gagal membuat OCR worker. Pastikan koneksi internet stabil dan coba lagi."

// Image issues
"Gagal memproses gambar. Pastikan gambar KTP jelas dan coba lagi."

// NIK not found
"NIK tidak ditemukan dalam gambar. Pastikan KTP terlihat jelas, pencahayaan cukup, dan coba lagi."
```

### 🎯 **Solusi Berdasarkan Error:**

#### **Error: "Gagal membuat OCR worker"**
1. Check koneksi internet
2. Refresh halaman
3. Clear browser cache
4. Coba browser lain

#### **Error: "NIK tidak ditemukan dalam gambar"**
1. Perbaiki pencahayaan
2. Pastikan KTP jelas dan tidak blur
3. Coba angle yang berbeda
4. Pastikan seluruh KTP terlihat

#### **Error: "Gagal mengunduh model OCR"**
1. Check koneksi internet
2. Tunggu beberapa saat
3. Refresh halaman
4. Coba jaringan lain

#### **Error: "Akses kamera ditolak"**
1. Allow camera permission di browser
2. Refresh halaman
3. Check browser settings
4. Coba browser lain

### 📊 **Performance Expectations:**

#### **First Time Use:**
- Model download: 2-5 detik
- OCR processing: 3-8 detik
- Total time: 5-13 detik

#### **Subsequent Uses:**
- Model cached: Instant
- OCR processing: 3-8 detik
- Total time: 3-8 detik

#### **Success Rate:**
- Clear KTP: 85-95%
- Blurry KTP: 30-50%
- Poor lighting: 20-40%
- Damaged KTP: 10-30%

### 🚀 **Best Practices:**

#### **Untuk Developer:**
1. Monitor console logs untuk debugging
2. Test dengan berbagai kondisi KTP
3. Implement fallback mechanisms
4. Provide clear error messages

#### **Untuk User:**
1. Gunakan pencahayaan yang baik
2. Pastikan KTP dalam kondisi baik
3. Jaga jarak optimal dari kamera
4. Tunggu proses OCR selesai

### 📞 **Jika Masih Bermasalah:**

1. **Check Browser Console** untuk error details
2. **Test dengan KTP lain** untuk memastikan bukan masalah KTP
3. **Coba browser lain** untuk memastikan bukan masalah browser
4. **Restart aplikasi** jika ada masalah memory
5. **Contact support** dengan detail error yang muncul

### 🔄 **Recovery Steps:**

1. **Refresh halaman** untuk reset state
2. **Clear browser cache** untuk fresh start
3. **Restart browser** jika ada masalah memory
4. **Check internet connection** untuk model download
5. **Try different device** untuk testing
