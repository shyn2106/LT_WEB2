package LT_Web2.DoAn.dto;

import lombok.Data;

@Data
public class ServiceDTO {
    private Long id;
    private String serviceName;
    private Double price;
    private String description;
    private Boolean status;
}
