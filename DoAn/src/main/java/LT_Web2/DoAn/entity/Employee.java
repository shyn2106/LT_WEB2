package LT_Web2.DoAn.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    private String phone;

    private String email;

    private String position;

    private Double salary;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
