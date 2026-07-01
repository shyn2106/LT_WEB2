import React, { useState, useEffect } from 'react';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    const userStr = localStorage.getItem('user');
    const token = userStr ? (JSON.parse(userStr).token || JSON.parse(userStr).accessToken || '') : '';

    fetch('http://localhost:8080/api/bookings', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
      .then(res => res.json())
      .then(data => {
        // Sắp xếp ID giảm dần (mới nhất lên đầu)
        const sortedData = data.sort((a, b) => b.id - a.id);
        setBookings(sortedData);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = (id, newStatus) => {
    // Để gọi API PUT update status, cần gửi cả object Booking hoặc Backend cung cấp API riêng
    // Tạm thời ở đây chúng ta sửa cứng status (nếu Backend có hỗ trợ)
    // Lấy booking hiện tại
    const bookingToUpdate = bookings.find(b => b.id === id);
    if (!bookingToUpdate) return;
    
    const updatedBooking = { ...bookingToUpdate, status: newStatus };

    const userStr = localStorage.getItem('user');
    const token = userStr ? (JSON.parse(userStr).token || JSON.parse(userStr).accessToken || '') : '';

    fetch(`http://localhost:8080/api/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(updatedBooking)
    })
    .then(res => {
      if(res.ok) {
        alert("Cập nhật trạng thái thành công!");
        fetchBookings(); // Tải lại danh sách
      } else {
        alert("Lỗi cập nhật!");
      }
    })
    .catch(err => console.error(err));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-yellow-300">Chờ duyệt</span>;
      case 'CONFIRMED':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-blue-300">Đã xác nhận</span>;
      case 'COMPLETED':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-300">Hoàn thành</span>;
      case 'CANCELLED':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-red-300">Đã hủy</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-gray-300">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Quản lý Đơn đặt phòng</h2>
        <button onClick={fetchBookings} className="text-gray-500 hover:text-[#8b6e45] p-2 bg-gray-50 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-sm">refresh</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Mã Đơn</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Loại phòng</th>
              <th className="px-6 py-4">Ngày nhận/trả</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-8">Đang tải dữ liệu...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-8">Chưa có đơn đặt phòng nào.</td></tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="bg-white border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #BK-{b.id.toString().padStart(4, '0')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{b.user?.username || 'Khách Vãng Lai'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {b.room?.typeName || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{b.checkInDate}</div>
                    <div className="text-xs text-gray-400">đến {b.checkOutDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(b.status)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {b.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                          className="font-medium text-blue-600 hover:underline"
                        >Duyệt</button>
                        <button 
                          onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                          className="font-medium text-red-600 hover:underline"
                        >Hủy</button>
                      </>
                    )}
                    {b.status === 'CONFIRMED' && (
                      <button 
                        onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                        className="font-medium text-green-600 hover:underline"
                      >Hoàn thành</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
