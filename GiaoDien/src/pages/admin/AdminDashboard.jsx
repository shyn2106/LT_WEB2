import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    roomsAvailable: 0
  });
  
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const [pieData, setPieData] = useState({
    labels: [],
    datasets: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = userStr ? (JSON.parse(userStr).token || JSON.parse(userStr).accessToken || '') : '';

        const [bookingsRes, roomTypesRes] = await Promise.all([
          fetch('https://ltweb2-production.up.railway.app/api/bookings', {
            headers: { 'Authorization': token ? `Bearer ${token}` : '' }
          }),
          fetch('https://ltweb2-production.up.railway.app/api/room-types')
        ]);
        
        if (bookingsRes.ok) {
          const bookings = await bookingsRes.json();
          
          // Tính phòng đang bận = đơn CONFIRMED/PENDING có ngày check-in <= hôm nay <= check-out
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const occupiedRoomIds = new Set();
          bookings.forEach(b => {
            if (b.status === 'CONFIRMED' || b.status === 'PENDING') {
              const checkIn = new Date(b.checkInDate);
              const checkOut = new Date(b.checkOutDate);
              if (checkIn <= today && today <= checkOut && b.room?.id) {
                occupiedRoomIds.add(b.room.id);
              }
            }
          });

          // Lấy tổng số loại phòng để ước tính phòng trống
          let totalRooms = 0;
          if (roomTypesRes.ok) {
            const roomTypes = await roomTypesRes.json();
            totalRooms = roomTypes.length;
          }
          const availableCount = Math.max(0, totalRooms - occupiedRoomIds.size);
          
          let totalRev = 0;
          const monthlyRevenue = {
            'T1': 0, 'T2': 0, 'T3': 0, 'T4': 0, 'T5': 0, 'T6': 0,
            'T7': 0, 'T8': 0, 'T9': 0, 'T10': 0, 'T11': 0, 'T12': 0
          };
          
          const roomTypeCount = {};

          bookings.forEach(b => {
            const roomPrice = b.room?.roomType?.price || 0;
            const start = new Date(b.checkInDate);
            const end = new Date(b.checkOutDate);
            let nights = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
            if (isNaN(nights) || nights === 0) nights = 1;
            
            const bookingRev = roomPrice * nights;
            if (b.status === 'CONFIRMED' || b.status === 'COMPLETED') {
              totalRev += bookingRev;
              
              if (!isNaN(start.getMonth())) {
                const monthKey = `T${start.getMonth() + 1}`;
                monthlyRevenue[monthKey] += bookingRev;
              }
              
              const roomTypeName = b.room?.roomType?.typeName || 'Khác';
              if (roomTypeCount[roomTypeName]) {
                roomTypeCount[roomTypeName]++;
              } else {
                roomTypeCount[roomTypeName] = 1;
              }
            }
          });

          setStats({
            totalBookings: bookings.length,
            totalRevenue: totalRev,
            roomsAvailable: availableCount
          });

          setChartData({
            labels: Object.keys(monthlyRevenue),
            datasets: [
              {
                label: 'Doanh thu (VNĐ)',
                data: Object.values(monthlyRevenue),
                backgroundColor: '#8b6e45',
              }
            ]
          });

          const backgroundColors = [
            '#0f1c2e', '#8b6e45', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'
          ];

          setPieData({
            labels: Object.keys(roomTypeCount),
            datasets: [
              {
                data: Object.values(roomTypeCount),
                backgroundColor: backgroundColors.slice(0, Object.keys(roomTypeCount).length),
                borderWidth: 1,
              }
            ]
          });
        }
      } catch (error) {
        console.error("Lỗi fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) return <div className="text-gray-500">Đang tải dữ liệu biểu đồ...</div>;

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-[#0f1c2e] mb-8">Tổng quan hoạt động</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">receipt_long</span>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Tổng đơn đặt phòng</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">payments</span>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Doanh thu đã duyệt</div>
            <div className="text-2xl font-bold text-gray-900">{new Intl.NumberFormat('vi-VN').format(stats.totalRevenue)} đ</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">hotel</span>
          </div>
          <div>
              <div className="text-sm text-gray-500 mb-1">Loại phòng khả dụng hôm nay</div>
              <div className="text-2xl font-bold text-gray-900">{stats.roomsAvailable}</div>
            </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Biểu đồ Cột */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Doanh thu năm nay</h2>
          <div className="h-[300px] flex items-center justify-center">
            {chartData.labels.length > 0 ? (
              <Bar 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'top' } }
                }} 
              />
            ) : (
              <span className="text-gray-400">Không có dữ liệu</span>
            )}
          </div>
        </div>

        {/* Biểu đồ Tròn */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Tỉ lệ đặt phòng theo hạng</h2>
          <div className="h-[300px] flex items-center justify-center">
            {pieData.labels.length > 0 ? (
              <Pie 
                data={pieData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'right' } }
                }} 
              />
            ) : (
              <span className="text-gray-400">Không có dữ liệu</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Lối tắt thao tác nhanh</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/bookings" className="flex items-center p-4 border border-gray-200 rounded-md hover:border-[#8b6e45] hover:bg-orange-50/50 transition-colors">
              <span className="material-symbols-outlined text-gray-400 mr-3 text-2xl">list_alt</span>
              <span className="font-medium text-gray-700">Duyệt Đơn</span>
            </Link>
            <Link to="/admin/rooms" className="flex items-center p-4 border border-gray-200 rounded-md hover:border-[#8b6e45] hover:bg-orange-50/50 transition-colors">
              <span className="material-symbols-outlined text-gray-400 mr-3 text-2xl">meeting_room</span>
              <span className="font-medium text-gray-700">Quản lý Phòng</span>
            </Link>
            <Link to="/admin/services" className="flex items-center p-4 border border-gray-200 rounded-md hover:border-[#8b6e45] hover:bg-orange-50/50 transition-colors">
              <span className="material-symbols-outlined text-gray-400 mr-3 text-2xl">room_service</span>
              <span className="font-medium text-gray-700">Dịch Vụ</span>
            </Link>
            <Link to="/admin/users" className="flex items-center p-4 border border-gray-200 rounded-md hover:border-[#8b6e45] hover:bg-orange-50/50 transition-colors">
              <span className="material-symbols-outlined text-gray-400 mr-3 text-2xl">group</span>
              <span className="font-medium text-gray-700">Người Dùng</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
