package rs.fakultet.upravljanjeprojektima.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import rs.fakultet.upravljanjeprojektima.model.dto.KorisnikDTO;
import rs.fakultet.upravljanjeprojektima.model.enums.UlogaKorisnika;
import rs.fakultet.upravljanjeprojektima.service.KorisnikService;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/korisnici")
public class KorisnikController {
    
    @Autowired
    private KorisnikService korisnikService;
    
    @GetMapping
   // @PreAuthorize("hasRole('ADMIN') or hasRole('MENADZER_PROJEKTA')")
    public ResponseEntity<List<KorisnikDTO>> sviKorisnici() {
        return ResponseEntity.ok(korisnikService.sviKorisnici());
    }
    
    @GetMapping("/aktivni")
    public ResponseEntity<List<KorisnikDTO>> aktivniKorisnici() {
        return ResponseEntity.ok(korisnikService.aktivniKorisnici());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<KorisnikDTO> nadjiKorisnika(@PathVariable Long id) {
        return ResponseEntity.ok(korisnikService.nadjiPoId(id));
    }
    
    @GetMapping("/pretraga")
    public ResponseEntity<List<KorisnikDTO>> pretragaKorisnika(@RequestParam String search) {
        return ResponseEntity.ok(korisnikService.pretragaKorisnika(search));
    }
    
    @GetMapping("/uloga/{uloga}")
    public ResponseEntity<List<KorisnikDTO>> korisnikPoUlozi(@PathVariable UlogaKorisnika uloga) {
        return ResponseEntity.ok(korisnikService.korisnikPoUlozi(uloga));
    }
    
    @PutMapping("/{id}")
   // @PreAuthorize("hasRole('ADMIN') or hasRole('MENADZER_PROJEKTA')")
    public ResponseEntity<KorisnikDTO> azurirajKorisnika(@PathVariable Long id, @RequestBody KorisnikDTO korisnikDTO) {
        return ResponseEntity.ok(korisnikService.azurirajKorisnika(id, korisnikDTO));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deaktivirajKorisnika(@PathVariable Long id) {
        korisnikService.deaktivirajKorisnika(id);
        return ResponseEntity.ok().body("{\"message\": \"Korisnik je deaktiviran!\"}");
    }
}