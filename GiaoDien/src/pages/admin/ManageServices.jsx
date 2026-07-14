import React, { useState, useEffect } from 'react';

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    serviceName: '',
    price: '',
    description: '',
    status: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    setLoading(true);
    fetch('https://ltweb2-production.up.railway.app/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        serviceName: service.serviceName || '',
        price: service.price || '',
        description: service.description || '',
        status: service.status !== false // default true
      });
    } else {
      setEditingService(null);
      setFormData({
        serviceName: '', price: '', description: '', status: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem('user');
    const token = userStr ? (JSON.parse(userStr).token || JSON.parse(userStr).accessToken || '') : '';

    const url = editingService 
      ? `https://ltweb2-production.up.railway.app/api/services/${editingService.id}`
      : 'https://ltweb2-production.up.railway.app/api/services';
      
    const method = editingService ? 'PUT' : 'POST';

    const payload = {
      ...formData,
      price: parseFloat(formData.price)
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
        alert(editingService ? 'Cập nhật thành công!' : 'Thêm dịch vụ thành công!');
        closeModal();
        fetchServices();
      } else {
        alert('Có lỗi xảy ra, vui lòng thử lại!');
      }
    })
    .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này không?')) return;
    
    const userStr = localStorage.getItem('user');
    const token = userStr ? (JSON.parse(userStr).token || JSON.parse(userStr).accessToken || '') : '';

    fetch(`https://ltweb2-production.up.railway.app/api/services/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
    .then(res => {
      if (res.ok) {
        alert('Đã xóa thành công!');
        fetchServices();
      } else {
        alert('Lỗi: Có thể dịch vụ này đang được dùng trong hóa đơn!');
      }
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Quản lý Dịch Vụ Phụ Trợ</h2>
        <button 
          onClick={() => openModal()}
          className="bg-[#0f1c2e] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#8b6e45] transition-colors flex items-center"
        >
          <span className="material-symbols-outlined text-sm mr-2">add</span>
          Thêm Dịch Vụ Mới
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Tên Dịch vụ</th>
              <th className="px-6 py-4">Mô tả</th>
              <th className="px-6 py-4">Giá tiền</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-8">Đang tải dữ liệu...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8">Chưa có dịch vụ nào.</td></tr>
            ) : (
              services.map((svc) => (
                <tr key={svc.id} className="bg-white border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {svc.serviceName}
                  </td>
                  <td className="px-6 py-4">
                    {svc.description}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#8b6e45]">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(svc.price || 0)}
                  </td>
                  <td className="px-6 py-4">
                    {svc.status !== false ? (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-300">Đang hoạt động</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-gray-300">Tạm ngưng</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => openModal(svc)}
                      className="font-medium text-blue-600 hover:underline"
                    >Sửa</button>
                    <button 
                      onClick={() => handleDelete(svc.id)}
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {editingService ? 'Chỉnh sửa Dịch vụ' : 'Thêm Dịch vụ mới'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên Dịch vụ (*)</label>
                  <input type="text" name="serviceName" value={formData.serviceName} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b6e45]" placeholder="VD: Ăn sáng Buffet" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giá tiền (VNĐ) (*)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b6e45]" placeholder="VD: 300000" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b6e45]"></textarea>
                </div>

                <div className="flex items-center space-x-3 mt-4">
                  <input type="checkbox" id="status" name="status" checked={formData.status} onChange={handleInputChange} className="w-4 h-4 text-[#8b6e45] border-gray-300 rounded focus:ring-[#8b6e45]" />
                  <label htmlFor="status" className="text-sm font-medium text-gray-700">Đang phục vụ</label>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button type="button" onClick={closeModal} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Hủy</button>
                <button type="submit" className="px-6 py-2 bg-[#0f1c2e] text-white rounded-md hover:bg-[#8b6e45]">{editingService ? 'Lưu thay đổi' : 'Tạo mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
