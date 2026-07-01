import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { name: 'Tổng quan', path: '/admin', icon: 'dashboard' },
    { name: 'Quản lý Đặt phòng', path: '/admin/bookings', icon: 'receipt_long' },
    { name: 'Quản lý Phòng', path: '/admin/rooms', icon: 'meeting_room' },
    { name: 'Quản lý Dịch vụ', path: '/admin/services', icon: 'room_service' },
    { name: 'Quản lý Người dùng', path: '/admin/users', icon: 'group' }
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f1c2e] text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-serif font-bold text-[#ffdea5] tracking-wider">LUMIÈRE</h1>
          <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">Admin Portal</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                  isActive ? 'bg-[#8b6e45] text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors w-full px-4 py-2"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="font-medium text-sm">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shadow-sm">
          <div className="text-gray-500 font-medium">Hệ thống Quản trị Khách sạn</div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-[#8b6e45] relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#8b6e45] text-white rounded-full flex items-center justify-center font-bold text-sm">A</div>
              <span className="text-sm font-medium text-gray-700">Administrator</span>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
