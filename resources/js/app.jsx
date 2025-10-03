import React from 'react'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'

// Configure axios base URL
const baseURL = window.location?.origin || 'http://localhost:8000'
axios.defaults.baseURL = baseURL
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Add request interceptor to handle URL construction
axios.interceptors.request.use(
  (config) => {
    // Ensure URL is properly constructed
    if (config.url && !config.url.startsWith('http')) {
      // Ensure baseURL is valid
      if (config.baseURL && config.baseURL !== 'undefined') {
        config.url = config.baseURL + config.url
      } else {
        config.url = baseURL + config.url
      }
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