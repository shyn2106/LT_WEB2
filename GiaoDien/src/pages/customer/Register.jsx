import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      setLoading(false);
      return;
    }

    fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200) {
        setSuccess('Đăng ký thành công! Đang chuyển hướng...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else if (status === 400) {
        if (body.message) {
          setError(body.message); // Lỗi username is already taken
        } else {
          setFieldErrors(body); // Lỗi validation từ @Valid
        }
      } else {
        setError('Đăng ký thất bại!');
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
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-sm border border-gray-100 mt-12 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-[#0f1c2e] mb-2">Tạo Tài Khoản</h2>
          <p className="text-gray-500 text-sm">Gia nhập đặc quyền hội viên Lumière Grand</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-sm text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-sm text-sm mb-6 border border-green-100">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
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
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Mật khẩu</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-sm py-3 px-4 text-sm focus:outline-none focus:border-[#8b6e45] ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'}`} 
            />
            {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Xác nhận mật khẩu</label>
            <input 
              type="password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-sm py-3 px-4 text-sm focus:outline-none focus:border-[#8b6e45]" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0f1c2e] text-white py-3 mt-4 text-sm font-bold tracking-wider hover:bg-[#8b6e45] transition-colors rounded-sm disabled:opacity-50"
          >
            {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-[#0f1c2e] hover:text-[#8b6e45] hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
