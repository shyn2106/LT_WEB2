import React, { useState, useEffect } from 'react';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    const userStr = localStorage.getItem('user');
    const token = userStr ? (JSON.parse(userStr).token || JSON.parse(userStr).accessToken || '') : '';

    fetch('http://localhost:8080/api/users', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleUpdateRole = (id, newRole) => {
    if (!window.confirm(`Bạn có chắc chắn muốn cấp quyền ${newRole} cho người dùng này?`)) return;
    
    const userToUpdate = users.find(u => u.id === id);
    if (!userToUpdate) return;
    
    updateUserApi(id, { ...userToUpdate, role: newRole });
  };

  const handleToggleLock = (id, currentLockedStatus) => {
    const actionText = currentLockedStatus ? 'MỞ KHÓA' : 'KHÓA';
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản này không?`)) return;
    
    const userToUpdate = users.find(u => u.id === id);
    if (!userToUpdate) return;
    
    updateUserApi(id, { ...userToUpdate, isLocked: !currentLockedStatus });
  };

  const updateUserApi = (id, updatedData) => {
    const userStr = localStorage.getItem('user');
    const token = userStr ? (JSON.parse(userStr).token || JSON.parse(userStr).accessToken || '') : '';

    fetch(`http://localhost:8080/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(updatedData)
    })
    .then(res => {
      if (res.ok) {
        alert('Cập nhật thành công!');
        fetchUsers();
      } else {
        alert('Có lỗi xảy ra!');
      }
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Quản lý Người Dùng</h2>
        <button onClick={fetchUsers} className="text-gray-500 hover:text-[#8b6e45] p-2 bg-gray-50 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-sm">refresh</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Tên tài khoản (Username)</th>
              <th className="px-6 py-4">Phân quyền (Role)</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-8">Đang tải dữ liệu...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8">Chưa có dữ liệu.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="bg-white border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #{user.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.username}</span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={user.role || 'CUSTOMER'}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#8b6e45]"
                    >
                      <option value="CUSTOMER">Khách Hàng (CUSTOMER)</option>
                      <option value="RECEPTIONIST">Lễ Tân (RECEPTIONIST)</option>
                      <option value="ADMIN">Quản Trị Viên (ADMIN)</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {user.isLocked ? (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-red-300">Đã Khóa (Banned)</span>
                    ) : (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-300">Hoạt động</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    {user.isLocked ? (
                      <button 
                        onClick={() => handleToggleLock(user.id, user.isLocked)}
                        className="font-medium text-blue-600 hover:underline"
                      >Mở khóa</button>
                    ) : (
                      <button 
                        onClick={() => handleToggleLock(user.id, user.isLocked)}
                        className="font-medium text-red-600 hover:underline"
                      >Khóa (Ban)</button>
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
