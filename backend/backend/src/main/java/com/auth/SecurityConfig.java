//package com.utils;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                // Deshabilitar CSRF para APIs usando el estilo lambda (no-deprecated)
//                .csrf(csrf -> csrf.disable())
//                // Habilitar CORS por si el frontend está en otro origen
//                .cors(cors -> {})
//                // Hacer la aplicación stateless (útil si usas tokens JWT)
//                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .authorizeHttpRequests(authz -> authz
//                        // Endpoints públicos
//                        .requestMatchers(
//                                "/api/auth/**",
//                                "/api/roles/**",
//                                "/v3/api-docs/**",
//                                "/swagger-ui/**",
//                                "/swagger-ui.html",
//                                "/",
//                                "/index.html",
//                                "/static/**",
//                                "/public/**"
//                        ).permitAll()
//                        // El resto requiere autenticación
//                        .anyRequest().authenticated()
//                )
//                // Proveer un mecanismo de autenticación por defecto (puedes retirar si usas filtros JWT)
//                .httpBasic(Customizer.withDefaults());
//
//        return http.build();
//    }
//
//    // PasswordEncoder por defecto para evitar errores al guardar/verificar contraseñas
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//}