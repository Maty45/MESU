package com.dto;

public record RegisterRequest(String dni,
                              String nombre,
                              String apellido,
                              String email,
                              String password,
                              String telefono) {
}
