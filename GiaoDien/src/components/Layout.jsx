import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

export default function Layout() {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra xem có đang ở trang chủ không để đổi style header
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener('authChange', loadUser);
    
    return () => {
      window.removeEventListener('authChange', loadUser);
    };
  }, []);

  // Xử lý sự kiện scroll cho Sticky Header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  // Xác định class cho header dựa vào trạng thái scroll và trang hiện tại
  const headerClasses = `fixed w-full top-0 z-50 transition-all duration-300 ${
    isScrolled || !isHomePage
      ? 'bg-white shadow-md py-4 text-[#1a2b3c]' 
      : 'bg-transparent py-6 text-white'
  }`;

  const navLinkClasses = `text-sm font-medium tracking-wide transition-colors border-b-2 border-transparent hover:border-[#8b6e45] hover:text-[#8b6e45] pb-1 ${
    isScrolled || !isHomePage ? 'text-[#1a2b3c]' : 'text-white hover:text-gray-200'
  }`;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#fbf9f8] text-[#1a2b3c]">
      {/* Sticky Header */}
      <header className={headerClasses}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-serif font-bold tracking-widest hover:text-[#8b6e45] transition-colors">
            LUMIÈRE GRAND
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden xl:flex space-x-6">
            <Link to="/" className={navLinkClasses}>Home</Link>
            <Link to="/properties" className={navLinkClasses}>Rooms</Link>
            <Link to="/experiences" className={navLinkClasses}>Experiences</Link>
            <a href="#restaurant" className={navLinkClasses}>Restaurant</a>
            <a href="#spa" className={navLinkClasses}>Spa</a>
            <a href="#gallery" className={navLinkClasses}>Gallery</a>
            <Link to="/contact" className={navLinkClasses}>Contact</Link>
          </nav>

          {/* Actions (Desktop) */}
          <div className="hidden xl:flex items-center space-x-5 flex-shrink-0">
            <button className="hover:text-[#8b6e45] transition-colors">
              <FiSearch className="text-xl" />
            </button>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className={`text-sm font-bold hover:underline ${isScrolled || !isHomePage ? 'text-[#8b6e45]' : 'text-white'}`}>
                  {user.username}
                </Link>
                <button onClick={handleLogout} className="text-xs uppercase tracking-wider opacity-70 hover:opacity-100 hover:text-red-500 transition-colors whitespace-nowrap">
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-bold tracking-wider hover:text-[#8b6e45] transition-colors uppercase whitespace-nowrap">
                Login
              </Link>
            )}
            
            <Link to="/properties" className="bg-[#8b6e45] text-white px-5 py-2.5 text-sm font-bold tracking-widest hover:bg-[#725a37] transition-colors rounded-sm uppercase whitespace-nowrap">
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="xl:hidden text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 flex flex-col h-screen xl:hidden overflow-y-auto">
          <nav className="flex flex-col space-y-6 text-xl font-serif text-[#0f1c2e] mb-12">
            <Link to="/">Home</Link>
            <Link to="/properties">Rooms & Suites</Link>
            <Link to="/experiences">Experiences</Link>
            <a href="#restaurant">Restaurant & Bar</a>
            <a href="#spa">Wellness & Spa</a>
            <a href="#gallery">Gallery</a>
            <Link to="/contact">Contact Us</Link>
          </nav>
          
          <div className="mt-auto pb-12 space-y-6">
            {user ? (
              <div className="flex justify-between items-center border-t border-gray-200 pt-6">
                <Link to="/profile" className="font-bold text-[#8b6e45]">Hồ sơ: {user.username}</Link>
                <button onClick={handleLogout} className="text-red-500 font-bold uppercase text-sm">Đăng xuất</button>
              </div>
            ) : (
              <Link to="/login" className="block w-full text-center py-3 border border-[#0f1c2e] text-[#0f1c2e] font-bold tracking-widest uppercase">
                Login
              </Link>
            )}
            <Link to="/properties" className="block w-full text-center py-3 bg-[#8b6e45] text-white font-bold tracking-widest uppercase">
              Book Now
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-grow flex flex-col ${!isHomePage ? 'pt-28' : ''}`}>
        <Outlet />
      </main>

      {/* Mega Footer */}
      <footer className="bg-[#0f1c2e] text-white pt-20 pb-10 px-6 lg:px-12 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1: Brand */}
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold tracking-widest text-[#8b6e45]">LUMIÈRE</h2>
            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              Experience the pinnacle of luxury hospitality. A sanctuary of elegance, exceptional service, and timeless design in the heart of the city.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:bg-[#8b6e45] hover:border-[#8b6e45] hover:text-white transition-all">
                <FaFacebookF />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:bg-[#8b6e45] hover:border-[#8b6e45] hover:text-white transition-all">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:bg-[#8b6e45] hover:border-[#8b6e45] hover:text-white transition-all">
                <FaTiktok />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:bg-[#8b6e45] hover:border-[#8b6e45] hover:text-white transition-all">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4 text-sm text-gray-400 font-sans">
              <li><Link to="/about" className="hover:text-[#8b6e45] transition-colors">Our Story</Link></li>
              <li><Link to="/properties" className="hover:text-[#8b6e45] transition-colors">Rooms & Suites</Link></li>
              <li><a href="#spa" className="hover:text-[#8b6e45] transition-colors">Spa & Wellness</a></li>
              <li><a href="#restaurant" className="hover:text-[#8b6e45] transition-colors">Fine Dining</a></li>
              <li><Link to="/contact" className="hover:text-[#8b6e45] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-white">Contact Info</h3>
            <ul className="space-y-4 text-sm text-gray-400 font-sans">
              <li className="flex items-start">
                <span className="material-symbols-outlined text-[#8b6e45] mr-3 text-lg">location_on</span>
                <span>123 Luxury Boulevard, District 1,<br />Ho Chi Minh City, Vietnam</span>
              </li>
              <li className="flex items-center">
                <span className="material-symbols-outlined text-[#8b6e45] mr-3 text-lg">call</span>
                <span>+84 1900 123 456</span>
              </li>
              <li className="flex items-center">
                <span className="material-symbols-outlined text-[#8b6e45] mr-3 text-lg">mail</span>
                <span>reservations@lumieregrand.com</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-white">Newsletter</h3>
            <p className="text-sm text-gray-400 font-sans mb-4">Subscribe to receive exclusive offers and updates.</p>
            <div className="flex border-b border-gray-600 pb-2 focus-within:border-[#8b6e45] transition-colors">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-500 font-sans" 
              />
              <button className="text-[#8b6e45] font-bold text-lg hover:text-white transition-colors">→</button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 text-sm text-gray-500 font-sans flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} LUMIÈRE GRAND HOTEL. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
