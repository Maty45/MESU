package com.dto;

import java.util.List;

public record LoginResponse(
        String token,
        String nombre,
        String apellido,
        String email,
        List<String> roles
) {}
