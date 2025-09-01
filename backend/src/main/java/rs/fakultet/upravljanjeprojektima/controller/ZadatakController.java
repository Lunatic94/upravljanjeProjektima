package rs.fakultet.upravljanjeprojektima.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rs.fakultet.upravljanjeprojektima.model.dto.KreirajZadatakRequest;
import rs.fakultet.upravljanjeprojektima.model.dto.ZadatakDTO;
import rs.fakultet.upravljanjeprojektima.model.enums.StatusZadatka;
import rs.fakultet.upravljanjeprojektima.service.ZadatakService;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/zadaci")
public class ZadatakController {
    
    @Autowired
    private ZadatakService zadatakService;
    
    @GetMapping
    public ResponseEntity<List<ZadatakDTO>> sviZadaci() {
        return ResponseEntity.ok(zadatakService.sviZadaci());
    }
    
    @GetMapping("/moji")
    public ResponseEntity<List<ZadatakDTO>> mojiZadaci() {
        return ResponseEntity.ok(zadatakService.zadaciKorisnika());
    }
    
    @GetMapping("/projekat/{projekatId}")
    public ResponseEntity<List<ZadatakDTO>> zadaciProjekta(@PathVariable Long projekatId) {
        return ResponseEntity.ok(zadatakService.zadaciProjekta(projekatId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ZadatakDTO> nadjiZadatak(@PathVariable Long id) {
        return ResponseEntity.ok(zadatakService.nadjiPoId(id));
    }
    
    @PostMapping
    public ResponseEntity<ZadatakDTO> kreirajZadatak(@Valid @RequestBody KreirajZadatakRequest request) {
        return ResponseEntity.ok(zadatakService.kreirajZadatak(request));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ZadatakDTO> azurirajZadatak(@PathVariable Long id, @RequestBody ZadatakDTO zadatakDTO) {
        return ResponseEntity.ok(zadatakService.azurirajZadatak(id, zadatakDTO));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<ZadatakDTO> azurirajStatusZadatka(@PathVariable Long id, @RequestParam StatusZadatka status) {
        return ResponseEntity.ok(zadatakService.azurirajStatus(id, status));
    }
    
    @PutMapping("/{id}/dodeli/{korisnikId}")
    public ResponseEntity<ZadatakDTO> dodeliZadatak(@PathVariable Long id, @PathVariable Long korisnikId) {
        return ResponseEntity.ok(zadatakService.dodeliZadatak(id, korisnikId));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> obrisiZadatak(@PathVariable Long id) {
        zadatakService.obrisiZadatak(id);
        return ResponseEntity.ok().body("{\"message\": \"Zadatak je obrisan!\"}");
    }
    
    @GetMapping("/pretraga")
    public ResponseEntity<List<ZadatakDTO>> pretragaZadataka(@RequestParam Long projekatId, @RequestParam String search) {
        return ResponseEntity.ok(zadatakService.pretraga(projekatId, search));
    }
    
    @GetMapping("/kasni")
    public ResponseEntity<List<ZadatakDTO>> kasniZadaci() {
        return ResponseEntity.ok(zadatakService.kasniZadaci());
    }
}