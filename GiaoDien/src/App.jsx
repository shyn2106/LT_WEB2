import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/customer/Home';
import RoomDetail from './pages/customer/RoomDetail';
import Properties from './pages/customer/Properties';
import Checkout from './pages/customer/Checkout';
import Contact from './pages/customer/Contact';
import Experiences from './pages/customer/Experiences';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import Profile from './pages/customer/Profile';
import BookingDetail from './pages/customer/BookingDetail';
import PaymentResult from './pages/customer/PaymentResult';
import ForgotPassword from './pages/customer/ForgotPassword';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBookings from './pages/admin/ManageBookings';
import ManageRooms from './pages/admin/ManageRooms';
import ManageRoomTypes from './pages/admin/ManageRoomTypes';
import ManageServices from './pages/admin/ManageServices';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBanners from './pages/admin/ManageBanners';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="room/:id" element={<RoomDetail />} />
          <Route path="properties" element={<Properties />} />
          <Route path="experiences" element={<Experiences />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="booking/:id" element={<BookingDetail />} />
          <Route path="payment-result" element={<PaymentResult />} />
          <Route path="*" element={<div className="p-12 text-center text-xl">404 - Not Found</div>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="rooms" element={<ManageRooms />} />
          <Route path="room-types" element={<ManageRoomTypes />} />
          <Route path="services" element={<ManageServices />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="banners" element={<ManageBanners />} />
          {/* Các route quản lý khác sẽ thêm sau */}
          <Route path="*" element={<div className="p-12 text-center text-xl">404 - Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
