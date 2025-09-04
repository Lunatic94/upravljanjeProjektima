package rs.fakultet.upravljanjeprojektima.model.dto;

import jakarta.validation.constraints.NotNull;
import rs.fakultet.upravljanjeprojektima.model.enums.UlogaNaProjektu;

public class UpravljajUlogamaRequest {
    
    @NotNull(message = "ID korisnika je obavezan")
    private Long korisnikId;
    
    @NotNull(message = "Uloga je obavezna")
    private UlogaNaProjektu uloga;
    
    @NotNull(message = "Akcija je obavezna")
    private Akcija akcija;
    
    public enum Akcija {
        DODAJ, UKLONI
    }
    
    // Konstruktori
    public UpravljajUlogamaRequest() {}
    
    public UpravljajUlogamaRequest(Long korisnikId, UlogaNaProjektu uloga, Akcija akcija) {
        this.korisnikId = korisnikId;
        this.uloga = uloga;
        this.akcija = akcija;
    }
    
    // Getteri i Setteri
    public Long getKorisnikId() { return korisnikId; }
    public void setKorisnikId(Long korisnikId) { this.korisnikId = korisnikId; }
    
    public UlogaNaProjektu getUloga() { return uloga; }
    public void setUloga(UlogaNaProjektu uloga) { this.uloga = uloga; }
    
    public Akcija getAkcija() { return akcija; }
    public void setAkcija(Akcija akcija) { this.akcija = akcija; }
}