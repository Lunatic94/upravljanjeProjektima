package rs.fakultet.upravljanjeprojektima.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rs.fakultet.upravljanjeprojektima.exception.ResourceNotFoundException;
import rs.fakultet.upravljanjeprojektima.model.dto.KomentarZadatkaDTO;
import rs.fakultet.upravljanjeprojektima.model.dto.KreirajKomentarRequest;
import rs.fakultet.upravljanjeprojektima.model.entity.KomentarZadatka;
import rs.fakultet.upravljanjeprojektima.model.entity.Korisnik;
import rs.fakultet.upravljanjeprojektima.model.entity.Zadatak;
import rs.fakultet.upravljanjeprojektima.repository.KomentarZadatkaRepository;
import rs.fakultet.upravljanjeprojektima.repository.ZadatakRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class KomentarZadatkaService {
    
    @Autowired
    private KomentarZadatkaRepository komentarZadatkaRepository;
    
    @Autowired
    private ZadatakRepository zadatakRepository;
    
    @Autowired
    private KorisnikService korisnikService;
    
    public List<KomentarZadatkaDTO> komentariZadatka(Long zadatakId) {
        Zadatak zadatak = getZadatakEntity(zadatakId);
        return komentarZadatkaRepository.findKomentareZadatkaHronoloski(zadatak).stream()
                .map(this::konvertujUDTO)
                .collect(Collectors.toList());
    }
    
    public KomentarZadatkaDTO dodajKomentar(Long zadatakId, KreirajKomentarRequest request) {
        Zadatak zadatak = getZadatakEntity(zadatakId);
        Korisnik trenutniKorisnik = getTrenutniKorisnik();
        
        KomentarZadatka komentar = new KomentarZadatka();
        komentar.setZadatak(zadatak);
        komentar.setKorisnik(trenutniKorisnik);
        komentar.setSadrzaj(request.getSadrzaj());
        
        KomentarZadatka sacuvanKomentar = komentarZadatkaRepository.save(komentar);
        return konvertujUDTO(sacuvanKomentar);
    }
    
    public KomentarZadatkaDTO azurirajKomentar(Long komentarId, KreirajKomentarRequest request) {
        KomentarZadatka komentar = komentarZadatkaRepository.findById(komentarId)
                .orElseThrow(() -> new ResourceNotFoundException("Komentar nije pronađen sa id: " + komentarId));
        
        Korisnik trenutniKorisnik = getTrenutniKorisnik();
        
        // Proveri da li trenutni korisnik može da ažurira komentar
        if (!komentar.getKorisnik().getId().equals(trenutniKorisnik.getId())) {
            throw new RuntimeException("Nemate dozvolu da ažurirate ovaj komentar!");
        }
        
        komentar.setSadrzaj(request.getSadrzaj());
        KomentarZadatka azuriranKomentar = komentarZadatkaRepository.save(komentar);
        
        return konvertujUDTO(azuriranKomentar);
    }
    
    public void obrisiKomentar(Long komentarId) {
        KomentarZadatka komentar = komentarZadatkaRepository.findById(komentarId)
                .orElseThrow(() -> new ResourceNotFoundException("Komentar nije pronađen sa id: " + komentarId));
        
        Korisnik trenutniKorisnik = getTrenutniKorisnik();
        
        // Proveri da li trenutni korisnik može da obriše komentar
        if (!komentar.getKorisnik().getId().equals(trenutniKorisnik.getId())) {
            throw new RuntimeException("Nemate dozvolu da obrišete ovaj komentar!");
        }
        
        komentarZadatkaRepository.delete(komentar);
    }
    
    private Zadatak getZadatakEntity(Long zadatakId) {
        return zadatakRepository.findById(zadatakId)
                .orElseThrow(() -> new ResourceNotFoundException("Zadatak nije pronađen sa id: " + zadatakId));
    }
    
    private Korisnik getTrenutniKorisnik() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return korisnikService.nadjiEntitetPoId(((rs.fakultet.upravljanjeprojektima.security.UserDetailsImpl) userDetails).getId());
    }
    
    private KomentarZadatkaDTO konvertujUDTO(KomentarZadatka komentar) {
        KomentarZadatkaDTO dto = new KomentarZadatkaDTO();
        dto.setId(komentar.getId());
        dto.setSadrzaj(komentar.getSadrzaj());
        dto.setDatumKreiranja(komentar.getDatumKreiranja());
        dto.setDatumAzuriranja(komentar.getDatumAzuriranja());
        
        if (komentar.getZadatak() != null) {
            dto.setZadatakId(komentar.getZadatak().getId());
        }
        
        if (komentar.getKorisnik() != null) {
            dto.setKorisnik(korisnikService.konvertujUDTO(komentar.getKorisnik()));
        }
        
        return dto;
    }
}