import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { SiteSettingsProvider } from './context/SiteSettingsContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteSettingsProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </WishlistProvider>
      </CartProvider>
    </SiteSettingsProvider>
  </StrictMode>,
)
