import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRequestOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    fetch('https://ltweb2-production.up.railway.app/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200) {
        setSuccessMsg(body.message || 'Mã OTP đã được gửi đến email của bạn!');
        setStep(2);
      } else {
        setError(body.message || 'Có lỗi xảy ra!');
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

  const handleResetPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      setLoading(false);
      return;
    }

    fetch('https://ltweb2-production.up.railway.app/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, otp, newPassword })
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200) {
        setSuccessMsg('Đặt lại mật khẩu thành công! Chuyển hướng tới trang Đăng nhập...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(body.message || 'OTP không hợp lệ hoặc đã hết hạn!');
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
          <h2 className="text-3xl font-serif font-bold text-[#0f1c2e] mb-2">Khôi Phục Mật Khẩu</h2>
          <p className="text-gray-500 text-sm">Nhập email để nhận mã xác thực (OTP)</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-sm text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}
        
        {successMsg && (
          <div className="bg-green-50 text-green-600 p-3 rounded-sm text-sm mb-6 border border-green-100">
            {successMsg}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email của bạn</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full border border-gray-300 rounded-sm py-3 px-4 text-sm focus:outline-none focus:border-[#8b6e45]" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#0f1c2e] text-white py-3 text-sm font-bold tracking-wider hover:bg-[#8b6e45] transition-colors rounded-sm disabled:opacity-50"
            >
              {loading ? 'ĐANG XỬ LÝ...' : 'GỬI MÃ OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Mã OTP (6 số)</label>
              <input 
                type="text" 
                required 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Nhập mã OTP trong email"
                className="w-full border border-gray-300 rounded-sm py-3 px-4 text-sm tracking-widest text-center font-bold focus:outline-none focus:border-[#8b6e45]" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Mật khẩu mới</label>
              <input 
                type="password" 
                required 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                className="w-full border border-gray-300 rounded-sm py-3 px-4 text-sm focus:outline-none focus:border-[#8b6e45]" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#0f1c2e] text-white py-3 text-sm font-bold tracking-wider hover:bg-[#8b6e45] transition-colors rounded-sm disabled:opacity-50"
            >
              {loading ? 'ĐANG XỬ LÝ...' : 'ĐẶT LẠI MẬT KHẨU'}
            </button>
            
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full bg-transparent text-[#8b6e45] py-2 text-sm font-bold hover:underline"
            >
              Gửi lại OTP
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <Link to="/login" className="font-bold text-[#0f1c2e] hover:text-[#8b6e45] hover:underline">
            Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
