package LT_Web2.DoAn.controller;

import LT_Web2.DoAn.config.VNPayConfig;
import LT_Web2.DoAn.entity.Booking;
import LT_Web2.DoAn.repository.BookingRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*") // Cho phép frontend gọi
public class PaymentController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private LT_Web2.DoAn.service.EmailService emailService;

    @org.springframework.beans.factory.annotation.Value("${vnpay.tmnCode}")
    private String vnp_TmnCode;

    @org.springframework.beans.factory.annotation.Value("${vnpay.hashSecret}")
    private String vnp_HashSecret;

    @org.springframework.beans.factory.annotation.Value("${vnpay.url}")
    private String vnp_PayUrl;

    @org.springframework.beans.factory.annotation.Value("${vnpay.returnUrl}")
    private String vnp_Returnurl;

    @GetMapping("/create_payment")
    public ResponseEntity<?> createPayment(HttpServletRequest request, 
                                           @RequestParam("amount") long amount, 
                                           @RequestParam("bookingId") Long bookingId) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        long amountInVND = amount * 100;
        
        // Dùng bookingId làm mã giao dịch (vnp_TxnRef) để lúc return xử lý cập nhật DB
        String vnp_TxnRef = VNPayConfig.getRandomNumber(8) + "-" + bookingId;
        String vnp_IpAddr = "127.0.0.1"; // Hardcode for localhost, normally get from request
        
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amountInVND));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh_toan_don_dat_phong_" + bookingId);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnp_Returnurl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
        
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                try {
                    // Build hash data
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    
                    // Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnp_PayUrl + "?" + queryUrl;

        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        response.put("message", "Successfully");
        response.put("url", paymentUrl);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/vnpay_return")
    public ResponseEntity<?> vnpayReturn(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                try {
                    hashData.append(fieldName);
                    hashData.append('=');
                    // Encode url đúng chuẩn VNPAY
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        hashData.append('&');
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        String signValue = VNPayConfig.hmacSHA512(vnp_HashSecret, hashData.toString());
        Map<String, Object> result = new HashMap<>();

        if (signValue.equals(vnp_SecureHash)) {
            String responseCode = request.getParameter("vnp_ResponseCode");
            String txnRef = request.getParameter("vnp_TxnRef"); // format: random-bookingId
            if ("00".equals(responseCode)) {
                // Success
                try {
                    String[] parts = txnRef.split("-");
                    Long bookingId = Long.parseLong(parts[1]);
                    Booking booking = bookingRepository.findById(bookingId).orElse(null);
                    if (booking != null) {
                        booking.setStatus("COMPLETED"); // Đã thanh toán và hoàn thành
                        bookingRepository.save(booking);

                        // Gửi email xác nhận thanh toán thành công
                        try {
                            if (booking.getCustomer() != null && booking.getCustomer().getEmail() != null && !booking.getCustomer().getEmail().isEmpty()) {
                                LT_Web2.DoAn.entity.User tempUser = new LT_Web2.DoAn.entity.User();
                                tempUser.setEmail(booking.getCustomer().getEmail());
                                tempUser.setFullName(booking.getCustomer().getFullName());
                                emailService.sendPaymentSuccessConfirmation(tempUser, booking);
                            } else if (booking.getUser() != null) {
                                emailService.sendPaymentSuccessConfirmation(booking.getUser(), booking);
                            }
                        } catch (Exception e) {
                            System.err.println("Lỗi khi gọi hàm gửi email thanh toán: " + e.getMessage());
                        }

                        result.put("status", "success");
                        result.put("message", "Payment successful, booking updated to COMPLETED.");
                    } else {
                        result.put("status", "error");
                        result.put("message", "Booking not found in DB with ID: " + bookingId);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    result.put("status", "error");
                    result.put("message", "Exception during DB update: " + e.getMessage());
                }
            } else {
                result.put("status", "failed");
                result.put("message", "Payment failed or cancelled (Code: " + responseCode + ")");
            }
        } else {
            result.put("status", "error");
            result.put("message", "Invalid signature");
        }
        return ResponseEntity.ok(result);
    }
}
