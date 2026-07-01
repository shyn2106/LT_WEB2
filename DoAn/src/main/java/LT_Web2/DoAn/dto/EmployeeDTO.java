package LT_Web2.DoAn.dto;

import lombok.Data;

@Data
public class EmployeeDTO {
    private Long id;
    private String fullName;
    private String phone;
    private String email;
    private String position;
    private Double salary;
    private Long userId; // ID của User liên kết
}
