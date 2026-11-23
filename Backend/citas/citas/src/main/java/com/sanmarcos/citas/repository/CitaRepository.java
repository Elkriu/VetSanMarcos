package com.sanmarcos.citas.repository;

import com.sanmarcos.citas.model.CitaMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface CitaRepository extends JpaRepository<CitaMedica, Long> {
    List<CitaMedica> findAllByOrderByFechaAscHoraAsc();
    List<CitaMedica> findByEmailClienteIgnoreCaseOrderByFechaAscHoraAsc(String emailCliente);
    List<CitaMedica> findByFecha(LocalDate fecha);
    boolean existsByFechaAndHora(LocalDate fecha, String hora);
    boolean existsByFechaAndHoraAndIdNot(LocalDate fecha, String hora, Long id);
}