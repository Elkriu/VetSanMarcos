package com.sanmarcos.usuarios.repository;

import com.sanmarcos.usuarios.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Login: busca al usuario por correo sin distinguir mayúsculas
    Optional<Usuario> findByEmailIgnoreCase(String email);

    // Registro y creación: validan que el correo y el RUN no existan
    boolean existsByEmailIgnoreCase(String email);

    boolean existsByRun(String run);

    // Edición: igual que lo anterior pero ignorando al propio usuario que se edita
    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);

    boolean existsByRunAndIdNot(String run, Long id);
}