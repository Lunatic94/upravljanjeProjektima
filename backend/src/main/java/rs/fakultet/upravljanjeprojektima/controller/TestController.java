package rs.fakultet.upravljanjeprojektima.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @GetMapping("/hello")
    public Map<String, String> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Aplikacija radi!");
        response.put("status", "OK");
        return response;
    }
    @GetMapping("/h2-info")
    public Map<String, String> h2Info() {
        Map<String, String> response = new HashMap<>();
        response.put("h2-console-url", "http://localhost:8080/h2-console");
        response.put("jdbc-url", "jdbc:h2:mem:testdb");
        response.put("username", "sa");
        response.put("password", "");
        return response;
    }
}