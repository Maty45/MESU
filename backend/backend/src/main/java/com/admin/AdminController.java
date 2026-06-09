package com.admin;

import com.admin.dto.MetricasDTO;
import com.admin.dto.OperacionesMesDTO;
import com.admin.dto.ProdCategoriaDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin") // Correctly define the base path
public class AdminController {

        private final AdminService adminService;

        public AdminController(AdminService adminService) {
            this.adminService = adminService;
        }

        @GetMapping("/metricas")
        public ResponseEntity<MetricasDTO> getMetricas() {
            try {
                return new ResponseEntity<>(adminService.getMetricas(), HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        @GetMapping("/meses")
        public ResponseEntity<OperacionesMesDTO> getOperacionesMes() {
            try {
                return new ResponseEntity<>(adminService.getOperacionesMes(), HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        @GetMapping("/productos-categoria")
        public ResponseEntity<List<ProdCategoriaDTO>> getPorcentajeProductosActivosPorCategoria() {
            try {
                return new ResponseEntity<>(adminService.getPorcentajeProductosActivosPorCategoria(), HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
}