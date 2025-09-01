package rs.fakultet.upravljanjeprojektima.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import rs.fakultet.upravljanjeprojektima.model.dto.AktivnostProjekatDTO;
import rs.fakultet.upravljanjeprojektima.model.dto.KreirajProjekatRequest;
import rs.fakultet.upravljanjeprojektima.model.dto.ProjekatDTO;
import rs.fakultet.upravljanjeprojektima.model.enums.StatusProjekta;
import rs.fakultet.upravljanjeprojektima.service.AktivnostProjekatService;
import rs.fakultet.upravljanjeprojektima.service.ProjekatService;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/projekti")
public class ProjekatController {
    
    @Autowired
    private ProjekatService projekatService;

    @Autowired
    private AktivnostProjekatService aktivnostProjekatService;
    
    @GetMapping
    public ResponseEntity<List<ProjekatDTO>> sviProjekti() {
        return ResponseEntity.ok(projekatService.sviProjekti());
    }
    
    @GetMapping("/moji")
    public ResponseEntity<List<ProjekatDTO>> mojiProjekti() {
        return ResponseEntity.ok(projekatService.projektiKorisnika());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProjekatDTO> nadjiProjekat(@PathVariable Long id) {
        return ResponseEntity.ok(projekatService.nadjiPoId(id));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MENADZER_PROJEKTA')")
    public ResponseEntity<ProjekatDTO> kreirajProjekat(@Valid @RequestBody KreirajProjekatRequest request) {
        return ResponseEntity.ok(projekatService.kreirajProjekat(request));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MENADZER_PROJEKTA')")
    public ResponseEntity<ProjekatDTO> azurirajProjekat(@PathVariable Long id, @RequestBody ProjekatDTO projekatDTO) {
        return ResponseEntity.ok(projekatService.azurirajProjekat(id, projekatDTO));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MENADZER_PROJEKTA')")
    public ResponseEntity<?> obrisiProjekat(@PathVariable Long id) {
        projekatService.obrisiProjekat(id);
        return ResponseEntity.ok().body("{\"message\": \"Projekat je obrisan!\"}");
    }
    
    @GetMapping("/pretraga")
    public ResponseEntity<List<ProjekatDTO>> pretragaProjekta(@RequestParam String search) {
        return ResponseEntity.ok(projekatService.pretraga(search));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ProjekatDTO>> projektiPoStatusu(@PathVariable StatusProjekta status) {
        return ResponseEntity.ok(projekatService.projektiPoStatusu(status));
    }
    @GetMapping("/{id}/aktivnosti")
    public ResponseEntity<Page<AktivnostProjekatDTO>> getAktivnostiProjekta(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String tip) {
        
        try {
            Page<AktivnostProjekatDTO> aktivnosti = aktivnostProjekatService.getAktivnostiProjekta(id, page, size, tip);
            return ResponseEntity.ok(aktivnosti);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}