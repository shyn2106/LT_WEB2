import React, { useState, useEffect } from 'react';

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    typeName: '',
    price: '',
    capacity: '',
    size: '',
    imageUrl: '',
    description: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/room-types')
      .then(res => res.json())
      .then(data => {
        setRooms(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        typeName: room.typeName || '',
        price: room.price || '',
        capacity: room.capacity || '',
        size: room.size || '',
        imageUrl: room.imageUrl || '',
        description: room.description || ''
      });
    } else {
      setEditingRoom(null);
      setFormData({
        typeName: '', price: '', capacity: '', size: '', imageUrl: '', description: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem('user');
    const token = userStr ? (JSON.parse(userStr).token || JSON.parse(userStr).accessToken || '') : '';

    const url = editingRoom 
      ? `http://localhost:8080/api/room-types/${editingRoom.id}`
      : 'http://localhost:8080/api/room-types';
      
    const method = editingRoom ? 'PUT' : 'POST';

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      capacity: parseInt(formData.capacity, 10)
    };

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (res.ok) {
        alert(editingRoom ? 'Cập nhật thành công!' : 'Thêm phòng thành công!');
        closeModal();
        fetchRooms();
      } else {
        alert('Có lỗi xảy ra, vui lòng thử lại!');
      }
    })
    .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hạng phòng này không?')) return;
    
    const userStr = localStorage.getItem('user');
    const token = userStr ? (JSON.parse(userStr).token || JSON.parse(userStr).accessToken || '') : '';

    fetch(`http://localhost:8080/api/room-types/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
    .then(res => {
      if (res.ok) {
        alert('Đã xóa thành công!');
        fetchRooms();
      } else {
        alert('Lỗi: Có thể phòng này đã có người đặt, không thể xóa!');
      }
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Quản lý Hạng Phòng</h2>
        <button 
          onClick={() => openModal()}
          className="bg-[#0f1c2e] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#8b6e45] transition-colors flex items-center"
        >
          <span className="material-symbols-outlined text-sm mr-2">add</span>
          Thêm Phòng Mới
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Hình ảnh</th>
              <th className="px-6 py-4">Tên Hạng Phòng</th>
              <th className="px-6 py-4">Giá tiền</th>
              <th className="px-6 py-4">Diện tích / Sức chứa</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-8">Đang tải dữ liệu...</td></tr>
            ) : rooms.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8">Chưa có hạng phòng nào.</td></tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id} className="bg-white border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {room.imageUrl ? (
                      <img src={room.imageUrl} alt={room.typeName} className="w-20 h-12 object-cover rounded-sm" />
                    ) : (
                      <div className="w-20 h-12 bg-gray-200 flex items-center justify-center text-xs text-gray-400 rounded-sm">No Image</div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {room.typeName}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#8b6e45]">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price || 0)}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div>{room.size || 'N/A'}</div>
                    <div className="text-gray-400">{room.capacity} Người lớn</div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => openModal(room)}
                      className="font-medium text-blue-600 hover:underline"
                    >Sửa</button>
                    <button 
                      onClick={() => handleDelete(room.id)}
                      className="font-medium text-red-600 hover:underline"
                    >Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {editingRoom ? 'Chỉnh sửa Hạng phòng' : 'Thêm Hạng phòng mới'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên Hạng Phòng (*)</label>
                  <input type="text" name="typeName" value={formData.typeName} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b6e45]" placeholder="VD: Presidential Suite" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giá 1 đêm (VNĐ) (*)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b6e45]" placeholder="VD: 5000000" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sức chứa (Người) (*)</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b6e45]" placeholder="VD: 2" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link Ảnh (URL)</label>
                  <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b6e45]" placeholder="VD: https://images.unsplash.com/..." />
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Preview:</p>
                      <img src={formData.imageUrl} alt="preview" className="h-32 object-cover rounded-md border border-gray-200" />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diện tích</label>
                  <input type="text" name="size" value={formData.size} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b6e45]" placeholder="VD: 120 SQM" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả phòng</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b6e45]"></textarea>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button type="button" onClick={closeModal} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Hủy</button>
                <button type="submit" className="px-6 py-2 bg-[#0f1c2e] text-white rounded-md hover:bg-[#8b6e45]">{editingRoom ? 'Lưu thay đổi' : 'Tạo phòng mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
