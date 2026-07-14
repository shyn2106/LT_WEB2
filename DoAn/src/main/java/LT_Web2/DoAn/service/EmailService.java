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
import LT_Web2.DoAn.repository.RoomRepository;
import LT_Web2.DoAn.repository.ServiceRepository;

import java.text.NumberFormat;
import java.util.Locale;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private LT_Web2.DoAn.repository.BookingRepository bookingRepository;

    @Async
    @org.springframework.transaction.annotation.Transactional
    public void sendBookingConfirmation(User user, Booking booking) {
        System.out.println("Bắt đầu tiến trình gửi email xác nhận cho: " + user.getEmail());

        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            System.out.println("User không có email. Hủy bỏ quá trình gửi email.");
            return; // Không gửi nếu user không có email
        }

        try {
            // Re-fetch booking inside the transaction to avoid LazyInitializationException
            Booking freshBooking = bookingRepository.findById(booking.getId()).orElse(booking);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(user.getEmail());
            helper.setSubject("Xác nhận đặt phòng thành công - LUMIÈRE GRAND");
            
            // Tính tổng tiền
            long days = 1;
            if (freshBooking.getCheckInDate() != null && freshBooking.getCheckOutDate() != null) {
                days = java.time.temporal.ChronoUnit.DAYS.between(freshBooking.getCheckInDate(), freshBooking.getCheckOutDate());
                if (days <= 0) days = 1;
            }
            
            NumberFormat currencyFormat = NumberFormat.getInstance(new Locale("vi", "VN"));
            
            double roomPrice = 0;
            String roomTypeName = "Chưa xác định";
            if (freshBooking.getRoom() != null && freshBooking.getRoom().getId() != null) {
                LT_Web2.DoAn.entity.Room room = roomRepository.findById(freshBooking.getRoom().getId()).orElse(null);
                if (room != null && room.getRoomType() != null) {
                    if (room.getRoomType().getPrice() != null) roomPrice = room.getRoomType().getPrice();
                    if (room.getRoomType().getTypeName() != null) roomTypeName = room.getRoomType().getTypeName();
                }
            }
            
            double servicesTotal = 0;
            StringBuilder servicesHtml = new StringBuilder();
            if (freshBooking.getServices() != null && !freshBooking.getServices().isEmpty()) {
                for (LT_Web2.DoAn.entity.Service s : freshBooking.getServices()) {
                    if (s.getId() != null) {
                        LT_Web2.DoAn.entity.Service fullService = serviceRepository.findById(s.getId()).orElse(null);
                        if (fullService != null && fullService.getPrice() != null) {
                            servicesTotal += fullService.getPrice();
                            servicesHtml.append("<tr><td style=\"padding: 8px 0; color: #718096; border-top: 1px dashed #edf2f7;\">- Dịch vụ: ")
                                        .append(fullService.getServiceName())
                                        .append("</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; border-top: 1px dashed #edf2f7; text-align: right;\">")
                                        .append(currencyFormat.format(fullService.getPrice())).append(" VNĐ</td></tr>");
                        }
                    }
                }
            }
            
            double roomTotal = roomPrice * days;
            double subTotal = roomTotal + servicesTotal;
            double tax = subTotal * 0.05; // 5% VAT như Frontend
            double grandTotal = subTotal + tax;

            String roomTotalStr = currencyFormat.format(roomTotal) + " VNĐ";
            String taxStr = currencyFormat.format(tax) + " VNĐ";
            String grandTotalStr = currencyFormat.format(grandTotal) + " VNĐ";

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
                    "<table style=\"width: 100%; border-collapse: collapse; font-size: 14px;\">" +
                    "<tr><td style=\"padding: 8px 0; color: #718096; width: 55%;\">Mã số đặt phòng:</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; text-align: right;\">#" + booking.getId() + "</td></tr>" +
                    "<tr><td style=\"padding: 8px 0; color: #718096;\">Ngày Check-in:</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; text-align: right;\">" + booking.getCheckInDate() + "</td></tr>" +
                    "<tr><td style=\"padding: 8px 0; color: #718096;\">Ngày Check-out:</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; text-align: right;\">" + booking.getCheckOutDate() + "</td></tr>" +
                    "<tr><td style=\"padding: 8px 0; color: #718096;\">Thời gian lưu trú:</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; text-align: right;\">" + days + " Đêm</td></tr>" +
                    "<tr><td style=\"padding: 8px 0; color: #718096; border-top: 1px solid #cbd5e0; margin-top: 5px;\">Loại phòng:</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; border-top: 1px solid #cbd5e0; text-align: right;\">" + roomTypeName + "</td></tr>" +
                    "<tr><td style=\"padding: 8px 0; color: #718096;\">Tiền phòng (" + days + " đêm):</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; text-align: right;\">" + roomTotalStr + "</td></tr>" +
                    servicesHtml.toString() +
                    "<tr><td style=\"padding: 8px 0; color: #718096; border-top: 1px solid #cbd5e0;\">Tạm tính:</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; border-top: 1px solid #cbd5e0; text-align: right;\">" + currencyFormat.format(subTotal) + " VNĐ</td></tr>" +
                    "<tr><td style=\"padding: 8px 0; color: #718096;\">Thuế & Phí dịch vụ (5%):</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; text-align: right;\">" + taxStr + "</td></tr>" +
                    "<tr><td style=\"padding: 12px 0 0 0; color: #718096; font-size: 16px; font-weight: bold; border-top: 2px solid #8b6e45;\">TỔNG CỘNG:</td><td style=\"padding: 12px 0 0 0; font-weight: bold; color: #e53e3e; font-size: 18px; text-align: right; border-top: 2px solid #8b6e45;\">" + grandTotalStr + "</td></tr>" +
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

    @Async
    @org.springframework.transaction.annotation.Transactional
    public void sendPaymentSuccessConfirmation(User user, Booking booking) {
        System.out.println("Bắt đầu tiến trình gửi email thanh toán thành công cho: " + user.getEmail());

        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            System.out.println("User không có email. Hủy bỏ quá trình gửi email.");
            return;
        }

        try {
            // Re-fetch booking inside the transaction to avoid LazyInitializationException
            Booking freshBooking = bookingRepository.findById(booking.getId()).orElse(booking);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(user.getEmail());
            helper.setSubject("Thanh toán thành công & Xác nhận đặt phòng - LUMIÈRE GRAND");
            
            // Tính tổng tiền
            long days = 1;
            if (freshBooking.getCheckInDate() != null && freshBooking.getCheckOutDate() != null) {
                days = java.time.temporal.ChronoUnit.DAYS.between(freshBooking.getCheckInDate(), freshBooking.getCheckOutDate());
                if (days <= 0) days = 1;
            }
            
            NumberFormat currencyFormat = NumberFormat.getInstance(new Locale("vi", "VN"));
            
            double roomPrice = 0;
            String roomTypeName = "Chưa xác định";
            if (freshBooking.getRoom() != null && freshBooking.getRoom().getId() != null) {
                LT_Web2.DoAn.entity.Room room = roomRepository.findById(freshBooking.getRoom().getId()).orElse(null);
                if (room != null && room.getRoomType() != null) {
                    if (room.getRoomType().getPrice() != null) roomPrice = room.getRoomType().getPrice();
                    if (room.getRoomType().getTypeName() != null) roomTypeName = room.getRoomType().getTypeName();
                }
            }
            
            double servicesTotal = 0;
            StringBuilder servicesHtml = new StringBuilder();
            if (freshBooking.getServices() != null && !freshBooking.getServices().isEmpty()) {
                for (LT_Web2.DoAn.entity.Service s : freshBooking.getServices()) {
                    if (s.getId() != null) {
                        LT_Web2.DoAn.entity.Service fullService = serviceRepository.findById(s.getId()).orElse(null);
                        if (fullService != null && fullService.getPrice() != null) {
                            servicesTotal += fullService.getPrice();
                            servicesHtml.append("<tr><td style=\"padding: 8px 0; color: #718096; border-top: 1px dashed #edf2f7;\">- Dịch vụ: ")
                                        .append(fullService.getServiceName())
                                        .append("</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; border-top: 1px dashed #edf2f7; text-align: right;\">")
                                        .append(currencyFormat.format(fullService.getPrice())).append(" VNĐ</td></tr>");
                        }
                    }
                }
            }
            
            double roomTotal = roomPrice * days;
            double subTotal = roomTotal + servicesTotal;
            double tax = subTotal * 0.05;
            double grandTotal = subTotal + tax;

            String roomTotalStr = currencyFormat.format(roomTotal) + " VNĐ";
            String taxStr = currencyFormat.format(tax) + " VNĐ";
            String grandTotalStr = currencyFormat.format(grandTotal) + " VNĐ";

            String htmlContent = "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #fbf9f8;\">" +
                    "<div style=\"text-align: center; margin-bottom: 30px;\">" +
                    "<h1 style=\"color: #0f1c2e; margin: 0; font-size: 28px; letter-spacing: 2px;\">LUMIÈRE GRAND</h1>" +
                    "<p style=\"color: #8b6e45; margin: 5px 0 0; letter-spacing: 3px; font-size: 12px; font-weight: bold;\">LUXURY HOTEL & SPA</p>" +
                    "</div>" +
                    "<div style=\"background-color: white; padding: 30px; border-radius: 5px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);\">" +
                    "<h2 style=\"color: #1a2b3c; font-size: 20px; margin-top: 0;\">Xin chào " + user.getFullName() + ",</h2>" +
                    "<p style=\"color: #4a5568; line-height: 1.6;\">Chúng tôi xác nhận đã nhận được khoản thanh toán thành công qua VNPAY cho đơn đặt phòng của bạn. Trạng thái đơn của bạn hiện tại là <strong>HOÀN THÀNH</strong>.</p>" +
                    "<div style=\"background-color: #f0fff4; border-left: 4px solid #38a169; padding: 15px; margin: 25px 0;\">" +
                    "<h3 style=\"color: #2f855a; margin-top: 0; font-size: 16px;\">CHI TIẾT THANH TOÁN</h3>" +
                    "<table style=\"width: 100%; border-collapse: collapse; font-size: 14px;\">" +
                    "<tr><td style=\"padding: 8px 0; color: #718096; width: 55%;\">Mã số đặt phòng:</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; text-align: right;\">#" + booking.getId() + "</td></tr>" +
                    "<tr><td style=\"padding: 8px 0; color: #718096;\">Ngày Check-in:</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; text-align: right;\">" + freshBooking.getCheckInDate() + "</td></tr>" +
                    "<tr><td style=\"padding: 8px 0; color: #718096;\">Ngày Check-out:</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; text-align: right;\">" + freshBooking.getCheckOutDate() + "</td></tr>" +
                    "<tr><td style=\"padding: 8px 0; color: #718096;\">Thời gian lưu trú:</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; text-align: right;\">" + days + " Đêm</td></tr>" +
                    "<tr><td style=\"padding: 8px 0; color: #718096; border-top: 1px solid #cbd5e0; margin-top: 5px;\">Loại phòng:</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; border-top: 1px solid #cbd5e0; text-align: right;\">" + roomTypeName + "</td></tr>" +
                    "<tr><td style=\"padding: 8px 0; color: #718096;\">Tiền phòng (" + days + " đêm):</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; text-align: right;\">" + roomTotalStr + "</td></tr>" +
                    servicesHtml.toString() +
                    "<tr><td style=\"padding: 8px 0; color: #718096; border-top: 1px solid #cbd5e0;\">Tạm tính:</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; border-top: 1px solid #cbd5e0; text-align: right;\">" + currencyFormat.format(subTotal) + " VNĐ</td></tr>" +
                    "<tr><td style=\"padding: 8px 0; color: #718096;\">Thuế & Phí dịch vụ (5%):</td><td style=\"padding: 8px 0; font-weight: bold; color: #1a2b3c; text-align: right;\">" + taxStr + "</td></tr>" +
                    "<tr><td style=\"padding: 12px 0 0 0; color: #718096; font-size: 16px; font-weight: bold; border-top: 2px solid #38a169;\">ĐÃ THANH TOÁN (VNPAY):</td><td style=\"padding: 12px 0 0 0; font-weight: bold; color: #38a169; font-size: 18px; text-align: right; border-top: 2px solid #38a169;\">" + grandTotalStr + "</td></tr>" +
                    "</table>" +
                    "</div>" +
                    "<p style=\"color: #4a5568; line-height: 1.6;\">Cảm ơn bạn đã lựa chọn dịch vụ của LUMIÈRE GRAND. Vui lòng xuất trình email này khi đến nhận phòng.</p>" +
                    "</div>" +
                    "<div style=\"text-align: center; margin-top: 30px; color: #a0aec0; font-size: 12px;\">" +
                    "<p>© " + java.time.Year.now().getValue() + " LUMIÈRE GRAND HOTEL. All Rights Reserved.</p>" +
                    "<p>123 Luxury Boulevard, District 1, Ho Chi Minh City, Vietnam</p>" +
                    "</div>" +
                    "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("Gửi email thanh toán thành công tới: " + user.getEmail());
        } catch (Exception e) {
            System.err.println("Lỗi khi gửi email thanh toán tới " + user.getEmail() + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async
    public void sendPasswordResetOtp(String toEmail, String otp) {
        System.out.println("Bắt đầu tiến trình gửi mã OTP cho: " + toEmail);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Mã OTP khôi phục mật khẩu - LUMIÈRE GRAND");
            
            String htmlContent = "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #fbf9f8;\">" +
                    "<div style=\"text-align: center; margin-bottom: 30px;\">" +
                    "<h1 style=\"color: #0f1c2e; margin: 0; font-size: 28px; letter-spacing: 2px;\">LUMIÈRE GRAND</h1>" +
                    "<p style=\"color: #8b6e45; margin: 5px 0 0; letter-spacing: 3px; font-size: 12px; font-weight: bold;\">LUXURY HOTEL & SPA</p>" +
                    "</div>" +
                    "<div style=\"background-color: white; padding: 30px; border-radius: 5px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;\">" +
                    "<h2 style=\"color: #1a2b3c; font-size: 20px; margin-top: 0;\">Yêu cầu khôi phục mật khẩu</h2>" +
                    "<p style=\"color: #4a5568; line-height: 1.6;\">Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn.</p>" +
                    "<p style=\"color: #4a5568; line-height: 1.6;\">Mã OTP của bạn là:</p>" +
                    "<div style=\"margin: 30px 0;\">" +
                    "<span style=\"font-size: 32px; font-weight: bold; color: #8b6e45; letter-spacing: 5px; padding: 15px 30px; background-color: #f8f9fa; border: 2px dashed #8b6e45; border-radius: 5px;\">" + otp + "</span>" +
                    "</div>" +
                    "<p style=\"color: #e53e3e; font-size: 14px;\">Mã OTP này sẽ hết hạn trong vòng 5 phút.</p>" +
                    "<p style=\"color: #4a5568; font-size: 14px; margin-top: 20px;\">Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>" +
                    "</div>" +
                    "<div style=\"text-align: center; margin-top: 30px; color: #a0aec0; font-size: 12px;\">" +
                    "<p>© " + java.time.Year.now().getValue() + " LUMIÈRE GRAND HOTEL. All Rights Reserved.</p>" +
                    "</div>" +
                    "</div>";

            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("Gửi OTP THÀNH CÔNG tới: " + toEmail);
        } catch (Exception e) {
            System.err.println("Lỗi khi gửi OTP tới " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
}
