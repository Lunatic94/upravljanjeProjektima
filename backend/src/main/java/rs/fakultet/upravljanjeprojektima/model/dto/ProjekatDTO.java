package rs.fakultet.upravljanjeprojektima.model.dto;

import rs.fakultet.upravljanjeprojektima.model.enums.Prioritet;
import rs.fakultet.upravljanjeprojektima.model.enums.StatusProjekta;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProjekatDTO {
    private Long id;
    private String naziv;
    private String opis;
    private LocalDate datumPocetka;
    private LocalDate datumZavrsetka;
    private StatusProjekta status;
    private Prioritet prioritet;
    private LocalDateTime datumKreiranja;
    private KorisnikDTO kreiraoPKorisnik;
    private KorisnikDTO menadzer;
    private Integer brojZadataka;
    private Integer brojClanova;
    
    // Konstruktori
    public ProjekatDTO() {}
    
    // Getteri i Setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNaziv() { return naziv; }
    public void setNaziv(String naziv) { this.naziv = naziv; }
    
    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }
    
    public LocalDate getDatumPocetka() { return datumPocetka; }
    public void setDatumPocetka(LocalDate datumPocetka) { this.datumPocetka = datumPocetka; }
    
    public LocalDate getDatumZavrsetka() { return datumZavrsetka; }
    public void setDatumZavrsetka(LocalDate datumZavrsetka) { this.datumZavrsetka = datumZavrsetka; }
    
    public StatusProjekta getStatus() { return status; }
    public void setStatus(StatusProjekta status) { this.status = status; }
    
    public Prioritet getPrioritet() { return prioritet; }
    public void setPrioritet(Prioritet prioritet) { this.prioritet = prioritet; }
    
    public LocalDateTime getDatumKreiranja() { return datumKreiranja; }
    public void setDatumKreiranja(LocalDateTime datumKreiranja) { this.datumKreiranja = datumKreiranja; }
    
    public KorisnikDTO getKreiraoPKorisnik() { return kreiraoPKorisnik; }
    public void setKreiraoPKorisnik(KorisnikDTO kreiraoPKorisnik) { this.kreiraoPKorisnik = kreiraoPKorisnik; }
    
    public KorisnikDTO getMenadzer() { return menadzer; }
    public void setMenadzer(KorisnikDTO menadzer) { this.menadzer = menadzer; }
    
    public Integer getBrojZadataka() { return brojZadataka; }
    public void setBrojZadataka(Integer brojZadataka) { this.brojZadataka = brojZadataka; }
    
    public Integer getBrojClanova() { return brojClanova; }
    public void setBrojClanova(Integer brojClanova) { this.brojClanova = brojClanova; }
}