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
import rs.fakultet.upravljanjeprojektima.model.enums.UlogaNaProjektu;
import rs.fakultet.upravljanjeprojektima.repository.AktivnostProjekatRepository;
import rs.fakultet.upravljanjeprojektima.repository.ClanProjekatRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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
        
        Optional<ClanProjekta> postojeciClan = clanProjekatRepository
            .findByProjekatAndKorisnik(projekat, korisnik);
        
        ClanProjekta clanProjekta;
        String opis;
        TipAktivnosti tipAktivnosti;
        
        if (postojeciClan.isPresent()) {
            clanProjekta = postojeciClan.get();
            
            if (!clanProjekta.getAktivan()) {
                // REAKTIVACIJA neaktivnog člana
                clanProjekta.setAktivan(true);
                clanProjekta.setDatumNapustanja(null);
                clanProjekta.getUloge().clear();
                clanProjekta.dodajUlogu(request.getUloga());
                
                opis = "Korisnik " + korisnik.getPunoIme() + " reaktiviran na projektu sa ulogom " + request.getUloga();
                tipAktivnosti = TipAktivnosti.AZURIRAN;
                
            } else {
                // Aktivan član - dodavanje nove uloge ili greška
                if (clanProjekta.imaUlogu(request.getUloga())) {
                    throw new RuntimeException("Korisnik već ima ulogu " + request.getUloga() + " na ovom projektu!");
                }
                
                clanProjekta.dodajUlogu(request.getUloga());
                opis = "Korisniku " + korisnik.getPunoIme() + " dodana uloga " + request.getUloga();
                tipAktivnosti = TipAktivnosti.AZURIRAN;
            }
        } else {
            // Kreiranje potpuno novog člana
            clanProjekta = new ClanProjekta(projekat, korisnik, request.getUloga());
            opis = "Korisnik " + korisnik.getPunoIme() + " dodat na projekat sa ulogom " + request.getUloga();
            tipAktivnosti = TipAktivnosti.KREIRAN;
        }
        
        ClanProjekta sacuvanClan = clanProjekatRepository.save(clanProjekta);
        
        // Dodaj aktivnost
        dodajAktivnost(projekat, trenutniKorisnik, tipAktivnosti, TipEntiteta.CLAN,
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

    public void ukloniUloguClana(Long projekatId, Long korisnikId, UlogaNaProjektu uloga) {
        Projekat projekat = projekatService.nadjiEntitetPoId(projekatId);
        Korisnik korisnik = korisnikService.nadjiEntitetPoId(korisnikId);
        ClanProjekta clanProjekta = clanProjekatRepository
            .findByProjekatAndKorisnikAndAktivan(projekat, korisnik, true)
            .orElseThrow(() -> new ResourceNotFoundException("Član projekta nije pronađen"));
        
        Korisnik trenutniKorisnik = getTrenutniKorisnik();
        
        if (!clanProjekta.imaUlogu(uloga)) {
            throw new RuntimeException("Korisnik nema ulogu " + uloga + " na ovom projektu!");
        }
        
        clanProjekta.ukloniUlogu(uloga);
        
        // Ako nema više uloga, označi kao neaktivan
        if (!clanProjekta.imaBiloKojuUlogu()) {
            clanProjekta.setAktivan(false);
            clanProjekta.setDatumNapustanja(LocalDateTime.now());
        }
        
        clanProjekatRepository.save(clanProjekta);
        
        // Dodaj aktivnost
        String opis = "Korisniku " + clanProjekta.getKorisnik().getPunoIme() + " uklonjena uloga " + uloga;
        dodajAktivnost(clanProjekta.getProjekat(), trenutniKorisnik, TipAktivnosti.AZURIRAN, TipEntiteta.CLAN,
                        clanProjekta.getId(), opis);
    }

    public ClanProjekatDTO dodajUloguClanu(Long projekatId, Long korisnikId, UlogaNaProjektu uloga) {
        Projekat projekat = projekatService.nadjiEntitetPoId(projekatId);
        Korisnik korisnik = korisnikService.nadjiEntitetPoId(korisnikId);
        
        Optional<ClanProjekta> postojeciClan = clanProjekatRepository
            .findByProjekatAndKorisnikAndAktivan(projekat, korisnik, true);
        
        if (postojeciClan.isPresent()) {
            ClanProjekta clan = postojeciClan.get();
            
            if (clan.imaUlogu(uloga)) {
                throw new RuntimeException("Korisnik već ima ulogu " + uloga + " na ovom projektu!");
            }
            
            clan.dodajUlogu(uloga);
            ClanProjekta sacuvanClan = clanProjekatRepository.save(clan);
            
            // Dodaj aktivnost
            Korisnik trenutniKorisnik = getTrenutniKorisnik();
            String opis = "Korisniku " + korisnik.getPunoIme() + " dodana uloga " + uloga + " na projektu";
            dodajAktivnost(projekat, trenutniKorisnik, TipAktivnosti.AZURIRAN, TipEntiteta.CLAN,
                        sacuvanClan.getId(), opis);
            
            return konvertujUDTO(sacuvanClan);
        } else {
            throw new ResourceNotFoundException("Korisnik nije član ovog projekta!");
        }
    }
    
    private ClanProjekatDTO konvertujUDTO(ClanProjekta clanProjekta) {
        ClanProjekatDTO dto = new ClanProjekatDTO();
        dto.setId(clanProjekta.getId());
        dto.setUloge(clanProjekta.getUloge()); // IZMENA: Sada vraćamo Set<UlogaNaProjektu>
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