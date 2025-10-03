import React from 'react'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'

// Configure axios base URL safely for simulator and browser
const getOriginSafely = () => {
  try {
    if (typeof window !== 'undefined' && window.location) {
      const origin = window.location.origin
      if (typeof origin === 'string' && origin !== 'null' && origin !== 'undefined' && origin.includes('//')) {
        return origin
      }
    }
  } catch (e) {
    console.log('Error getting origin:', e)
  }
  
  // For simulator environments, check common simulator host patterns
  try {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      const hostname = window.location.hostname
      if (hostname.includes('localhost') || hostname.includes('127.0.0.1') || !hostname.includes('.')) {
        return 'http://localhost:8000'
      }
    }
  } catch (e) {
    console.log('Error checking hostname:', e)
  }
  
  // Default fallback
  return 'http://localhost:8000'
}

const baseURL = getOriginSafely()
console.log('Axios baseURL set to:', baseURL)
axios.defaults.baseURL = baseURL
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Request interceptor with safe URL handling
axios.interceptors.request.use(
  (config) => {
    // Ensure URL is properly constructed and safe
    try {
      if (config.url && typeof config.url === 'string') {
        // Skip URL construction if it's already absolute
        if (!config.url.startsWith('http')) {
          // Use configured baseURL or fallback
          const safeBaseURL = axios.defaults.baseURL || 'http://localhost:8000'
          config.url = safeBaseURL + config.url
        }
        console.log('Request URL:', config.url)
      }
    } catch (error) {
      console.error('Error constructing URL:', error)
    }
    return config
  },
  (error) => {
    console.error('Axios request error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios response error:', error)
    return Promise.reject(error)
  }
)

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[`./Pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})