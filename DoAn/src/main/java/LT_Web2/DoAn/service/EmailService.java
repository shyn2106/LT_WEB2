package LT_Web2.DoAn.service;

import LT_Web2.DoAn.entity.Booking;
import LT_Web2.DoAn.entity.User;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.Locale;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendBookingConfirmation(User user, Booking booking) {
        System.out.println("Bắt đầu tiến trình gửi email xác nhận cho: " + user.getEmail());

        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            System.out.println("User không có email. Hủy bỏ quá trình gửi email.");
            return; // Không gửi nếu user không có email
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(user.getEmail());
            helper.setSubject("Xác nhận đặt phòng thành công - LUMIÈRE GRAND");
            
            // Tính tổng tiền
            long days = 1;
            if (booking.getCheckInDate() != null && booking.getCheckOutDate() != null) {
                days = java.time.temporal.ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate());
                if (days <= 0) days = 1;
            }
            
            double roomPrice = 0;
            if (booking.getRoom() != null && booking.getRoom().getRoomType() != null) {
                roomPrice = booking.getRoom().getRoomType().getPrice();
            }
            
            double calculatedTotal = roomPrice * days;
            if (booking.getServices() != null) {
                for (LT_Web2.DoAn.entity.Service s : booking.getServices()) {
                    calculatedTotal += s.getPrice();
                }
            }

            // Format currency
            NumberFormat currencyFormat = NumberFormat.getInstance(new Locale("vi", "VN"));
            String totalAmount = currencyFormat.format(calculatedTotal) + " VNĐ";

            String htmlContent = "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #fbf9f8;\">" +
                    "<div style=\"text-align: center; margin-bottom: 30px;\">" +
                    "<h1 style=\"color: #0f1c2e; margin: 0; font-size: 28px; letter-spacing: 2px;\">LUMIÈRE GRAND</h1>" +
                    "<p style=\"color: #8b6e45; margin: 5px 0 0; letter-spacing: 3px; font-size: 12px; font-weight: bold;\">LUXURY HOTEL & SPA</p>" +
                    "</div>" +
                    "<div style=\"background-color: white; padding: 30px; border-radius: 5px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);\">" +
                    "<h2 style=\"color: #1a2b3c; font-size: 20px; margin-top: 0;\">Xin chào " + user.getFullName() + ",</h2>" +
                    "<p style=\"color: #4a5568; line-height: 1.6;\">Cảm ơn bạn đã lựa chọn LUMIÈRE GRAND. Chúng tôi rất vui mừng xác nhận đơn đặt phòng của bạn đã được ghi nhận thành công.</p>" +
                    "<div style=\"background-color: #f8f9fa; border-left: 4px solid #8b6e45; padding: 15px; margin: 25px 0;\">" +
                    "<h3 style=\"color: #0f1c2e; margin-top: 0; font-size: 16px;\">CHI TIẾT ĐẶT PHÒNG</h3>" +
                    "<table style=\"width: 100%; border-collapse: collapse;\">" +
                    "<tr><td style=\"padding: 8px 0; color: #718096; width: 40%;\">Mã số đặt phòng:</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c;\">#" + booking.getId() + "</td></tr>" +
                    "<tr><td style=\"padding: 8px 0; color: #718096;\">Ngày Check-in:</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c;\">" + booking.getCheckInDate() + "</td></tr>" +
                    "<tr><td style=\"padding: 8px 0; color: #718096;\">Ngày Check-out:</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c;\">" + booking.getCheckOutDate() + "</td></tr>" +
                    "<tr><td style=\"padding: 8px 0; color: #718096;\">Tổng tiền:</td><td style=\"padding: 8px 0; font-weight: bold; color: #e53e3e;\">" + totalAmount + "</td></tr>" +
                    "</table>" +
                    "</div>" +
                    "<p style=\"color: #4a5568; line-height: 1.6;\">Vui lòng xuất trình email này hoặc CCCD/Passport khi làm thủ tục nhận phòng tại quầy lễ tân.</p>" +
                    "<p style=\"color: #4a5568; line-height: 1.6;\">Nếu bạn cần hỗ trợ thêm, đừng ngần ngại liên hệ với chúng tôi qua số hotline: <strong>+84 1900 123 456</strong>.</p>" +
                    "</div>" +
                    "<div style=\"text-align: center; margin-top: 30px; color: #a0aec0; font-size: 12px;\">" +
                    "<p>© " + java.time.Year.now().getValue() + " LUMIÈRE GRAND HOTEL. All Rights Reserved.</p>" +
                    "<p>123 Luxury Boulevard, District 1, Ho Chi Minh City, Vietnam</p>" +
                    "</div>" +
                    "</div>";

            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("Gửi email THÀNH CÔNG tới: " + user.getEmail());
        } catch (Exception e) {
            System.err.println("Lỗi khi gửi email xác nhận tới " + user.getEmail() + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
}
