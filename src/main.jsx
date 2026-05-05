import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ComplaintProvider } from './context/ComplaintContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ComplaintProvider>
      <App />
    </ComplaintProvider>
  </StrictMode>,
)
