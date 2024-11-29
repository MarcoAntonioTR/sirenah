package com.sirenah.backend.service.impl;

import java.util.HashMap;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sirenah.backend.dto.ReqRes;
import com.sirenah.backend.model.OurUsers;
import com.sirenah.backend.repository.OurUserRepository;

@Service
public class AuthService {

    @Autowired
    private OurUserRepository ourUserRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    public ReqRes signUp(ReqRes registrationRequest) {
        ReqRes resp = new ReqRes();
        try {
            Optional<OurUsers> existingUser = ourUserRepository.findByEmail(registrationRequest.getEmail());
            if (existingUser.isPresent()) {
                resp.setStatuscode(409);
                return resp;
            }
            Optional<OurUsers> existingDniUser = ourUserRepository.findByDni(registrationRequest.getOurUsers().getDni());
            if (existingDniUser.isPresent()) {
                resp.setStatuscode(410);
                return resp;
            }


            // Proceso de registro si el correo y DNI están disponibles
            OurUsers ourUsers = new OurUsers();
            ourUsers.setEmail(registrationRequest.getEmail());
            ourUsers.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            ourUsers.setRole(registrationRequest.getRole());
            ourUsers.setNombre(registrationRequest.getName());
            ourUsers.setApellido(registrationRequest.getOurUsers().getApellido());
            ourUsers.setDni(registrationRequest.getOurUsers().getDni());
            ourUsers.setTelefono(registrationRequest.getOurUsers().getTelefono());
            ourUsers.setFecha_nacimiento(registrationRequest.getOurUsers().getFecha_nacimiento());

            OurUsers ourUsersResult = ourUserRepository.save(ourUsers);

            if (ourUsersResult != null && ourUsersResult.getId() > 0) {
                resp.setOurUsers(ourUsersResult);
                resp.setMessage("Usuario Registrado Correctamente");
                resp.setStatuscode(200);
            }
        } catch (Exception e) {
            resp.setStatuscode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }


    public ReqRes signIn(ReqRes signInRequest) {
        ReqRes response = new ReqRes();
        try {
            // Verificar si el usuario existe antes de autenticar
            var user = ourUserRepository.findByEmail(signInRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con el email: " + signInRequest.getEmail()));

            // Si el usuario existe, proceder con la autenticación
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signInRequest.getEmail(), signInRequest.getPassword())
            );
    
            // Generar tokens JWT
            var jwt = jwtUtils.generateToken(user, user.getRole());
            var refreshToken = jwtUtils.generateRefreashToken(new HashMap<>(), user);

            // Respuesta exitosa
            response.setStatuscode(200);
            response.setToken(jwt);
            response.setRefreshToken(refreshToken);
            response.setEspirationTime("24hrs");
            response.setMessage("Inicio de sesión exitoso");

        } catch (BadCredentialsException e) {
            // Manejo de error de credenciales incorrectas
            response.setStatuscode(401);
            response.setError("Credenciales incorrectas. Por favor, verifica tu email y contraseña.");
        } catch (UsernameNotFoundException e) {
            // Manejo de error de usuario no encontrado
            response.setStatuscode(404);
            response.setError("Usuario no existe. Verifica tu correo electrónico o regístrate.");
        } catch (Exception e) {
            // Manejo de otros errores genéricos
            response.setStatuscode(500);
            response.setError("Error del servidor: " + e.getMessage());
        }
        return response;
    }


