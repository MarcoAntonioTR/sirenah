package com.sirenah.backend.controller;

import com.sirenah.backend.dto.ReqRes;
import com.sirenah.backend.model.OurUsers;
import com.sirenah.backend.service.OurUserService;
import com.sirenah.backend.service.impl.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/Clientes")
public class ClienteController {

    @Autowired
    private OurUserService ourUserService;

    @Autowired
    private AuthService authService;

    @PutMapping("/Actualizar")
    public ResponseEntity<ReqRes> updateUser(@RequestBody ReqRes updateRequest) {
        return ResponseEntity.ok(authService.updateUser(updateRequest));
    }
}
