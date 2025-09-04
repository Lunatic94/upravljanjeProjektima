package rs.fakultet.upravljanjeprojektima.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import rs.fakultet.upravljanjeprojektima.model.dto.ClanProjekatDTO;
import rs.fakultet.upravljanjeprojektima.model.dto.DodajClanaNaProjekatRequest;
import rs.fakultet.upravljanjeprojektima.model.dto.UpravljajUlogamaRequest;
import rs.fakultet.upravljanjeprojektima.service.ClanProjekatService;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/projekti/{projekatId}/clanovi")
public class ClanProjekatController {
    
    @Autowired
    private ClanProjekatService clanProjekatService;
    
    @GetMapping
    public ResponseEntity<List<ClanProjekatDTO>> clanoviProjekta(@PathVariable Long projekatId) {
        return ResponseEntity.ok(clanProjekatService.clanoviProjekta(projekatId));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MENADZER_PROJEKTA')")
    public ResponseEntity<ClanProjekatDTO> dodajClana(@PathVariable Long projekatId, 
                                                     @Valid @RequestBody DodajClanaNaProjekatRequest request) {
        return ResponseEntity.ok(clanProjekatService.dodajClana(projekatId, request));
    }
    
    @DeleteMapping("/{clanId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MENADZER_PROJEKTA')")
    public ResponseEntity<?> ukloniClana(@PathVariable Long projekatId, @PathVariable Long clanId) {
        clanProjekatService.ukloniClana(clanId);
        return ResponseEntity.ok().body("{\"message\": \"Član je uklonjen sa projekta!\"}");
    }

    @PostMapping("/upravljaj-ulogama")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MENADZER_PROJEKTA')")
    public ResponseEntity<ClanProjekatDTO> upravljajUlogama(
            @PathVariable Long projekatId,
            @Valid @RequestBody UpravljajUlogamaRequest request) {
        
        if (request.getAkcija() == UpravljajUlogamaRequest.Akcija.DODAJ) {
            ClanProjekatDTO clan = clanProjekatService.dodajClana(projekatId, 
                new DodajClanaNaProjekatRequest(request.getKorisnikId(), request.getUloga()));
            return ResponseEntity.ok(clan);
        } else {
            clanProjekatService.ukloniUloguClana(projekatId, request.getKorisnikId(), request.getUloga());
            
            // Vratiti ažurirane podatke o članu
            List<ClanProjekatDTO> clanovi = clanProjekatService.clanoviProjekta(projekatId);
            ClanProjekatDTO azuriranClan = clanovi.stream()
                .filter(c -> c.getKorisnik().getId().equals(request.getKorisnikId()))
                .findFirst()
                .orElse(null);
                
            return ResponseEntity.ok(azuriranClan);
        }
    }


    
}