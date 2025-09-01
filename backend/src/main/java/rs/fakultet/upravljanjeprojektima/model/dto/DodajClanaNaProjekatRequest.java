package rs.fakultet.upravljanjeprojektima.model.dto;

import jakarta.validation.constraints.NotNull;
import rs.fakultet.upravljanjeprojektima.model.enums.UlogaNaProjektu;

public class DodajClanaNaProjekatRequest {
    
    @NotNull(message = "ID korisnika je obavezan")
    private Long korisnikId;
    
    private UlogaNaProjektu uloga = UlogaNaProjektu.PROGRAMER;
    
    // Konstruktori
    public DodajClanaNaProjekatRequest() {}
    
    // Getteri i Setteri
    public Long getKorisnikId() { return korisnikId; }
    public void setKorisnikId(Long korisnikId) { this.korisnikId = korisnikId; }
    
    public UlogaNaProjektu getUloga() { return uloga; }
    public void setUloga(UlogaNaProjektu uloga) { this.uloga = uloga; }
}