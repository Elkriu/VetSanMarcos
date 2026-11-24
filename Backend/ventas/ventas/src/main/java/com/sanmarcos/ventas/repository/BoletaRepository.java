package com.sanmarcos.ventas.repository;

import com.sanmarcos.ventas.model.Boleta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BoletaRepository extends JpaRepository<Boleta, Long> {
    List<Boleta> findAllByOrderByNumeroDesc();
    List<Boleta> findByClienteEmailIgnoreCaseOrderByNumeroDesc(String clienteEmail);
}