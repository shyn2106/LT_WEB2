package LT_Web2.DoAn.service;

import LT_Web2.DoAn.entity.RoomType;
import LT_Web2.DoAn.repository.RoomTypeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class RoomTypeServiceImpl implements RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;

    public RoomTypeServiceImpl(RoomTypeRepository roomTypeRepository) {
        this.roomTypeRepository = roomTypeRepository;
    }

    @Override
    public List<RoomType> getAllRoomTypes() {
        return roomTypeRepository.findAll();
    }

    @Override
    public List<RoomType> getAvailableRoomTypes(LocalDate checkIn, LocalDate checkOut) {
        return roomTypeRepository.findAvailableRoomTypes(checkIn, checkOut);
    }

    @Override
    public RoomType getRoomTypeById(Long id) {
        return roomTypeRepository.findById(id).orElse(null);
    }

    @Override
    public RoomType saveRoomType(RoomType roomType) {
        return roomTypeRepository.save(roomType);
    }

    @Override
    public RoomType updateRoomType(Long id, RoomType roomType) {
        if (roomTypeRepository.existsById(id)) {
            roomType.setId(id);
            return roomTypeRepository.save(roomType);
        }
        return null;
    }

    @Override
    public void deleteRoomType(Long id) {
        roomTypeRepository.deleteById(id);
    }
}
