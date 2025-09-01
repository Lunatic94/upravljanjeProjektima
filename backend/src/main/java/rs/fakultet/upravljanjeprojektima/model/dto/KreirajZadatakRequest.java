package rs.fakultet.upravljanjeprojektima.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import rs.fakultet.upravljanjeprojektima.model.enums.Prioritet;

import java.time.LocalDate;

public class KreirajZadatakRequest {
    
    @NotBlank(message = "Naslov zadatka je obavezan")
    @Size(max = 200, message = "Naslov ne može biti duži od 200 karaktera")
    private String naslov;
    
    private String opis;
    private Prioritet prioritet = Prioritet.SREDNJI;
    private Integer procenjeniSati;
    private LocalDate rokZavrsetka;
    
    @NotNull(message = "ID projekta je obavezan")
    private Long projekatId;
    
    private Long dodeljKorisnikId;
    
    // Konstruktori
    public KreirajZadatakRequest() {}
    
    // Getteri i Setteri
    public String getNaslov() { return naslov; }
    public void setNaslov(String naslov) { this.naslov = naslov; }
    
    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }
    
    public Prioritet getPrioritet() { return prioritet; }
    public void setPrioritet(Prioritet prioritet) { this.prioritet = prioritet; }
    
    public Integer getProcenjeniSati() { return procenjeniSati; }
    public void setProcenjeniSati(Integer procenjeniSati) { this.procenjeniSati = procenjeniSati; }
    
    public LocalDate getRokZavrsetka() { return rokZavrsetka; }
    public void setRokZavrsetka(LocalDate rokZavrsetka) { this.rokZavrsetka = rokZavrsetka; }
    
    public Long getProjekatId() { return projekatId; }
    public void setProjekatId(Long projekatId) { this.projekatId = projekatId; }
    
    public Long getDodeljKorisnikId() { return dodeljKorisnikId; }
    public void setDodeljKorisnikId(Long dodeljKorisnikId) { this.dodeljKorisnikId = dodeljKorisnikId; }
}