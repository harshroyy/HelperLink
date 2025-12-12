import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import logo2 from '../assets/logo2.png'; 

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State for Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setTimeout(() => setIsRegisterOpen(true), 200);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setTimeout(() => setIsLoginOpen(true), 200);
  };

  return (
    <>
      {/* --- MODALS --- */}
      {!user && (
        <>
          <LoginModal 
            isOpen={isLoginOpen} 
            onClose={() => setIsLoginOpen(false)} 
            onSwitchToRegister={switchToRegister} 
          />
          <RegisterModal 
            isOpen={isRegisterOpen} 
            onClose={() => setIsRegisterOpen(false)} 
            onSwitchToLogin={switchToLogin}
          />
        </>
      )}

      {/* --- NAVIGATION BAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/50 border-b border-white/20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3">
              <div className="h-12 w-auto flex items-center justify-center">
                <img
                  src={logo2}
                  alt="Reach Logo"
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              
              {user ? (
                // --- VIEW FOR LOGGED IN USERS ---
                <>
                  <Link 
                    to="/dashboard" 
                    className="hidden md:block text-gray-600 hover:text-[#747def] font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  
                  {/* Divider */}
                  <div className="hidden md:block h-6 w-px bg-gray-300 mx-2"></div>
                  
                  {/* Name Link */}
                  <Link 
                    to="/profile" 
                    className="text-[#747def] font-bold hover:text-[#747def] transition-colors hidden sm:block"
                  >
                  {user.name.split(' ')[0]}
                  </Link>

                  {/* --- NEW: PROFILE CIRCLE --- */}
                  <Link 
                    to="/profile" 
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 ml-1 hover:scale-105 transition-transform"
                  >
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#747def] font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                  {/* --------------------------- */}

                  <button 
                    onClick={handleLogout}
                    className="px-5 py-2 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-all font-medium text-sm ml-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // --- VIEW FOR GUESTS ---
                <>
                  <button 
                    onClick={() => setIsLoginOpen(true)}
                    className="hidden md:block px-6 py-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-white/50 transition-all duration-200 font-medium"
                  >
                    Login
                  </button>
                  
                  <button 
                    onClick={() => setIsRegisterOpen(true)}
                    className="px-6 py-2 rounded-full bg-[#747def] text-white hover:bg-[#5e63c2] transition-all duration-200 shadow-lg shadow-blue-600/25 font-medium"
                  >
                    Register
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;