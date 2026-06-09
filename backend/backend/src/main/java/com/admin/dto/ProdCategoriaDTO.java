package com.admin.dto;

public record ProdCategoriaDTO(
        String nombreCategoria,
        Long cantidadProductosActivos,
        Double porcentajeActivos
) {
}