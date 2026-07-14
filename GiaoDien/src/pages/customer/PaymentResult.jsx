import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Lấy query string từ URL (VD: ?vnp_Amount=...&vnp_ResponseCode=00...)
    const queryParams = location.search;
    if (!queryParams) {
      setStatus('error');
      setMessage('Không tìm thấy thông tin thanh toán.');
      return;
    }

    // Gọi API backend để verify chữ ký VNPAY
    fetch(`https://ltweb2-production.up.railway.app/api/payment/vnpay_return${queryParams}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setStatus('success');
        } else {
          setStatus('failed');
          setMessage(data.message || 'Thanh toán thất bại hoặc đã bị hủy.');
        }
      })
      .catch(err => {
        console.error(err);
        setStatus('error');
        setMessage('Lỗi kết nối đến máy chủ. Vui lòng liên hệ bộ phận hỗ trợ.');
      });
  }, [location.search]);

  return (
    <div className="flex flex-col justify-center items-center h-[70vh] text-center px-4">
      {status === 'processing' && (
        <>
          <div className="w-16 h-16 border-4 border-[#8b6e45] border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-serif font-bold text-[#0f1c2e] mb-2">Đang xử lý thanh toán...</h2>
          <p className="text-gray-500">Vui lòng không đóng trình duyệt lúc này.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <span className="material-symbols-outlined text-6xl text-green-500 mb-4">check_circle</span>
          <h2 className="text-3xl font-serif font-bold text-[#0f1c2e] mb-2">Thanh toán thành công!</h2>
          <p className="text-gray-500 mb-8">Đơn đặt phòng của bạn đã được xác nhận và thanh toán qua VNPAY.</p>
          <button onClick={() => navigate('/')} className="bg-[#8b6e45] text-white px-8 py-3 text-sm font-semibold rounded-sm hover:bg-[#735936] transition-colors">Trở về trang chủ</button>
        </>
      )}

      {(status === 'failed' || status === 'error') && (
        <>
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
          <h2 className="text-3xl font-serif font-bold text-[#0f1c2e] mb-2">Thanh toán không thành công</h2>
          <p className="text-gray-500 mb-8">{message}</p>
          <div className="space-x-4">
            <button onClick={() => navigate(-1)} className="bg-white border border-[#0f1c2e] text-[#0f1c2e] px-8 py-3 text-sm font-semibold rounded-sm hover:bg-gray-50 transition-colors">Thử lại</button>
            <button onClick={() => navigate('/')} className="bg-[#8b6e45] text-white px-8 py-3 text-sm font-semibold rounded-sm hover:bg-[#735936] transition-colors">Về trang chủ</button>
          </div>
        </>
      )}
    </div>
  );
}
