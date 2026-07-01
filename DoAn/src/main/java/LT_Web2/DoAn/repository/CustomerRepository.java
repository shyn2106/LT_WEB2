package LT_Web2.DoAn.repository;

import LT_Web2.DoAn.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}