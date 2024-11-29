package com.sirenah.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.sirenah.backend.model.OurUsers;
import com.sirenah.backend.model.Producto;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReqRes {

    private int statuscode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String espirationTime;
    private String name;
    private String email;
    private String role;
    private String password;
    private List<Producto> productos;
    private  OurUsers ourUsers;

}
