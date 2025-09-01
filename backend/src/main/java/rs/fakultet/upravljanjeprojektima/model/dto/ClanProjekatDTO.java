package rs.fakultet.upravljanjeprojektima.model.dto;

import rs.fakultet.upravljanjeprojektima.model.enums.UlogaNaProjektu;

import java.time.LocalDateTime;

public class ClanProjekatDTO {
    private Long id;
    private KorisnikDTO korisnik;
    private Long projekatId;
    private String nazivProjekta;
    private UlogaNaProjektu uloga;
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
    
    public UlogaNaProjektu getUloga() { return uloga; }
    public void setUloga(UlogaNaProjektu uloga) { this.uloga = uloga; }
    
    public LocalDateTime getDatumPridruzivanja() { return datumPridruzivanja; }
    public void setDatumPridruzivanja(LocalDateTime datumPridruzivanja) { this.datumPridruzivanja = datumPridruzivanja; }
    
    public LocalDateTime getDatumNapustanja() { return datumNapustanja; }
    public void setDatumNapustanja(LocalDateTime datumNapustanja) { this.datumNapustanja = datumNapustanja; }
    
    public Boolean getAktivan() { return aktivan; }
    public void setAktivan(Boolean aktivan) { this.aktivan = aktivan; }
}