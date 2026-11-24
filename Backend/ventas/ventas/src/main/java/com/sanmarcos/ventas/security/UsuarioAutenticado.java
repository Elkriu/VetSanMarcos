package com.sanmarcos.ventas.security;

import lombok.Data;

@Data
public class UsuarioAutenticado {
    private final Long id;
    private final String email;
    private final String nombre;
    private final String rol;
    private final String token;
}