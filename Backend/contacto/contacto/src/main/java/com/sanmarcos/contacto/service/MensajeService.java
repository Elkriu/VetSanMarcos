package com.sanmarcos.contacto.service;

import com.sanmarcos.contacto.dto.MensajeRequest;
import com.sanmarcos.contacto.dto.MensajeResponse;
import com.sanmarcos.contacto.exception.ApiException;
import com.sanmarcos.contacto.model.MensajeContacto;
import com.sanmarcos.contacto.repository.MensajeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MensajeService {

    private final MensajeRepository repository;

    public MensajeResponse crear(MensajeRequest req) {
        MensajeContacto nuevo = new MensajeContacto();
        nuevo.setNombre(req.getNombre().trim());
        nuevo.setEmail(req.getEmail().trim().toLowerCase());
        nuevo.setComentario(req.getComentario().trim());
        nuevo.setLeido(false);
        return aResponse(repository.save(nuevo));
    }

    public List<MensajeResponse> listar() {
        return repository.findAllByOrderByFechaEnvioDesc().stream()
                .map(this::aResponse)
                .toList();
    }

    public MensajeResponse obtenerPorId(Long id) {
        return aResponse(buscar(id));
    }

    public MensajeResponse actualizar(Long id, MensajeRequest req) {
        MensajeContacto msg = buscar(id);
        msg.setNombre(req.getNombre().trim());
        msg.setEmail(req.getEmail().trim().toLowerCase());
        msg.setComentario(req.getComentario().trim());
        return aResponse(repository.save(msg));
    }

    public MensajeResponse alternarLeido(Long id) {
        MensajeContacto msg = buscar(id);
        msg.setLeido(!Boolean.TRUE.equals(msg.getLeido()));
        return aResponse(repository.save(msg));
    }

    public void eliminar(Long id) {
        MensajeContacto msg = buscar(id);
        repository.delete(msg);
    }

    private MensajeContacto buscar(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Mensaje no encontrado."));
    }

    private MensajeResponse aResponse(MensajeContacto m) {
        MensajeResponse res = new MensajeResponse();
        res.setId(m.getId());
        res.setNombre(m.getNombre());
        res.setEmail(m.getEmail());
        res.setComentario(m.getComentario());
        res.setLeido(m.getLeido());
        res.setFechaEnvio(m.getFechaEnvio());
        return res;
    }
}