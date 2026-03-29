import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Shipping from './pages/Shipping';
import Admin from './pages/Admin';
import Login from './pages/Login';
import UserLogin from './pages/UserLogin';
// New Imports for Footer Pages
import NewArrivals from './pages/NewArrivals';
import ShippingInfo from './pages/ShippingInfo';
import Returns from './pages/Returns';
import AllHoodies from './pages/AllHoodies'; // Import the new separate page

export default function App() {
  const ProtectedCheckout = ({ children }) => {
    const isUser = localStorage.getItem('userEmail');
    return isUser ? children : <Navigate to="/user-login" />;
  };

  return (
    <CartProvider>
      <BrowserRouter>
        <div className="app-wrapper" style={{ 
          minHeight: '100vh', 
          backgroundColor: '#000', 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          
          <Navbar />

          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/all-hoodies" element={<AllHoodies />} />
              <Route path="/user-login" element={<UserLogin />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/shipping-info" element={<ShippingInfo />} />
              <Route path="/returns" element={<Returns />} />
              
              <Route path="/checkout" element={<Checkout />} />

              <Route 
                path="/shipping" 
                element={
                  <ProtectedCheckout>
                    <Shipping />
                  </ProtectedCheckout>
                } 
              />

              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          <Footer />

        </div>
      </BrowserRouter>
    </CartProvider>
  );
}