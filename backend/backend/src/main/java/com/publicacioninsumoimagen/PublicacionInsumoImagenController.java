package com.publicacioninsumoimagen;

import com.cloudinary.CloudinaryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/imagenes")
public class PublicacionInsumoImagenController {

    private final CloudinaryService cloudinaryService;

    public PublicacionInsumoImagenController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "El archivo de imagen no puede estar vacío");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            Map<?, ?> uploadResult = cloudinaryService.upload(file);
            String secureUrl = (String) uploadResult.get("secure_url");

            Map<String, String> response = new HashMap<>();
            response.put("url", secureUrl);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al subir la imagen: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
