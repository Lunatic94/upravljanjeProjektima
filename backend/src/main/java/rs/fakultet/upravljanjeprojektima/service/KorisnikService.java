package rs.fakultet.upravljanjeprojektima.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import rs.fakultet.upravljanjeprojektima.exception.ResourceNotFoundException;
import rs.fakultet.upravljanjeprojektima.model.dto.KorisnikDTO;
import rs.fakultet.upravljanjeprojektima.model.dto.RegistracijaRequest;
import rs.fakultet.upravljanjeprojektima.model.entity.Korisnik;
import rs.fakultet.upravljanjeprojektima.model.enums.UlogaKorisnika;
import rs.fakultet.upravljanjeprojektima.repository.KorisnikRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class KorisnikService {
    
    @Autowired
    private KorisnikRepository korisnikRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<KorisnikDTO> sviKorisnici() {
        return korisnikRepository.findAll().stream()
                .map(this::konvertujUDTOPrivate)
                .collect(Collectors.toList());
    }
    
    public List<KorisnikDTO> aktivniKorisnici() {
        return korisnikRepository.findByAktivan(true).stream()
                .map(this::konvertujUDTOPrivate)
                .collect(Collectors.toList());
    }
    
    public KorisnikDTO nadjiPoId(Long id) {
        Korisnik korisnik = korisnikRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Korisnik nije pronađen sa id: " + id));
        return konvertujUDTOPrivate(korisnik);
    }
    
    public KorisnikDTO nadjiPoKorisnickomImenu(String korisnickoIme) {
        Korisnik korisnik = korisnikRepository.findByKorisnickoIme(korisnickoIme)
                .orElseThrow(() -> new ResourceNotFoundException("Korisnik nije pronađen: " + korisnickoIme));
        return konvertujUDTOPrivate(korisnik);
    }
    
    public KorisnikDTO kreirajKorisnika(RegistracijaRequest request) {
        if (korisnikRepository.existsByKorisnickoIme(request.getKorisnickoIme())) {
            throw new RuntimeException("Korisničko ime već postoji!");
        }
        
        if (korisnikRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email već postoji!");
        }
        
        Korisnik korisnik = new Korisnik();
        korisnik.setKorisnickoIme(request.getKorisnickoIme());
        korisnik.setEmail(request.getEmail());
        korisnik.setLozinka(passwordEncoder.encode(request.getLozinka()));
        korisnik.setIme(request.getIme());
        korisnik.setPrezime(request.getPrezime());
        korisnik.setUloga(request.getUloga());
        
        Korisnik sacuvaniKorisnik = korisnikRepository.save(korisnik);
        return konvertujUDTOPrivate(sacuvaniKorisnik);
    }
    
    public List<KorisnikDTO> pretragaKorisnika(String search) {
        return korisnikRepository.pretragaKorisnika(search).stream()
                .map(this::konvertujUDTOPrivate)
                .collect(Collectors.toList());
    }
    
    public List<KorisnikDTO> korisnikPoUlozi(UlogaKorisnika uloga) {
        return korisnikRepository.findAktivniKorisnikePOulozi(uloga).stream()
                .map(this::konvertujUDTOPrivate)
                .collect(Collectors.toList());
    }
    
    public KorisnikDTO azurirajKorisnika(Long id, KorisnikDTO korisnikDTO) {
        Korisnik korisnik = korisnikRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Korisnik nije pronađen sa id: " + id));
        
        //if (korisnikRepository.existsByEmail(korisnik.getEmail())) {
         //   throw new ResourceNotFoundException("Korisnik sa ovom Email adresom:" + korisnikDTO.getEmail() + " već postoji!");
       // }
       //
                
        korisnik.setIme(korisnikDTO.getIme());
        korisnik.setPrezime(korisnikDTO.getPrezime());
        korisnik.setEmail(korisnikDTO.getEmail());
        if (korisnikDTO.getUloga() != null) {
            korisnik.setUloga(korisnikDTO.getUloga());
        }
        
        Korisnik azuriranKorisnik = korisnikRepository.save(korisnik);
        return konvertujUDTOPrivate(azuriranKorisnik);

    }
    
    public void deaktivirajKorisnika(Long id) {
        Korisnik korisnik = korisnikRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Korisnik nije pronađen sa id: " + id));
        
        korisnik.setAktivan(false);
        korisnikRepository.save(korisnik);
    }
    
    public Korisnik nadjiEntitetPoId(Long id) {
        return korisnikRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Korisnik nije pronađen sa id: " + id));
    }
    
    // Dodaj javnu metodu za konvertovanje u DTO
    public KorisnikDTO konvertujUDTO(Korisnik korisnik) {
        KorisnikDTO dto = new KorisnikDTO();
        dto.setId(korisnik.getId());
        dto.setKorisnickoIme(korisnik.getKorisnickoIme());
        dto.setEmail(korisnik.getEmail());
        dto.setIme(korisnik.getIme());
        dto.setPrezime(korisnik.getPrezime());
        dto.setUloga(korisnik.getUloga());
        dto.setDatumKreiranja(korisnik.getDatumKreiranja());
        dto.setAktivan(korisnik.getAktivan());
        return dto;
    }
    
    private KorisnikDTO konvertujUDTOPrivate(Korisnik korisnik) {
        KorisnikDTO dto = new KorisnikDTO();
        dto.setId(korisnik.getId());
        dto.setKorisnickoIme(korisnik.getKorisnickoIme());
        dto.setEmail(korisnik.getEmail());
        dto.setIme(korisnik.getIme());
        dto.setPrezime(korisnik.getPrezime());
        dto.setUloga(korisnik.getUloga());
        dto.setDatumKreiranja(korisnik.getDatumKreiranja());
        dto.setAktivan(korisnik.getAktivan());
        return dto;
    }
}