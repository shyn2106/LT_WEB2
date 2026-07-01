package LT_Web2.DoAn.repository;

import LT_Web2.DoAn.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {
    
    @Query("SELECT DISTINCT rt FROM RoomType rt JOIN Room r ON r.roomType = rt WHERE r.id NOT IN (" +
           "SELECT b.room.id FROM Booking b WHERE b.room IS NOT NULL AND " +
           "(b.checkInDate < :checkOut AND b.checkOutDate > :checkIn) " +
           "AND b.status != 'CANCELLED')")
    List<RoomType> findAvailableRoomTypes(@Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);
}