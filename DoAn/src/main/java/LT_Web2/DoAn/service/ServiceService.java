package LT_Web2.DoAn.service;

import LT_Web2.DoAn.dto.ServiceDTO;
import java.util.List;

public interface ServiceService {
    List<ServiceDTO> getAllServices();
    ServiceDTO getServiceById(Long id);
    ServiceDTO createService(ServiceDTO serviceDTO);
    ServiceDTO updateService(Long id, ServiceDTO serviceDTO);
    void deleteService(Long id);
}
