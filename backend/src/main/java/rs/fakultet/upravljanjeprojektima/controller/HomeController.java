package rs.fakultet.upravljanjeprojektima.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {
    
    @GetMapping("/")
    public Map<String, String> home() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Dobrodošli u Aplikaciju za Upravljanje Projektima!");
        response.put("version", "1.0.0");
        response.put("h2-console", "http://localhost:8080/h2-console");
        response.put("api-docs", "Dostupni endpoints: /api/auth, /api/korisnici, /api/projekti, /api/zadaci");
        return response;
    }
}