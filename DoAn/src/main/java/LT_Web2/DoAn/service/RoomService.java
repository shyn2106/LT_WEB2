package LT_Web2.DoAn.service;

import LT_Web2.DoAn.entity.Room;
import java.util.List;

public interface RoomService {
    List<Room> getAllRooms();
    Room getRoomById(Long id);
    Room save(Room room);
    Room updateRoom(Long id, Room room);
    void delete(Long id);
}