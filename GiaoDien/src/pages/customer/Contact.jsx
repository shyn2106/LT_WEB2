import React from 'react';

export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-12 py-12">
      <div className="mb-12">
        <h4 className="text-[10px] font-bold text-[#8b6e45] uppercase tracking-widest mb-2">HOSPITALITY REFINED</h4>
        <h1 className="text-4xl font-serif font-bold text-[#0f1c2e] mb-4">Liên hệ với chúng tôi</h1>
        <p className="text-gray-600 text-sm max-w-md">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ quý khách. Hãy để lại lời nhắn hoặc ghé thăm chúng tôi tại các điểm đến xa hoa trên toàn thế giới.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
        
        {/* Left Column: Info */}
        <div className="space-y-10">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#0f1c2e] mb-6">Trụ sở chính</h3>
            <div className="space-y-6 text-sm text-gray-600">
              <div className="flex items-start space-x-4">
                <span className="material-symbols-outlined text-[#8b6e45]">location_on</span>
                <div>
                  123 Đại lộ Ánh Sáng, Phường Bến Nghé,<br />
                  Quận 1, TP. Hồ Chí Minh, Việt Nam
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <span className="material-symbols-outlined text-[#8b6e45]">call</span>
                <div>
                  Hotline: +84 (28) 3822 0000<br />
                  Tổng đài: +84 (28) 3822 1111
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <span className="material-symbols-outlined text-[#8b6e45]">mail</span>
                <div>
                  reservations@lumieregrand.com<br />
                  support@lumieregrand.com
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold text-[#0f1c2e] mb-4">Mạng xã hội</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#8b6e45] hover:text-white hover:border-[#8b6e45] transition-colors">
                <span className="material-symbols-outlined text-sm">public</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#8b6e45] hover:text-white hover:border-[#8b6e45] transition-colors">
                <span className="material-symbols-outlined text-sm">camera_alt</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#8b6e45] hover:text-white hover:border-[#8b6e45] transition-colors">
                <span className="material-symbols-outlined text-sm">share</span>
              </a>
            </div>
          </div>

          <div className="relative h-48 rounded-sm overflow-hidden mt-8">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Lobby" className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 bg-white/90 text-[10px] font-bold uppercase tracking-wider px-3 py-1 text-[#0f1c2e]">SẢNH CHÍNH</div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div>
          <div className="bg-white p-10 rounded-sm shadow-sm border border-gray-100">
            <h3 className="text-2xl font-serif font-bold text-[#0f1c2e] mb-2">Gửi yêu cầu của quý khách</h3>
            <p className="text-sm text-gray-500 mb-8">Vui lòng điền thông tin bên dưới, đội ngũ tư vấn của chúng tôi sẽ liên hệ lại trong vòng 24 giờ.</p>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Họ và tên</label>
                  <input type="text" placeholder="Nguyễn Văn A" className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-[#8b6e45] bg-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email</label>
                  <input type="email" placeholder="example@email.com" className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-[#8b6e45] bg-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Số điện thoại</label>
                  <input type="text" placeholder="+84 000 000 000" className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-[#8b6e45] bg-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Chủ đề</label>
                  <select className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-[#8b6e45] bg-transparent appearance-none cursor-pointer">
                    <option>Đặt phòng & Nghỉ dưỡng</option>
                    <option>Tổ chức sự kiện</option>
                    <option>Phản hồi dịch vụ</option>
                    <option>Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nội dung tin nhắn</label>
                <textarea rows="4" placeholder="Quý khách cần hỗ trợ điều gì?" className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-[#8b6e45] bg-transparent resize-none"></textarea>
              </div>

              <button type="button" className="bg-[#8b6e45] text-white px-8 py-3 text-sm font-semibold tracking-wider hover:bg-[#735936] transition-colors rounded-sm flex items-center space-x-2">
                <span>Gửi tin nhắn</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
