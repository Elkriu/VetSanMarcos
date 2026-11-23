package com.sanmarcos.contacto.repository;

import com.sanmarcos.contacto.model.MensajeContacto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MensajeRepository extends JpaRepository<MensajeContacto, Long> {
    List<MensajeContacto> findAllByOrderByFechaEnvioDesc();
}