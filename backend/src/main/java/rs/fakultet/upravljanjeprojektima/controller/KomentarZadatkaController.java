package rs.fakultet.upravljanjeprojektima.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rs.fakultet.upravljanjeprojektima.model.dto.KomentarZadatkaDTO;
import rs.fakultet.upravljanjeprojektima.model.dto.KreirajKomentarRequest;
import rs.fakultet.upravljanjeprojektima.service.KomentarZadatkaService;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/zadaci/{zadatakId}/komentari")
public class KomentarZadatkaController {
    
    @Autowired
    private KomentarZadatkaService komentarZadatkaService;
    
    @GetMapping
    public ResponseEntity<List<KomentarZadatkaDTO>> komentariZadatka(@PathVariable Long zadatakId) {
        return ResponseEntity.ok(komentarZadatkaService.komentariZadatka(zadatakId));
    }
    
    @PostMapping
    public ResponseEntity<KomentarZadatkaDTO> dodajKomentar(@PathVariable Long zadatakId, 
                                                           @Valid @RequestBody KreirajKomentarRequest request) {
        return ResponseEntity.ok(komentarZadatkaService.dodajKomentar(zadatakId, request));
    }
    
    @PutMapping("/{komentarId}")
    public ResponseEntity<KomentarZadatkaDTO> azurirajKomentar(@PathVariable Long zadatakId,
                                                              @PathVariable Long komentarId,
                                                              @RequestBody KreirajKomentarRequest request) {
        return ResponseEntity.ok(komentarZadatkaService.azurirajKomentar(komentarId, request));
    }
    
    @DeleteMapping("/{komentarId}")
    public ResponseEntity<?> obrisiKomentar(@PathVariable Long zadatakId, @PathVariable Long komentarId) {
        komentarZadatkaService.obrisiKomentar(komentarId);
        return ResponseEntity.ok().body("{\"message\": \"Komentar je obrisan!\"}");
    }
}