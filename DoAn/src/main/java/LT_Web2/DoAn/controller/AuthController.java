package LT_Web2.DoAn.controller;

import LT_Web2.DoAn.dto.JwtResponse;
import LT_Web2.DoAn.dto.LoginRequest;
import LT_Web2.DoAn.dto.MessageResponse;
import LT_Web2.DoAn.dto.SignupRequest;
import LT_Web2.DoAn.entity.Role;
import LT_Web2.DoAn.entity.User;
import LT_Web2.DoAn.repository.UserRepository;
import LT_Web2.DoAn.security.CustomUserDetails;
import LT_Web2.DoAn.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    LT_Web2.DoAn.service.EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElse(new User());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getAuthorities().iterator().next().getAuthority(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.findByUsername(signUpRequest.getUsername()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Create new user's account
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        
        // Default role is CUSTOMER if not specified
        if (signUpRequest.getRole() != null && signUpRequest.getRole().equalsIgnoreCase("ADMIN")) {
            user.setRole(Role.ADMIN);
        } else {
            user.setRole(Role.CUSTOMER);
        }

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody LT_Web2.DoAn.dto.ForgotPasswordRequest request) {
        java.util.Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (!userOptional.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Không tìm thấy tài khoản với email này!"));
        }

        User user = userOptional.get();
        
        // Sinh mã OTP 6 số ngẫu nhiên
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        
        user.setResetOtp(otp);
        user.setResetOtpExpiry(java.time.LocalDateTime.now().plusMinutes(5)); // Hết hạn sau 5 phút
        userRepository.save(user);

        // Gửi email
        emailService.sendPasswordResetOtp(user.getEmail(), otp);

        return ResponseEntity.ok(new MessageResponse("Mã OTP đã được gửi đến email của bạn!"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody LT_Web2.DoAn.dto.ResetPasswordRequest request) {
        java.util.Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (!userOptional.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Không tìm thấy tài khoản!"));
        }

        User user = userOptional.get();

        // Kiểm tra OTP
        if (user.getResetOtp() == null || !user.getResetOtp().equals(request.getOtp())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Mã OTP không chính xác!"));
        }

        // Kiểm tra hạn sử dụng
        if (user.getResetOtpExpiry() == null || user.getResetOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Mã OTP đã hết hạn!"));
        }

        // Cập nhật mật khẩu mới
        user.setPassword(encoder.encode(request.getNewPassword()));
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Đặt lại mật khẩu thành công!"));
    }
}
