package com.sanmarcos.inventario.repository;

import com.sanmarcos.inventario.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByActivoTrueOrderByIdAsc();
    Optional<Producto> findByIdAndActivoTrue(Long id);
}