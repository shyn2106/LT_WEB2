package LT_Web2.DoAn.repository;

import LT_Web2.DoAn.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
}