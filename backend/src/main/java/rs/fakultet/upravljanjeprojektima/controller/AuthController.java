package rs.fakultet.upravljanjeprojektima.controller;

import jakarta.validation.Valid;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import rs.fakultet.upravljanjeprojektima.model.dto.JwtResponse;
import rs.fakultet.upravljanjeprojektima.model.dto.PrijavaRequest;
import rs.fakultet.upravljanjeprojektima.model.dto.RegistracijaRequest;
import rs.fakultet.upravljanjeprojektima.security.JwtUtils;
import rs.fakultet.upravljanjeprojektima.security.UserDetailsImpl;
import rs.fakultet.upravljanjeprojektima.service.KorisnikService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    AuthenticationManager authenticationManager;
    
    @Autowired
    KorisnikService korisnikService;
    
    @Autowired
    JwtUtils jwtUtils;
    
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody PrijavaRequest prijavaRequest) {
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(prijavaRequest.getKorisnickoIme(), prijavaRequest.getLozinka()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(prijavaRequest.getKorisnickoIme());
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        if (!userDetails.isAktivan()) {
            return ResponseEntity.badRequest().body("{\"error\": \" Vaš nalog je deaktiviran. Obratite se administratoru. \"}");
        }
        
        return ResponseEntity.ok(new JwtResponse(jwt,
                                               userDetails.getId(),
                                               userDetails.getUsername(),
                                               userDetails.getEmail(),
                                               userDetails.getUsername(),
                                               userDetails.getIme(),
                                               userDetails.getPrezime(),
                                               Boolean.toString(userDetails.isAktivan()), // Možete dodati ime i prezime
                                               userDetails.getAuthorities().iterator().next().getAuthority()));
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegistracijaRequest registracijaRequest) {
        try {
            korisnikService.kreirajKorisnika(registracijaRequest);
            return ResponseEntity.ok().body("{\"message\": \"Korisnik je uspešno registrovan!\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}