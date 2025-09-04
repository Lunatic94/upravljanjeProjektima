package rs.fakultet.upravljanjeprojektima.model.dto;

import rs.fakultet.upravljanjeprojektima.model.enums.UlogaNaProjektu;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public class ClanProjekatDTO {
    private Long id;
    private KorisnikDTO korisnik;
    private Long projekatId;
    private String nazivProjekta;
    private Set<UlogaNaProjektu> uloge; // IZMENA: Lista umesto jedne uloge
    private LocalDateTime datumPridruzivanja;
    private LocalDateTime datumNapustanja;
    private Boolean aktivan;
    
    // Konstruktori
    public ClanProjekatDTO() {}
    
    // Getteri i Setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public KorisnikDTO getKorisnik() { return korisnik; }
    public void setKorisnik(KorisnikDTO korisnik) { this.korisnik = korisnik; }
    
    public Long getProjekatId() { return projekatId; }
    public void setProjekatId(Long projekatId) { this.projekatId = projekatId; }
    
    public String getNazivProjekta() { return nazivProjekta; }
    public void setNazivProjekta(String nazivProjekta) { this.nazivProjekta = nazivProjekta; }
    
    public Set<UlogaNaProjektu> getUloge() { return uloge; }
    public void setUloge(Set<UlogaNaProjektu> uloge) { this.uloge = uloge; }
    
    public LocalDateTime getDatumPridruzivanja() { return datumPridruzivanja; }
    public void setDatumPridruzivanja(LocalDateTime datumPridruzivanja) { this.datumPridruzivanja = datumPridruzivanja; }
    
    public LocalDateTime getDatumNapustanja() { return datumNapustanja; }
    public void setDatumNapustanja(LocalDateTime datumNapustanja) { this.datumNapustanja = datumNapustanja; }
    
    public Boolean getAktivan() { return aktivan; }
    public void setAktivan(Boolean aktivan) { this.aktivan = aktivan; }
    
    // Helper metode
    public boolean imaUlogu(UlogaNaProjektu uloga) {
        return this.uloge != null && this.uloge.contains(uloga);
    }
    
    public String getUlogeString() {
        return uloge != null ? uloge.stream()
            .map(UlogaNaProjektu::name)
            .collect(Collectors.joining(", ")) : "";
    }
}