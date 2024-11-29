package com.sirenah.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OurUserDTO {

    private int id;
    private String dni;
    private String email;
    private String password;
}
