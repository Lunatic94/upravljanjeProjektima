package rs.fakultet.upravljanjeprojektima.model.dto;

import rs.fakultet.upravljanjeprojektima.model.enums.Prioritet;
import rs.fakultet.upravljanjeprojektima.model.enums.StatusZadatka;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ZadatakDTO {
    private Long id;
    private String naslov;
    private String opis;
    private StatusZadatka status;
    private Prioritet prioritet;
    private Integer procenjeniSati;
    private Integer stvarniSati;
    private LocalDate rokZavrsetka;
    private LocalDateTime datumKreiranja;
    private Long projekatId;
    private String nazivProjekta;
    private KorisnikDTO dodeljen;
    private KorisnikDTO kreiraoPKorisnik;
    private Integer brojKomentara;
    private Integer brojPriloga;
    
    // Konstruktori
    public ZadatakDTO() {}
    
    // Getteri i Setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNaslov() { return naslov; }
    public void setNaslov(String naslov) { this.naslov = naslov; }
    
    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }
    
    public StatusZadatka getStatus() { return status; }
    public void setStatus(StatusZadatka status) { this.status = status; }
    
    public Prioritet getPrioritet() { return prioritet; }
    public void setPrioritet(Prioritet prioritet) { this.prioritet = prioritet; }
    
    public Integer getProcenjeniSati() { return procenjeniSati; }
    public void setProcenjeniSati(Integer procenjeniSati) { this.procenjeniSati = procenjeniSati; }
    
    public Integer getStvarniSati() { return stvarniSati; }
    public void setStvarniSati(Integer stvarniSati) { this.stvarniSati = stvarniSati; }
    
    public LocalDate getRokZavrsetka() { return rokZavrsetka; }
    public void setRokZavrsetka(LocalDate rokZavrsetka) { this.rokZavrsetka = rokZavrsetka; }
    
    public LocalDateTime getDatumKreiranja() { return datumKreiranja; }
    public void setDatumKreiranja(LocalDateTime datumKreiranja) { this.datumKreiranja = datumKreiranja; }
    
    public Long getProjekatId() { return projekatId; }
    public void setProjekatId(Long projekatId) { this.projekatId = projekatId; }
    
    public String getNazivProjekta() { return nazivProjekta; }
    public void setNazivProjekta(String nazivProjekta) { this.nazivProjekta = nazivProjekta; }
    
    public KorisnikDTO getDodeljen() { return dodeljen; }
    public void setDodeljen(KorisnikDTO dodeljen) { this.dodeljen = dodeljen; }
    
    public KorisnikDTO getKreiraoPKorisnik() { return kreiraoPKorisnik; }
    public void setKreiraoPKorisnik(KorisnikDTO kreiraoPKorisnik) { this.kreiraoPKorisnik = kreiraoPKorisnik; }
    
    public Integer getBrojKomentara() { return brojKomentara; }
    public void setBrojKomentara(Integer brojKomentara) { this.brojKomentara = brojKomentara; }
    
    public Integer getBrojPriloga() { return brojPriloga; }
    public void setBrojPriloga(Integer brojPriloga) { this.brojPriloga = brojPriloga; }
}