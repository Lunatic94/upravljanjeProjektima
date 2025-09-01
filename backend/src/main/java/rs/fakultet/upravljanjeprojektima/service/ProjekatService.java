package rs.fakultet.upravljanjeprojektima.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rs.fakultet.upravljanjeprojektima.exception.ResourceNotFoundException;
import rs.fakultet.upravljanjeprojektima.model.dto.KreirajProjekatRequest;
import rs.fakultet.upravljanjeprojektima.model.dto.ProjekatDTO;
import rs.fakultet.upravljanjeprojektima.model.entity.AktivnostProjekta;
import rs.fakultet.upravljanjeprojektima.model.entity.Korisnik;
import rs.fakultet.upravljanjeprojektima.model.entity.Projekat;
import rs.fakultet.upravljanjeprojektima.model.enums.StatusProjekta;
import rs.fakultet.upravljanjeprojektima.model.enums.TipAktivnosti;
import rs.fakultet.upravljanjeprojektima.model.enums.TipEntiteta;
import rs.fakultet.upravljanjeprojektima.repository.AktivnostProjekatRepository;
import rs.fakultet.upravljanjeprojektima.repository.ClanProjekatRepository;
import rs.fakultet.upravljanjeprojektima.repository.ProjekatRepository;
import rs.fakultet.upravljanjeprojektima.repository.ZadatakRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjekatService {
    
    @Autowired
    private ProjekatRepository projekatRepository;
    
    @Autowired
    private KorisnikService korisnikService;
    
    @Autowired
    private ZadatakRepository zadatakRepository;
    
    @Autowired
    private ClanProjekatRepository clanProjekatRepository;
    
    @Autowired
    private AktivnostProjekatRepository aktivnostProjekatRepository;
    
    public List<ProjekatDTO> sviProjekti() {
        return projekatRepository.findAll().stream()
                .map(this::konvertujUDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProjekatDTO> projektiKorisnika() {
        Korisnik trenutniKorisnik = getTrenutniKorisnik();
        return projekatRepository.findSviProjektiKorisnika(trenutniKorisnik).stream()
                .map(this::konvertujUDTO)
                .collect(Collectors.toList());
    }
    
    public ProjekatDTO nadjiPoId(Long id) {
        Projekat projekat = projekatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projekat nije pronađen sa id: " + id));
        return konvertujUDTO(projekat);
    }
    
    public ProjekatDTO kreirajProjekat(KreirajProjekatRequest request) {
        Korisnik kreator = getTrenutniKorisnik();
        
        Projekat projekat = new Projekat();
        projekat.setNaziv(request.getNaziv());
        projekat.setOpis(request.getOpis());
        projekat.setDatumPocetka(request.getDatumPocetka());
        projekat.setDatumZavrsetka(request.getDatumZavrsetka());
        projekat.setPrioritet(request.getPrioritet());
        projekat.setKreiraoPKorisnik(kreator);
        
        if (request.getMenadzerId() != null) {
            Korisnik menadzer = korisnikService.nadjiEntitetPoId(request.getMenadzerId());
            projekat.setMenadzer(menadzer);
        } else {
            projekat.setMenadzer(kreator);
        }
        
        Projekat sacuvanProjekat = projekatRepository.save(projekat);
        
        // Dodaj aktivnost
        dodajAktivnost(sacuvanProjekat, kreator, TipAktivnosti.KREIRAN, TipEntiteta.PROJEKAT, 
                      sacuvanProjekat.getId(), "Kreiran projekat: " + sacuvanProjekat.getNaziv());
        
        return konvertujUDTO(sacuvanProjekat);
    }
    
    public ProjekatDTO azurirajProjekat(Long id, ProjekatDTO projekatDTO) {
        Projekat projekat = projekatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projekat nije pronađen sa id: " + id));
        
        Korisnik trenutniKorisnik = getTrenutniKorisnik();
        
        projekat.setNaziv(projekatDTO.getNaziv());
        projekat.setOpis(projekatDTO.getOpis());
        projekat.setDatumPocetka(projekatDTO.getDatumPocetka());
        projekat.setDatumZavrsetka(projekatDTO.getDatumZavrsetka());
        projekat.setStatus(projekatDTO.getStatus());
        projekat.setPrioritet(projekatDTO.getPrioritet());
        
        Projekat azuriranProjekat = projekatRepository.save(projekat);
        
        // Dodaj aktivnost
        dodajAktivnost(azuriranProjekat, trenutniKorisnik, TipAktivnosti.AZURIRAN, TipEntiteta.PROJEKAT,
                      azuriranProjekat.getId(), "Ažuriran projekat: " + azuriranProjekat.getNaziv());
        
        return konvertujUDTO(azuriranProjekat);
    }
    
    public void obrisiProjekat(Long id) {
        Projekat projekat = projekatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projekat nije pronađen sa id: " + id));
        
        Korisnik trenutniKorisnik = getTrenutniKorisnik();
        
        // Dodaj aktivnost pre brisanja
        dodajAktivnost(projekat, trenutniKorisnik, TipAktivnosti.OBRISAN, TipEntiteta.PROJEKAT,
                      projekat.getId(), "Obrisan projekat: " + projekat.getNaziv());
        
        projekatRepository.delete(projekat);
    }
    
    public List<ProjekatDTO> pretraga(String search) {
        return projekatRepository.pretragaProjekta(search).stream()
                .map(this::konvertujUDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProjekatDTO> projektiPoStatusu(StatusProjekta status) {
        return projekatRepository.findByStatus(status).stream()
                .map(this::konvertujUDTO)
                .collect(Collectors.toList());
    }
    
    public Projekat nadjiEntitetPoId(Long id) {
        return projekatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projekat nije pronađen sa id: " + id));
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
    
    private ProjekatDTO konvertujUDTO(Projekat projekat) {
        ProjekatDTO dto = new ProjekatDTO();
        dto.setId(projekat.getId());
        dto.setNaziv(projekat.getNaziv());
        dto.setOpis(projekat.getOpis());
        dto.setDatumPocetka(projekat.getDatumPocetka());
        dto.setDatumZavrsetka(projekat.getDatumZavrsetka());
        dto.setStatus(projekat.getStatus());
        dto.setPrioritet(projekat.getPrioritet());
        dto.setDatumKreiranja(projekat.getDatumKreiranja());
        
        if (projekat.getKreiraoPKorisnik() != null) {
            dto.setKreiraoPKorisnik(korisnikService.konvertujUDTO(projekat.getKreiraoPKorisnik()));
        }
        
        if (projekat.getMenadzer() != null) {
            dto.setMenadzer(korisnikService.konvertujUDTO(projekat.getMenadzer()));
        }
        
        // Dodaj broj zadataka i članova
        dto.setBrojZadataka(zadatakRepository.findByProjekat(projekat).size());
        dto.setBrojClanova(clanProjekatRepository.brojAktivnihClanova(projekat).intValue());
        
        return dto;
    }
}