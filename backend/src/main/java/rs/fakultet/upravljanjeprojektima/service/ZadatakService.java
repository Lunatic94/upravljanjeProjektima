package rs.fakultet.upravljanjeprojektima.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rs.fakultet.upravljanjeprojektima.exception.ResourceNotFoundException;
import rs.fakultet.upravljanjeprojektima.model.dto.KreirajZadatakRequest;
import rs.fakultet.upravljanjeprojektima.model.dto.ZadatakDTO;
import rs.fakultet.upravljanjeprojektima.model.entity.AktivnostProjekta;
import rs.fakultet.upravljanjeprojektima.model.entity.Korisnik;
import rs.fakultet.upravljanjeprojektima.model.entity.Projekat;
import rs.fakultet.upravljanjeprojektima.model.entity.Zadatak;
import rs.fakultet.upravljanjeprojektima.model.enums.StatusZadatka;
import rs.fakultet.upravljanjeprojektima.model.enums.TipAktivnosti;
import rs.fakultet.upravljanjeprojektima.model.enums.TipEntiteta;
import rs.fakultet.upravljanjeprojektima.repository.AktivnostProjekatRepository;
import rs.fakultet.upravljanjeprojektima.repository.KomentarZadatkaRepository;
import rs.fakultet.upravljanjeprojektima.repository.PrilogZadatkaRepository;
import rs.fakultet.upravljanjeprojektima.repository.ZadatakRepository;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ZadatakService {
    
    @Autowired
    private ZadatakRepository zadatakRepository;
    
    @Autowired
    private KorisnikService korisnikService;
    
    @Autowired
    private ProjekatService projekatService;
    
    @Autowired
    private KomentarZadatkaRepository komentarZadatkaRepository;
    
    @Autowired
    private PrilogZadatkaRepository prilogZadatkaRepository;
    
    @Autowired
    private AktivnostProjekatRepository aktivnostProjekatRepository;
    
    public List<ZadatakDTO> sviZadaci() {
        return zadatakRepository.findAll().stream()
                .map(this::konvertujUDTO)
                .collect(Collectors.toList());
    }
    
    public List<ZadatakDTO> zadaciKorisnika() {
        Korisnik trenutniKorisnik = getTrenutniKorisnik();
        List<StatusZadatka> aktivniStatusi = Arrays.asList(
                StatusZadatka.TREBA_URADITI, StatusZadatka.U_TOKU, StatusZadatka.NA_PREGLEDU
        );
        return zadatakRepository.findAktivniZadaciKorisnika(trenutniKorisnik, aktivniStatusi).stream()
                .map(this::konvertujUDTO)
                .collect(Collectors.toList());
    }
    
    public List<ZadatakDTO> zadaciProjekta(Long projekatId) {
        Projekat projekat = projekatService.nadjiEntitetPoId(projekatId);
        return zadatakRepository.findByProjekat(projekat).stream()
                .map(this::konvertujUDTO)
                .collect(Collectors.toList());
    }
    
    public ZadatakDTO nadjiPoId(Long id) {
        Zadatak zadatak = zadatakRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zadatak nije pronađen sa id: " + id));
        return konvertujUDTO(zadatak);
    }
    
    public ZadatakDTO kreirajZadatak(KreirajZadatakRequest request) {
        Korisnik kreator = getTrenutniKorisnik();
        Projekat projekat = projekatService.nadjiEntitetPoId(request.getProjekatId());
        
        Zadatak zadatak = new Zadatak();
        zadatak.setNaslov(request.getNaslov());
        zadatak.setOpis(request.getOpis());
        zadatak.setPrioritet(request.getPrioritet());
        zadatak.setProcenjeniSati(request.getProcenjeniSati());
        zadatak.setRokZavrsetka(request.getRokZavrsetka());
        zadatak.setProjekat(projekat);
        zadatak.setKreiraoPKorisnik(kreator);
        
        if (request.getDodeljKorisnikId() != null) {
            Korisnik dodeljen = korisnikService.nadjiEntitetPoId(request.getDodeljKorisnikId());
            zadatak.setDodeljen(dodeljen);
        }
        
        Zadatak sacuvanZadatak = zadatakRepository.save(zadatak);
        
        // Dodaj aktivnost
        dodajAktivnost(projekat, kreator, TipAktivnosti.KREIRAN, TipEntiteta.ZADATAK,
                      sacuvanZadatak.getId(), "Kreiran zadatak: " + sacuvanZadatak.getNaslov());
        
        return konvertujUDTO(sacuvanZadatak);
    }
    
    public ZadatakDTO azurirajZadatak(Long id, ZadatakDTO zadatakDTO) {
        Zadatak zadatak = zadatakRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zadatak nije pronađen sa id: " + id));
        
        Korisnik trenutniKorisnik = getTrenutniKorisnik();
        
        zadatak.setNaslov(zadatakDTO.getNaslov());
        zadatak.setOpis(zadatakDTO.getOpis());
        zadatak.setStatus(zadatakDTO.getStatus());
        zadatak.setPrioritet(zadatakDTO.getPrioritet());
        zadatak.setProcenjeniSati(zadatakDTO.getProcenjeniSati());
        zadatak.setStvarniSati(zadatakDTO.getStvarniSati());
        zadatak.setRokZavrsetka(zadatakDTO.getRokZavrsetka());
        
        Zadatak azuriranZadatak = zadatakRepository.save(zadatak);
        
        // Dodaj aktivnost
        dodajAktivnost(azuriranZadatak.getProjekat(), trenutniKorisnik, TipAktivnosti.AZURIRAN, TipEntiteta.ZADATAK,
                      azuriranZadatak.getId(), "Ažuriran zadatak: " + azuriranZadatak.getNaslov());
        
        return konvertujUDTO(azuriranZadatak);
    }
    
    public ZadatakDTO azurirajStatus(Long id, StatusZadatka status) {
        Zadatak zadatak = zadatakRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zadatak nije pronađen sa id: " + id));
        
        Korisnik trenutniKorisnik = getTrenutniKorisnik();
        StatusZadatka stariStatus = zadatak.getStatus();
        
        zadatak.setStatus(status);
        Zadatak azuriranZadatak = zadatakRepository.save(zadatak);
        
        // Dodaj aktivnost
        String opis = "Status zadatka '" + azuriranZadatak.getNaslov() + "' promenjen sa " + 
                     stariStatus + " na " + status;
        dodajAktivnost(azuriranZadatak.getProjekat(), trenutniKorisnik, TipAktivnosti.AZURIRAN, 
                      TipEntiteta.ZADATAK, azuriranZadatak.getId(), opis);
        
        return konvertujUDTO(azuriranZadatak);
    }
    
    public ZadatakDTO dodeliZadatak(Long id, Long korisnikId) {
        Zadatak zadatak = zadatakRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zadatak nije pronađen sa id: " + id));
        
        Korisnik korisnik = korisnikService.nadjiEntitetPoId(korisnikId);
        Korisnik trenutniKorisnik = getTrenutniKorisnik();
        
        zadatak.setDodeljen(korisnik);
        Zadatak azuriranZadatak = zadatakRepository.save(zadatak);
        
        // Dodaj aktivnost
        String opis = "Zadatak '" + azuriranZadatak.getNaslov() + "' dodeljen korisniku " + korisnik.getPunoIme();
        dodajAktivnost(azuriranZadatak.getProjekat(), trenutniKorisnik, TipAktivnosti.DODELJEN,
                      TipEntiteta.ZADATAK, azuriranZadatak.getId(), opis);
        
        return konvertujUDTO(azuriranZadatak);
    }
    
    public void obrisiZadatak(Long id) {
        Zadatak zadatak = zadatakRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zadatak nije pronađen sa id: " + id));
        
        Korisnik trenutniKorisnik = getTrenutniKorisnik();
        
        // Dodaj aktivnost pre brisanja
        dodajAktivnost(zadatak.getProjekat(), trenutniKorisnik, TipAktivnosti.OBRISAN, TipEntiteta.ZADATAK,
                      zadatak.getId(), "Obrisan zadatak: " + zadatak.getNaslov());
        
        zadatakRepository.delete(zadatak);
    }
    
    public List<ZadatakDTO> pretraga(Long projekatId, String search) {
        Projekat projekat = projekatService.nadjiEntitetPoId(projekatId);
        return zadatakRepository.pretragaZadataka(projekat, search).stream()
                .map(this::konvertujUDTO)
                .collect(Collectors.toList());
    }
    
    public List<ZadatakDTO> kasniZadaci() {
        return zadatakRepository.findKasneZadatke(LocalDate.now()).stream()
                .map(this::konvertujUDTO)
                .collect(Collectors.toList());
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

    private ZadatakDTO konvertujUDTO(Zadatak zadatak) {
        ZadatakDTO dto = new ZadatakDTO();
        dto.setId(zadatak.getId());
        dto.setNaslov(zadatak.getNaslov());
        dto.setOpis(zadatak.getOpis());
        dto.setStatus(zadatak.getStatus());
        dto.setPrioritet(zadatak.getPrioritet());
        dto.setProcenjeniSati(zadatak.getProcenjeniSati());
        dto.setStvarniSati(zadatak.getStvarniSati());
        dto.setRokZavrsetka(zadatak.getRokZavrsetka());
        dto.setDatumKreiranja(zadatak.getDatumKreiranja());
        
        if (zadatak.getProjekat() != null) {
            dto.setProjekatId(zadatak.getProjekat().getId());
            dto.setNazivProjekta(zadatak.getProjekat().getNaziv());
        }
        
        if (zadatak.getDodeljen() != null) {
            dto.setDodeljen(korisnikService.konvertujUDTO(zadatak.getDodeljen()));
        }
        
        if (zadatak.getKreiraoPKorisnik() != null) {
            dto.setKreiraoPKorisnik(korisnikService.konvertujUDTO(zadatak.getKreiraoPKorisnik()));
        }
        
        // Dodaj broj komentara i priloga
        dto.setBrojKomentara(komentarZadatkaRepository.brojKomentaraZadatka(zadatak).intValue());
        dto.setBrojPriloga(prilogZadatkaRepository.findByZadatakOrderByDatumOkacivanja(zadatak).size());
        
        return dto;
    }
}