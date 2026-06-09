package com.reporte;

import com.dto.ReportePublicacionRequest;
import com.dto.ReporteUsuarioRequest;
import com.jwt.JwtService;
import com.reporte.dto.ReporteDTO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;
    private final JwtService jwtService;

    @PostMapping("/publicacion")
    public ResponseEntity<Void> reportarPublicacion(
            @RequestBody ReportePublicacionRequest request,
            HttpServletRequest httpRequest
    ) {

        String token = httpRequest
                .getHeader("Authorization")
                .replace("Bearer ", "");

        String email = jwtService.extractEmail(token);

        reporteService.crearReportePublicacion(
                email,
                request
        );

        return ResponseEntity.ok().build();
    }

    @PostMapping("/usuario")
    public ResponseEntity<Void> reportarUsuario(
            @RequestBody ReporteUsuarioRequest request,
            HttpServletRequest httpRequest
    ) {

        String token = httpRequest
                .getHeader("Authorization")
                .replace("Bearer ", "");

        String email = jwtService.extractEmail(token);

        reporteService.crearReporteUsuario(
                email,
                request
        );

        return ResponseEntity.ok().build();
    }
    @GetMapping
    public ResponseEntity<List<ReporteDTO>> listarReportes() {
        return ResponseEntity.ok(
                reporteService.obtenerTodosLosReportes()
        );
    }
}