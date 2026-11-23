package com.sanmarcos.citas.service;

import com.sanmarcos.citas.dto.CitaRequest;
import com.sanmarcos.citas.dto.CitaResponse;
import com.sanmarcos.citas.dto.ReprogramarCitaRequest;
import com.sanmarcos.citas.exception.ApiException;
import com.sanmarcos.citas.model.CitaMedica;
import com.sanmarcos.citas.repository.CitaRepository;
import com.sanmarcos.citas.security.UsuarioAutenticado;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CitaService {

    private final CitaRepository repository;

    public List<String> horasOcupadas(String fechaStr) {
        LocalDate fecha = parsearFecha(fechaStr);
        return repository.findByFecha(fecha).stream()
                .map(CitaMedica::getHora)
                .toList();
    }

    public CitaResponse crear(CitaRequest req, UsuarioAutenticado user) {
        LocalDate fecha = parsearFecha(req.getFecha());
        validarFechaYHoraFutura(fecha, req.getHora());

        if (repository.existsByFechaAndHora(fecha, req.getHora())) {
            throw new ApiException(HttpStatus.CONFLICT, "Este horario ya ha sido ocupado. Por favor seleccione otro.");
        }

        boolean esStaff = "ADMINISTRADOR".equals(user.getRol()) || "RECEPCIONISTA".equals(user.getRol());

        String nombreCliente;
        String emailCliente;
        Long usuarioId = null;

        if (esStaff && req.getNombreCliente() != null && !req.getNombreCliente().isBlank()) {
            nombreCliente = req.getNombreCliente().trim();
            emailCliente = (req.getEmailCliente() != null && !req.getEmailCliente().isBlank())
                    ? req.getEmailCliente().trim()
                    : "Agendamiento Manual (Recepción)";
        } else {
            usuarioId = user.getId();
            nombreCliente = (user.getNombre() != null && !user.getNombre().isBlank())
                    ? user.getNombre()
                    : user.getEmail();
            emailCliente = user.getEmail();
        }

        CitaMedica cita = new CitaMedica();
        cita.setUsuarioId(usuarioId);
        cita.setNombreCliente(nombreCliente);
        cita.setEmailCliente(emailCliente);
        cita.setServicio(req.getServicio().trim());
        cita.setTipoMascota(req.getTipoMascota().trim());
        cita.setFecha(fecha);
        cita.setHora(req.getHora());

        return aResponse(repository.save(cita));
    }

    public List<CitaResponse> listar(UsuarioAutenticado user) {
        boolean esStaff = "ADMINISTRADOR".equals(user.getRol()) || "RECEPCIONISTA".equals(user.getRol());
        List<CitaMedica> lista = esStaff
                ? repository.findAllByOrderByFechaAscHoraAsc()
                : repository.findByEmailClienteIgnoreCaseOrderByFechaAscHoraAsc(user.getEmail());

        return lista.stream().map(this::aResponse).toList();
    }

    public CitaResponse reprogramar(Long id, ReprogramarCitaRequest req) {
        CitaMedica cita = buscar(id);
        LocalDate nuevaFecha = parsearFecha(req.getFecha());
        validarFechaYHoraFutura(nuevaFecha, req.getHora());

        if (repository.existsByFechaAndHoraAndIdNot(nuevaFecha, req.getHora(), id)) {
            throw new ApiException(HttpStatus.CONFLICT, "Ya existe otra cita agendada en ese mismo día y horario.");
        }

        cita.setFecha(nuevaFecha);
        cita.setHora(req.getHora());
        return aResponse(repository.save(cita));
    }

    public void cancelar(Long id, UsuarioAutenticado user) {
        CitaMedica cita = buscar(id);
        boolean esStaff = "ADMINISTRADOR".equals(user.getRol()) || "RECEPCIONISTA".equals(user.getRol());

        if (!esStaff && !cita.getEmailCliente().equalsIgnoreCase(user.getEmail())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "No puedes cancelar citas de otro cliente.");
        }

        repository.delete(cita);
    }

    private CitaMedica buscar(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Cita médica no encontrada."));
    }

    private LocalDate parsearFecha(String fechaStr) {
        try {
            return LocalDate.parse(fechaStr);
        } catch (Exception e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Formato de fecha inválido.");
        }
    }

    private void validarFechaYHoraFutura(LocalDate fecha, String horaStr) {
        LocalDate hoy = LocalDate.now();
        if (fecha.isBefore(hoy)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "No puedes programar una cita en una fecha pasada.");
        }
        if (fecha.isEqual(hoy)) {
            LocalTime hora = LocalTime.parse(horaStr);
            if (!hora.isAfter(LocalTime.now())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "No puedes seleccionar un horario que ya pasó hoy.");
            }
        }
    }

    private CitaResponse aResponse(CitaMedica c) {
        CitaResponse res = new CitaResponse();
        res.setId(c.getId());
        res.setUsuarioId(c.getUsuarioId());
        res.setNombreCliente(c.getNombreCliente());
        res.setEmailCliente(c.getEmailCliente());
        res.setServicio(c.getServicio());
        res.setTipoMascota(c.getTipoMascota());
        res.setFecha(c.getFecha().toString());
        res.setHora(c.getHora());
        return res;
    }
}