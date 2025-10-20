import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

async function enableMocking() {
  // We remove the development-only check so that MSW
  // can run in the "preview" environment as well.
  // This allows us to test the production build locally with mock data.
  
  const { worker } = await import('./mocks/browser.tsx')
 
  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is ready.
  return worker.start({
    // Add this onUnhandledRequest option to prevent console warnings
    // about unhandled requests (like for fonts or other assets).
    onUnhandledRequest: 'bypass',
  })
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>,
  )
})
