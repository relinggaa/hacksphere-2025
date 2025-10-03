import React from 'react'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'

// Configure axios base URL safely for simulator and browser
const getOriginSafely = () => {
  try {
    if (typeof window !== 'undefined' && window.location && /^https?:\/\//.test(window.location.origin)) {
      return window.location.origin
    }
  } catch (e) {}
  return ''
}
const baseURL = getOriginSafely()
axios.defaults.baseURL = baseURL
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Keep a lightweight interceptor for logging only
axios.interceptors.request.use(
  (config) => config,
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