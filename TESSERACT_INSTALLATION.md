# Tesseract.js Installation Guide

## Overview
Panduan instalasi Tesseract.js untuk fitur OCR KTP scanning dalam aplikasi Laravel + React.

## Installation

### 1. Install Tesseract.js Package
```bash
npm install tesseract.js
```

### 2. Verify Installation
```bash
npm list tesseract.js
```

**Expected Output:**
```
hacksphere-2025@ D:\hacksphere-2025
└── tesseract.js@6.0.1
```

## Package Information

### Version Details
- **Package**: tesseract.js
- **Version**: 6.0.1
- **Size**: ~2MB (compressed)
- **Dependencies**: 79 packages added

### Features Included
- ✅ Client-side OCR processing
- ✅ Indonesian language support ('ind')
- ✅ Web Worker support
- ✅ Progress tracking
- ✅ Error handling
- ✅ Memory management

## Usage in Components

### Import Statement
```javascript
import { createWorker } from 'tesseract.js';
```

### Basic Usage
```javascript
const worker = await createWorker('ind', 1, {
    logger: m => {
        if (m.status === 'recognizing text') {
            setScanProgress(Math.round(m.progress * 100));
        }
    }
});

const { data: { text } } = await worker.recognize(imageData);
await worker.terminate();
```

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

## Performance Considerations

### Bundle Size Impact
- **Tesseract.js Core**: ~2MB
- **Indonesian Model**: ~10MB (downloaded on first use)
- **Total Impact**: ~12MB for OCR functionality

### Memory Usage
- **Initial Load**: ~50MB
- **During OCR**: ~100-150MB
- **After Cleanup**: ~50MB

### Processing Time
- **Model Loading**: 2-3 detik (first time)
- **OCR Processing**: 3-5 detik per gambar
- **Total Time**: 5-8 detik end-to-end

## Troubleshooting

### Common Issues

#### 1. Import Error
**Error**: `Failed to resolve import "tesseract.js"`
**Solution**: 
```bash
npm install tesseract.js
```

#### 2. Model Loading Failed
**Error**: Model tidak bisa di-download
**Solution**: 
- Check internet connection
- Clear browser cache
- Try different network

#### 3. Memory Issues
**Error**: Browser crash atau slow
**Solution**:
- Close other browser tabs
- Restart browser
- Use smaller images

### Debug Information
```javascript
// Enable debug logging
console.log('Tesseract worker created');
console.log('OCR processing started');
console.log('OCR result:', text);
```

## Development Notes

### Hot Reload
- Tesseract.js supports Vite hot reload
- Changes to OCR code will reload automatically
- Model files are cached by browser

### Development vs Production
- **Development**: Models downloaded on demand
- **Production**: Consider pre-loading models
- **CDN**: Can use CDN for faster loading

## Next Steps

### Testing
1. Open application in browser
2. Navigate to train booking page
3. Click "Detail Kereta" on any train
4. Click on subclass to open booking modal
5. Click "Scan KTP" button
6. Test camera access and OCR functionality

### Monitoring
- Monitor console for OCR logs
- Check network tab for model downloads
- Monitor memory usage during processing
- Test on different devices and browsers

## Security Notes

### Data Privacy
- OCR processing happens locally in browser
- No images uploaded to server
- Data only stored temporarily
- User has full control over data

### Permissions
- Camera access required
- Internet access for model download
- Local storage for model caching
- No additional permissions needed

## Support

### Documentation
- [Tesseract.js Official Docs](https://tesseract.projectnaptha.com/)
- [GitHub Repository](https://github.com/naptha/tesseract.js)
- [API Reference](https://tesseract.projectnaptha.com/api.html)

### Community
- GitHub Issues for bug reports
- Stack Overflow for questions
- Discord community for support
