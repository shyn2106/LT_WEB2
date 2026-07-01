package LT_Web2.DoAn.service;

import LT_Web2.DoAn.entity.Booking;
import java.util.List;

public interface BookingService {
    List<Booking> getAllBookings();
    List<Booking> getBookingsByUserId(Long userId);
    Booking getBookingById(Long id);
    Booking saveBooking(Booking booking);
    Booking updateBooking(Long id, Booking booking);
    void deleteBooking(Long id);
}