    public ReqRes updateUser(ReqRes updateRequest) {
        ReqRes resp = new ReqRes();
        try {
            Optional<OurUsers> existingUserOpt = ourUserRepository.findById(updateRequest.getOurUsers().getId());
            if (existingUserOpt.isEmpty()) {
                resp.setStatuscode(408);
                resp.setMessage("Usuario no encontrado");
                return resp;
            }

            OurUsers userToUpdate = existingUserOpt.get();

            if (updateRequest.getName() != null) userToUpdate.setNombre(updateRequest.getName());
            if (updateRequest.getEmail() != null) {
                Optional<OurUsers> emailUser = ourUserRepository.findByEmail(updateRequest.getEmail());
                if (emailUser.isPresent() && !emailUser.get().getId().equals(userToUpdate.getId())) {
                    resp.setStatuscode(409);
                    resp.setMessage("El correo electrónico ya está en uso por otro usuario");
                    return resp;
                }
                userToUpdate.setEmail(updateRequest.getEmail());
            }

            if (updateRequest.getOurUsers().getApellido() != null) userToUpdate.setApellido(updateRequest.getOurUsers().getApellido());
            if (updateRequest.getOurUsers().getDni() != null) {
                Optional<OurUsers> dniUser = ourUserRepository.findByDni(updateRequest.getOurUsers().getDni());
                if (dniUser.isPresent() && !dniUser.get().getId().equals(userToUpdate.getId())) {
                    resp.setStatuscode(410);
                    resp.setMessage("Ya hay un usuario con el DNI registrado");
                    return resp;
                }
                userToUpdate.setDni(updateRequest.getOurUsers().getDni());
            }

            if (updateRequest.getOurUsers().getTelefono() != null) userToUpdate.setTelefono(updateRequest.getOurUsers().getTelefono());
            if (updateRequest.getOurUsers().getFecha_nacimiento() != null) userToUpdate.setFecha_nacimiento(updateRequest.getOurUsers().getFecha_nacimiento());

            ourUserRepository.save(userToUpdate);

            resp.setStatuscode(200);
            resp.setMessage("Usuario actualizado correctamente");
            resp.setOurUsers(userToUpdate);

        } catch (Exception e) {
            resp.setStatuscode(500);
            resp.setError("Error al actualizar usuario: " + e.getMessage());
        }
        return resp;
    }


    public ReqRes deleteUser(ReqRes updateRequest) {
        ReqRes resp = new ReqRes();
        try {
            Optional<OurUsers> existingUser = ourUserRepository.findById(updateRequest.getOurUsers().getId());

            if (!existingUser.isPresent()) {
                resp.setStatuscode(408);
                resp.setMessage("Usuario no encontrado");
                return resp;
            }

            OurUsers userDelete = existingUser.get();
            OurUsers reqUser = updateRequest.getOurUsers();

            if (reqUser != null) {
                userDelete.setEstado(false);
            }
            OurUsers deactivatedUser = ourUserRepository.save(userDelete);
            resp.setOurUsers(deactivatedUser);
            resp.setMessage("Usuario desactivado correctamente");
            resp.setStatuscode(200);

        } catch (Exception e) {
            resp.setStatuscode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }


    public ReqRes refreshToken (ReqRes refreshTokenRequest) {
        ReqRes response = new ReqRes();
        String ourEmail = jwtUtils.extractUsername(refreshTokenRequest.getToken());
        OurUsers users = ourUserRepository.findByEmail(ourEmail).orElseThrow();
        if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), users)) {
            var jwt = jwtUtils.generateToken(users, users.getRole());
            response.setStatuscode(200);
            response.setToken(jwt);
            response.setRefreshToken(refreshTokenRequest.getToken());
            response.setEspirationTime("24hrs");
            response.setMessage("Token Actualizado Exitosamente  ");
        }
        response.setStatuscode(500);
        return response;
    }
    public int checkEmailExists(String email, int userId) {
        Optional<OurUsers> existingUser = ourUserRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            OurUsers user = existingUser.get();
            if (!user.getId().equals(userId)) {
                return 409;
            }
        }
        return 200;
    }


    public int checkDniExists(String dni, int userId) {
        Optional<OurUsers> existingDniUser = ourUserRepository.findByDni(dni);

        if (existingDniUser.isPresent()) {
            OurUsers user = existingDniUser.get();
            if (!user.getId().equals(userId)) {
                return 410;
            }
        }
        return 200;
    }



}
