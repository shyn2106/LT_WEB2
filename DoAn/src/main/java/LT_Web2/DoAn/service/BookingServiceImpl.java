package LT_Web2.DoAn.service;

import LT_Web2.DoAn.entity.Booking;
import LT_Web2.DoAn.repository.BookingRepository;
import LT_Web2.DoAn.entity.User;
import LT_Web2.DoAn.entity.Customer;
import LT_Web2.DoAn.repository.UserRepository;
import LT_Web2.DoAn.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final EmailService emailService;

    public BookingServiceImpl(BookingRepository bookingRepository, UserRepository userRepository, CustomerRepository customerRepository, EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.emailService = emailService;
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Override
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    @Override
    public Booking saveBooking(Booking booking) {
        if (booking.getCustomer() != null) {
            customerRepository.save(booking.getCustomer());
        }
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Gửi email xác nhận
        if (savedBooking.getCustomer() != null && savedBooking.getCustomer().getEmail() != null && !savedBooking.getCustomer().getEmail().isEmpty()) {
            User tempUser = new User();
            tempUser.setEmail(savedBooking.getCustomer().getEmail());
            tempUser.setFullName(savedBooking.getCustomer().getFullName());
            emailService.sendBookingConfirmation(tempUser, savedBooking);
        } else if (savedBooking.getUser() != null) {
            Optional<User> userOpt = userRepository.findById(savedBooking.getUser().getId());
            userOpt.ifPresent(user -> emailService.sendBookingConfirmation(user, savedBooking));
        }

        return savedBooking;
    }

    @Override
    public Booking updateBooking(Long id, Booking booking) {
        if (bookingRepository.existsById(id)) {
            booking.setId(id);
            return bookingRepository.save(booking);
        }
        return null;
    }

    @Override
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}
