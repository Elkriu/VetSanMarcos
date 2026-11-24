package com.sanmarcos.inventario.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> manejarApi(ApiException ex) {
        return ResponseEntity.status(ex.getStatus()).body(
                new ErrorResponse(ex.getStatus().value(), ex.getMessage(), Map.of())
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> manejarValidacion(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(err -> errores.put(err.getField(), err.getDefaultMessage()));

        return ResponseEntity.badRequest().body(
                new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Datos inválidos en la solicitud.", errores)
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> manejarAccesoDenegado(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                new ErrorResponse(HttpStatus.FORBIDDEN.value(), "No tienes permisos para realizar esta acción.", Map.of())
        );
    }
}