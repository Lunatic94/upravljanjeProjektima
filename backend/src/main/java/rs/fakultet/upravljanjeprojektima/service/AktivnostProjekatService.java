package rs.fakultet.upravljanjeprojektima.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rs.fakultet.upravljanjeprojektima.exception.ResourceNotFoundException;
import rs.fakultet.upravljanjeprojektima.model.dto.AktivnostProjekatDTO;
import rs.fakultet.upravljanjeprojektima.model.entity.AktivnostProjekta;
import rs.fakultet.upravljanjeprojektima.model.entity.Projekat;
import rs.fakultet.upravljanjeprojektima.model.enums.TipAktivnosti;
import rs.fakultet.upravljanjeprojektima.repository.AktivnostProjekatRepository;
import rs.fakultet.upravljanjeprojektima.repository.ProjekatRepository;

@Service
@Transactional(readOnly = true)
public class AktivnostProjekatService {
    
    @Autowired
    private AktivnostProjekatRepository aktivnostProjekatRepository;
    
    @Autowired
    private ProjekatRepository projekatRepository;
    
    @Autowired
    private KorisnikService korisnikService;
    
    public Page<AktivnostProjekatDTO> getAktivnostiProjekta(Long projekatId, int page, int size, String tip) {
        // Provjeri da li projekat postoji
        Projekat projekat = projekatRepository.findById(projekatId)
                .orElseThrow(() -> new ResourceNotFoundException("Projekat nije pronađen sa id: " + projekatId));
        
        // Kreiraj Pageable objekat sa sortiranjem po datumu kreiranja (najnovije prvo)
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "datumKreiranja"));
        
        Page<AktivnostProjekta> aktivnostiPage;
        
        if (tip != null && !tip.isEmpty()) {
            try {
                TipAktivnosti tipAktivnosti = TipAktivnosti.valueOf(tip);
                aktivnostiPage = aktivnostProjekatRepository.findByProjekatAndTipAktivnostiOrderByDatumKreiranjaDesc(
                        projekat, tipAktivnosti, pageable);
            } catch (IllegalArgumentException e) {
                // Ako tip nije valjan, vrati sve aktivnosti
                aktivnostiPage = aktivnostProjekatRepository.findByProjekatOrderByDatumKreiranjaDesc(projekat, pageable);
            }
        } else {
            aktivnostiPage = aktivnostProjekatRepository.findByProjekatOrderByDatumKreiranjaDesc(projekat, pageable);
        }
        
        return aktivnostiPage.map(this::konvertujUDTO);
    }
    
    private AktivnostProjekatDTO konvertujUDTO(AktivnostProjekta aktivnost) {
        AktivnostProjekatDTO dto = new AktivnostProjekatDTO();
        dto.setId(aktivnost.getId());
        dto.setTipAktivnosti(aktivnost.getTipAktivnosti());
        dto.setTipEntiteta(aktivnost.getTipEntiteta());
        dto.setEntitetId(aktivnost.getEntitetId());
        dto.setOpis(aktivnost.getOpis());
        dto.setDatumKreiranja(aktivnost.getDatumKreiranja());
        
        if (aktivnost.getKorisnik() != null) {
            dto.setKorisnik(korisnikService.konvertujUDTO(aktivnost.getKorisnik()));
        }
        
        return dto;
    }
}