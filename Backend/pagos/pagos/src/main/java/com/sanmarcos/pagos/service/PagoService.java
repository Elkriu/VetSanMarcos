package com.sanmarcos.pagos.service;

import com.sanmarcos.pagos.dto.PagoRequest;
import com.sanmarcos.pagos.dto.PagoResponse;
import com.sanmarcos.pagos.exception.ApiException;
import com.sanmarcos.pagos.model.Transaccion;
import com.sanmarcos.pagos.repository.TransaccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PagoService {

    private static final DateTimeFormatter FORMATO_FECHA = DateTimeFormatter.ofPattern("dd-MM-yyyy, HH:mm");
    private final TransaccionRepository repository;

    public PagoResponse procesarPago(PagoRequest req, String clienteEmail) {
        boolean rechazada = "0000".equals(req.getTarjeta());

        Transaccion tx = new Transaccion();
        tx.setClienteEmail(clienteEmail);
        tx.setMonto(req.getMonto());
        tx.setTarjeta(req.getTarjeta());
        tx.setEstado(rechazada ? "RECHAZADO" : "APROBADO");
        tx.setMotivo(rechazada
                ? "Pago rechazado por el banco emisor (tarjeta terminada en 0000)."
                : "Transacción aprobada correctamente.");

        Transaccion guardada = repository.save(tx);

        if (rechazada) {
            throw new ApiException(HttpStatus.PAYMENT_REQUIRED, guardada.getMotivo());
        }

        return aResponse(guardada);
    }

    public List<PagoResponse> listar(String email, boolean esStaff) {
        List<Transaccion> lista = esStaff
                ? repository.findAllByOrderByIdDesc()
                : repository.findByClienteEmailIgnoreCaseOrderByIdDesc(email);
        return lista.stream().map(this::aResponse).toList();
    }

    private PagoResponse aResponse(Transaccion t) {
        PagoResponse res = new PagoResponse();
        res.setId(t.getId());
        res.setFecha(t.getFecha().format(FORMATO_FECHA));
        res.setClienteEmail(t.getClienteEmail());
        res.setMonto(t.getMonto());
        res.setTarjeta(t.getTarjeta());
        res.setEstado(t.getEstado());
        res.setMotivo(t.getMotivo());
        return res;
    }
}