package LT_Web2.DoAn.service;

import LT_Web2.DoAn.dto.ServiceDTO;
import LT_Web2.DoAn.entity.Service;
import LT_Web2.DoAn.repository.ServiceRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class ServiceServiceImpl implements ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    private ServiceDTO convertToDTO(Service entity) {
        ServiceDTO dto = new ServiceDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    private Service convertToEntity(ServiceDTO dto) {
        Service entity = new Service();
        BeanUtils.copyProperties(dto, entity);
        return entity;
    }

    @Override
    public List<ServiceDTO> getAllServices() {
        return serviceRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ServiceDTO getServiceById(Long id) {
        Service entity = serviceRepository.findById(id).orElse(null);
        return entity != null ? convertToDTO(entity) : null;
    }

    @Override
    public ServiceDTO createService(ServiceDTO serviceDTO) {
        Service entity = convertToEntity(serviceDTO);
        Service savedEntity = serviceRepository.save(entity);
        return convertToDTO(savedEntity);
    }

    @Override
    public ServiceDTO updateService(Long id, ServiceDTO serviceDTO) {
        if (serviceRepository.existsById(id)) {
            Service entity = convertToEntity(serviceDTO);
            entity.setId(id);
            Service savedEntity = serviceRepository.save(entity);
            return convertToDTO(savedEntity);
        }
        return null;
    }

    @Override
    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
}
