import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200) {
        localStorage.setItem('user', JSON.stringify(body));
        window.dispatchEvent(new Event('authChange')); // Trigger header update
        navigate('/');
      } else if (status === 400) {
        setFieldErrors(body); // Lỗi validation từ @Valid
      } else {
        setError('Sai tên đăng nhập hoặc mật khẩu!');
      }
    })
    .catch(err => {
      console.error(err);
      setError('Lỗi kết nối tới máy chủ!');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-[#0f1c2e] mb-2">Đăng Nhập</h2>
          <p className="text-gray-500 text-sm">Chào mừng bạn trở lại với Lumière Grand</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-sm text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Tên đăng nhập</label>
            <input 
              type="text" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full border rounded-sm py-3 px-4 text-sm focus:outline-none focus:border-[#8b6e45] ${fieldErrors.username ? 'border-red-500' : 'border-gray-300'}`} 
            />
            {fieldErrors.username && <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Mật khẩu</label>
              <a href="#" className="text-xs text-[#8b6e45] hover:underline">Quên mật khẩu?</a>
            </div>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-sm py-3 px-4 text-sm focus:outline-none focus:border-[#8b6e45] ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'}`} 
            />
            {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0f1c2e] text-white py-3 text-sm font-bold tracking-wider hover:bg-[#8b6e45] transition-colors rounded-sm disabled:opacity-50"
          >
            {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-bold text-[#0f1c2e] hover:text-[#8b6e45] hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
