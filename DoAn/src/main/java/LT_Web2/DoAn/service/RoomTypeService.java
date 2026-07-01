package LT_Web2.DoAn.service;

import LT_Web2.DoAn.entity.RoomType;
import java.time.LocalDate;
import java.util.List;

public interface RoomTypeService {
    List<RoomType> getAllRoomTypes();
    List<RoomType> getAvailableRoomTypes(LocalDate checkIn, LocalDate checkOut);
    RoomType getRoomTypeById(Long id);
    RoomType saveRoomType(RoomType roomType);
    RoomType updateRoomType(Long id, RoomType roomType);
    void deleteRoomType(Long id);
}