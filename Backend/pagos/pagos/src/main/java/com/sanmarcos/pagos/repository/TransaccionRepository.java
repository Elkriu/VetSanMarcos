package com.sanmarcos.pagos.repository;

import com.sanmarcos.pagos.model.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {
    List<Transaccion> findAllByOrderByIdDesc();
    List<Transaccion> findByClienteEmailIgnoreCaseOrderByIdDesc(String clienteEmail);
}