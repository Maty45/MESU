package com.usuario.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioUpdateDTO {

        private Long dni;
        private String nombre;
        private String apellido;
        private String email;
        private Long telefono;

}