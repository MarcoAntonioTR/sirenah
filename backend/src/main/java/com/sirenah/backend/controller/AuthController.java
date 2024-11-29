package com.sirenah.backend.controller;

import com.sirenah.backend.dto.OurUserDTO;
import com.sirenah.backend.dto.ReqRes;
import com.sirenah.backend.service.impl.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ReqRes> signup (@RequestBody ReqRes signUpRequest) {
        return ResponseEntity.ok(authService.signUp(signUpRequest));

    }

    @PostMapping("/signin")
    public ResponseEntity<ReqRes> signin (@RequestBody ReqRes signInRequest) {
        return ResponseEntity.ok(authService.signIn(signInRequest));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ReqRes> refreshToken (@RequestBody ReqRes refreshTokenRequest) {
        return ResponseEntity.ok(authService.refreshToken(refreshTokenRequest));
    }

    @PostMapping("/VerificarEmail")
    public ResponseEntity<String> checkEmail(@RequestBody OurUserDTO email) {
        int status = authService.checkEmailExists(email.getEmail(), email.getId());
        if (status == 409) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El correo electrónico ya está en uso");
        }
        return ResponseEntity.ok("El correo electrónico está disponible");
    }

    @PostMapping("/VerificarDNI")
    public ResponseEntity<String> checkDni(@RequestBody OurUserDTO dni) {
        int status = authService.checkDniExists(dni.getDni(), dni.getId());
        if (status == 410) {
            return ResponseEntity.status(HttpStatus.GONE).body("Ya existe un usuario con el mismo DNI");
        }
        return ResponseEntity.ok("El DNI está disponible");
    }

}
