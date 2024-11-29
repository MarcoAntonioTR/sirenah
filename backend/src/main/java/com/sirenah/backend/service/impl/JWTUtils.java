package com.sirenah.backend.service.impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

@Component
public class JWTUtils {
    private SecretKey Key;
    private static final long EXPIRATION_TIME = 86400000; //24hrs

    public JWTUtils() {
        String secreteString = "awfawfawdf241412821h8e8r1qwhfawhf8wa08rea8ehadwhawd8aw8eq9e98eqw97rq79r79r89rq9r";
        byte[] keyBytes = Base64.getDecoder().decode(secreteString.getBytes(StandardCharsets.UTF_8));
        this.Key = new SecretKeySpec(keyBytes,"HmacSHA256");
    }
    public  String generateToken(UserDetails userDetails, String role) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("role",role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(Key)
                .compact();
    }
    public  String generateRefreashToken(HashMap<String,Object> claims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(Key)
                .compact();
    }
    public String extractUsername (String token){
        return extractClaims(token, Claims::getSubject);
    }
    public String extractRole(String token) {
        return extractClaims(token, claims -> claims.get("role", String.class)); // Extrae el rol
    }
    public <T> T extractClaims(String token, Function<Claims,T> claimsTFunction){
        return claimsTFunction.apply(Jwts.parser().verifyWith(Key).build().parseSignedClaims(token).getPayload());
    }

    public  boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())&&!isTokenExpired(token));
    }
    public boolean isTokenExpired(String token){
        return extractClaims(token, Claims::getExpiration).before(new Date());
    }

}
