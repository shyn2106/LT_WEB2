import React, { useState, useEffect } from 'react';

export default function ManageBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    buttonText: '',
    link: '',
    isActive: true,
    displayOrder: 0
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/banners')
      .then(res => res.json())
      .then(data => {
        setBanners(data);
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

  const openModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        description: banner.description || '',
        imageUrl: banner.imageUrl || '',
        buttonText: banner.buttonText || '',
        link: banner.link || '',
        isActive: banner.isActive,
        displayOrder: banner.displayOrder || 0
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '', subtitle: '', description: '', imageUrl: '', buttonText: '', link: '', isActive: true, displayOrder: 0
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem('user');
    const token = userStr ? (JSON.parse(userStr).token || JSON.parse(userStr).accessToken || '') : '';

    const url = editingBanner 
      ? `http://localhost:8080/api/banners/${editingBanner.id}`
      : 'http://localhost:8080/api/banners';
      
    const method = editingBanner ? 'PUT' : 'POST';

    const payload = {
      ...formData,
      displayOrder: parseInt(formData.displayOrder, 10)
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
        alert(editingBanner ? 'Cập nhật thành công!' : 'Thêm banner thành công!');
        closeModal();
        fetchBanners();
      } else {
        alert('Có lỗi xảy ra, vui lòng thử lại!');
      }
    })
    .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa banner này không?')) return;
    
    const userStr = localStorage.getItem('user');
    const token = userStr ? (JSON.parse(userStr).token || JSON.parse(userStr).accessToken || '') : '';

    fetch(`http://localhost:8080/api/banners/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
    .then(res => {
      if (res.ok) {
        alert('Đã xóa thành công!');
        fetchBanners();
      } else {
        alert('Lỗi khi xóa!');
      }
    })
    .catch(err => console.error(err));
  };

  const handleToggleActive = (banner) => {
    const userStr = localStorage.getItem('user');
    const token = userStr ? (JSON.parse(userStr).token || JSON.parse(userStr).accessToken || '') : '';

    const payload = {
      ...banner,
      isActive: !banner.isActive
    };

    fetch(`http://localhost:8080/api/banners/${banner.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (res.ok) fetchBanners();
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Quản lý Banner</h2>
        <button 
          onClick={() => openModal()}
          className="bg-[#0f1c2e] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#8b6e45] transition-colors flex items-center"
        >
          <span className="material-symbols-outlined text-sm mr-2">add</span>
          Thêm Banner
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Hình ảnh</th>
              <th className="px-6 py-4">Tiêu đề chính / Phụ</th>
              <th className="px-6 py-4">Thứ tự</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-8">Đang tải dữ liệu...</td></tr>
            ) : banners.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8">Chưa có banner nào.</td></tr>
            ) : (
              banners.map((banner) => (
                <tr key={banner.id} className="bg-white border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {banner.imageUrl ? (
                      <img src={banner.imageUrl} alt={banner.title} className="w-24 h-12 object-cover rounded-sm shadow-sm" />
                    ) : (
                      <div className="w-24 h-12 bg-gray-200 flex items-center justify-center text-xs text-gray-400 rounded-sm">No Image</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{banner.title}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{banner.subtitle}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {banner.displayOrder}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleActive(banner)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center w-max ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {banner.isActive ? (
                        <><span className="material-symbols-outlined text-[14px] mr-1">check_circle</span> Đang bật</>
                      ) : (
                        <><span className="material-symbols-outlined text-[14px] mr-1">cancel</span> Đã tắt</>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => openModal(banner)}
                      className="font-medium text-blue-600 hover:underline"
                    >Sửa</button>
                    <button 
                      onClick={() => handleDelete(banner.id)}
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
                {editingBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề chính (Title) (*)</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b6e45]" placeholder="VD: LUMIÈRE GRAND" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề phụ (Subtitle)</label>
                  <input type="text" name="subtitle" value={formData.subtitle} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b6e45]" placeholder="VD: WELCOME TO THE PINNACLE OF ELEGANCE" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link Ảnh (URL) (*)</label>
                  <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b6e45]" placeholder="VD: https://images.unsplash.com/..." />
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Preview:</p>
                      <img src={formData.imageUrl} alt="preview" className="h-32 object-cover rounded-md border border-gray-200" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nút bấm (Text)</label>
                  <input type="text" name="buttonText" value={formData.buttonText} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b6e45]" placeholder="VD: DISCOVER ROOMS" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Đường dẫn nút (Link)</label>
                  <input type="text" name="link" value={formData.link} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b6e45]" placeholder="VD: /properties" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn gọn</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b6e45]" placeholder="VD: Experience luxury beyond expectations..."></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thứ tự hiển thị (0, 1, 2...)</label>
                  <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b6e45]" />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer mt-7">
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="w-5 h-5 border-gray-300 text-[#0f1c2e] focus:ring-[#0f1c2e]" />
                    <span className="ml-2 text-sm font-medium text-gray-700">Trạng thái Bật/Tắt</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button type="button" onClick={closeModal} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Hủy</button>
                <button type="submit" className="px-6 py-2 bg-[#0f1c2e] text-white rounded-md hover:bg-[#8b6e45]">{editingBanner ? 'Lưu thay đổi' : 'Thêm Banner'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
