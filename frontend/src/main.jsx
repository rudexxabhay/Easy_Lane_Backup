import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import NavigationEnhancements from './components/NavigationEnhancements.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavigationEnhancements />
    <App />
  </StrictMode>,
)
