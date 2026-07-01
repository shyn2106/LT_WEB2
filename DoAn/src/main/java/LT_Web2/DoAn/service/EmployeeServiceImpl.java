package LT_Web2.DoAn.service;

import LT_Web2.DoAn.dto.EmployeeDTO;
import LT_Web2.DoAn.entity.Employee;
import LT_Web2.DoAn.entity.User;
import LT_Web2.DoAn.repository.EmployeeRepository;
import LT_Web2.DoAn.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    private EmployeeDTO convertToDTO(Employee entity) {
        EmployeeDTO dto = new EmployeeDTO();
        BeanUtils.copyProperties(entity, dto);
        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getId());
        }
        return dto;
    }

    private Employee convertToEntity(EmployeeDTO dto) {
        Employee entity = new Employee();
        BeanUtils.copyProperties(dto, entity);
        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User không tồn tại với id: " + dto.getUserId()));
            entity.setUser(user);
        }
        return entity;
    }

    @Override
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDTO getEmployeeById(Long id) {
        Employee entity = employeeRepository.findById(id).orElse(null);
        return entity != null ? convertToDTO(entity) : null;
    }

    @Override
    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {
        Employee entity = convertToEntity(employeeDTO);
        Employee savedEntity = employeeRepository.save(entity);
        return convertToDTO(savedEntity);
    }

    @Override
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
        if (employeeRepository.existsById(id)) {
            Employee entity = convertToEntity(employeeDTO);
            entity.setId(id);
            Employee savedEntity = employeeRepository.save(entity);
            return convertToDTO(savedEntity);
        }
        return null;
    }

    @Override
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
}
