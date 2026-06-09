package com.admin.dto;

import jakarta.validation.constraints.NotNull;

public record MetricasDTO(@NotNull
                          Long cantUser,
                          @NotNull
                          Long cantOpMensual,
                          @NotNull
                          Long prodActivos,
                          @NotNull
                          Long cantReportes
) { }
