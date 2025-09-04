package rs.fakultet.upravljanjeprojektima.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rs.fakultet.upravljanjeprojektima.exception.ResourceNotFoundException;
import rs.fakultet.upravljanjeprojektima.model.dto.ClanProjekatDTO;
import rs.fakultet.upravljanjeprojektima.model.dto.DodajClanaNaProjekatRequest;
import rs.fakultet.upravljanjeprojektima.model.entity.AktivnostProjekta;
import rs.fakultet.upravljanjeprojektima.model.entity.ClanProjekta;
import rs.fakultet.upravljanjeprojektima.model.entity.Korisnik;
import rs.fakultet.upravljanjeprojektima.model.entity.Projekat;
import rs.fakultet.upravljanjeprojektima.model.enums.TipAktivnosti;
import rs.fakultet.upravljanjeprojektima.model.enums.TipEntiteta;
import rs.fakultet.upravljanjeprojektima.repository.AktivnostProjekatRepository;
import rs.fakultet.upravljanjeprojektima.repository.ClanProjekatRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ClanProjekatService {
    
    @Autowired
    private ClanProjekatRepository clanProjekatRepository;
    
    @Autowired
    private KorisnikService korisnikService;
    
    @Autowired
    private ProjekatService projekatService;
    
    @Autowired
    private AktivnostProjekatRepository aktivnostProjekatRepository;
    
    public List<ClanProjekatDTO> clanoviProjekta(Long projekatId) {
        Projekat projekat = projekatService.nadjiEntitetPoId(projekatId);
        return clanProjekatRepository.findByProjekatAndAktivan(projekat, true).stream()
                .map(this::konvertujUDTO)
                .collect(Collectors.toList());
    }
    
    public ClanProjekatDTO dodajClana(Long projekatId, DodajClanaNaProjekatRequest request) {
        Projekat projekat = projekatService.nadjiEntitetPoId(projekatId);
        Korisnik korisnik = korisnikService.nadjiEntitetPoId(request.getKorisnikId());
        Korisnik trenutniKorisnik = getTrenutniKorisnik();
        
        // Proveri da li korisnik već nije član projekta
        //if (clanProjekatRepository.existsByProjekatAndKorisnikAndAktivan(projekat, korisnik, true)) {
         //   throw new RuntimeException("Korisnik je već član ovog projekta!");
        //}
        
        ClanProjekta clanProjekta = new ClanProjekta();
        clanProjekta.setProjekat(projekat);
        clanProjekta.setKorisnik(korisnik);
        clanProjekta.setUloga(request.getUloga());
        
        ClanProjekta sacuvanClan = clanProjekatRepository.save(clanProjekta);
        
        // Dodaj aktivnost
        String opis = "Korisnik " + korisnik.getPunoIme() + " dodat na projekat sa ulogom " + request.getUloga();
        dodajAktivnost(projekat, trenutniKorisnik, TipAktivnosti.KREIRAN, TipEntiteta.CLAN,
                      sacuvanClan.getId(), opis);
        
        return konvertujUDTO(sacuvanClan);
    }
    
    public void ukloniClana(Long clanId) {
        ClanProjekta clanProjekta = clanProjekatRepository.findById(clanId)
                .orElseThrow(() -> new ResourceNotFoundException("Član projekta nije pronađen sa id: " + clanId));
        
        Korisnik trenutniKorisnik = getTrenutniKorisnik();
        
        // Dodaj aktivnost pre uklanjanja
        String opis = "Korisnik " + clanProjekta.getKorisnik().getPunoIme() + " uklonjen sa projekta";
        dodajAktivnost(clanProjekta.getProjekat(), trenutniKorisnik, TipAktivnosti.OBRISAN, TipEntiteta.CLAN,
                      clanProjekta.getId(), opis);
        
        // Označi kao neaktivan umesto brisanja
        clanProjekta.setAktivan(false);
        clanProjekta.setDatumNapustanja(LocalDateTime.now());
        clanProjekatRepository.save(clanProjekta);
    }
    
    private void dodajAktivnost(Projekat projekat, Korisnik korisnik, TipAktivnosti tipAktivnosti,
                               TipEntiteta tipEntiteta, Long entitetId, String opis) {
        AktivnostProjekta aktivnost = new AktivnostProjekta(projekat, korisnik, tipAktivnosti, tipEntiteta, entitetId, opis);
        aktivnostProjekatRepository.save(aktivnost);
    }
    
    private Korisnik getTrenutniKorisnik() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return korisnikService.nadjiEntitetPoId(((rs.fakultet.upravljanjeprojektima.security.UserDetailsImpl) userDetails).getId());
    }
    
    private ClanProjekatDTO konvertujUDTO(ClanProjekta clanProjekta) {
        ClanProjekatDTO dto = new ClanProjekatDTO();
        dto.setId(clanProjekta.getId());
        dto.setUloga(clanProjekta.getUloga());
        dto.setDatumPridruzivanja(clanProjekta.getDatumPridruzivanja());
        dto.setDatumNapustanja(clanProjekta.getDatumNapustanja());
        dto.setAktivan(clanProjekta.getAktivan());
        
        if (clanProjekta.getKorisnik() != null) {
            dto.setKorisnik(korisnikService.konvertujUDTO(clanProjekta.getKorisnik()));
        }
        
        if (clanProjekta.getProjekat() != null) {
            dto.setProjekatId(clanProjekta.getProjekat().getId());
            dto.setNazivProjekta(clanProjekta.getProjekat().getNaziv());
        }
        
        return dto;
    }
}