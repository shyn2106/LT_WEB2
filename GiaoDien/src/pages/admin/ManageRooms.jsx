import React, { useState, useEffect } from "react";

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: "",
    status: "AVAILABLE",
    roomTypeId: ""
  });

  const getToken = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return "";
    const user = JSON.parse(userStr);
    return user.token || user.accessToken || "";
  };

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []);

  const fetchRooms = () => {
    setLoading(true);
    const token = getToken();
    fetch("https://ltweb2-production.up.railway.app/api/rooms", {
      headers: { Authorization: token ? `Bearer ${token}` : "" }
    })
      .then(res => res.json())
      .then(data => setRooms(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchRoomTypes = () => {
    fetch("https://ltweb2-production.up.railway.app/api/room-types")
      .then(res => res.json())
      .then(data => setRoomTypes(data))
      .catch(err => console.error(err));
  };

  const openModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        roomNumber: room.roomNumber || "",
        status: room.status || "AVAILABLE",
        roomTypeId: room.roomType?.id || ""
      });
    } else {
      setEditingRoom(null);
      setFormData({ roomNumber: "", status: "AVAILABLE", roomTypeId: roomTypes[0]?.id || "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = getToken();
    const payload = {
      roomNumber: formData.roomNumber,
      status: formData.status,
      roomType: { id: parseInt(formData.roomTypeId) }
    };
    const url = editingRoom
      ? `https://ltweb2-production.up.railway.app/api/rooms/${editingRoom.id}`
      : "https://ltweb2-production.up.railway.app/api/rooms";
    const method = editingRoom ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (res.ok) {
          alert(editingRoom ? "Cap nhat phong thanh cong!" : "Them phong thanh cong!");
          closeModal();
          fetchRooms();
        } else {
          alert("Co loi xay ra!");
        }
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Ban co chac muon xoa phong nay khong?")) return;
    const token = getToken();
    fetch(`https://ltweb2-production.up.railway.app/api/rooms/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) {
          fetchRooms();
        } else {
          alert("Loi: Phong nay co the dang duoc dat, khong the xoa!");
        }
      })
      .catch(err => console.error(err));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">Trong</span>;
      case "OCCUPIED":
        return <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">Co khach</span>;
      case "MAINTENANCE":
        return <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-semibold">Bao tri</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-semibold">{status || "N/A"}</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Quan ly Phong</h2>
          <p className="text-sm text-gray-500 mt-1">Danh sach cac phong thuc te trong khach san (101, 102...)</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#0f1c2e] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#8b6e45] transition-colors flex items-center"
        >
          <span className="material-symbols-outlined text-sm mr-2">add</span>
          Them Phong
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">So Phong</th>
              <th className="px-6 py-4">Hang Phong</th>
              <th className="px-6 py-4">Gia / Dem</th>
              <th className="px-6 py-4">Trang thai</th>
              <th className="px-6 py-4 text-right">Hanh dong</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-12 text-gray-400">Dang tai du lieu...</td></tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-16">
                  <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">meeting_room</span>
                  <p className="text-gray-400">Chua co phong nao. Hay them phong dau tien!</p>
                  <p className="text-xs text-gray-300 mt-1">VD: Phong 101 thuoc hang Phong Don</p>
                </td>
              </tr>
            ) : (
              rooms.map(room => (
                <tr key={room.id} className="bg-white border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-[#0f1c2e] text-base">
                    Phong {room.roomNumber}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800">{room.roomType?.typeName || "N/A"}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#8b6e45]">
                    {room.roomType?.price
                      ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(room.roomType.price)
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(room.status)}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => openModal(room)} className="font-medium text-blue-600 hover:underline">Sua</button>
                    <button onClick={() => handleDelete(room.id)} className="font-medium text-red-600 hover:underline">Xoa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {editingRoom ? "Chinh sua Phong" : "Them Phong moi"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">So Phong (*)</label>
                <input
                  type="text"
                  required
                  value={formData.roomNumber}
                  onChange={e => setFormData({ ...formData, roomNumber: e.target.value })}
                  placeholder="VD: 101, 202, A301..."
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#8b6e45]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hang Phong (*)</label>
                <select
                  required
                  value={formData.roomTypeId}
                  onChange={e => setFormData({ ...formData, roomTypeId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#8b6e45] bg-white"
                >
                  <option value="">-- Chon hang phong --</option>
                  {roomTypes.map(rt => (
                    <option key={rt.id} value={rt.id}>
                      {rt.typeName} -- {new Intl.NumberFormat("vi-VN").format(rt.price || 0)}d/dem
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trang thai</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#8b6e45] bg-white"
                >
                  <option value="AVAILABLE">Trong (AVAILABLE)</option>
                  <option value="OCCUPIED">Co khach (OCCUPIED)</option>
                  <option value="MAINTENANCE">Dang bao tri (MAINTENANCE)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={closeModal} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Huy</button>
                <button type="submit" className="px-5 py-2 bg-[#0f1c2e] text-white rounded-md hover:bg-[#8b6e45] transition-colors">
                  {editingRoom ? "Luu thay doi" : "Them phong"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
