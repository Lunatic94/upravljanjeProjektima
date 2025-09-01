package rs.fakultet.upravljanjeprojektima.model.dto;

import jakarta.validation.constraints.NotBlank;

public class PrijavaRequest {
    
    @NotBlank(message = "Korisničko ime je obavezno")
    private String korisnickoIme;
    
    @NotBlank(message = "Lozinka je obavezna")
    private String lozinka;
    
    // Konstruktori
    public PrijavaRequest() {}
    
    public PrijavaRequest(String korisnickoIme, String lozinka) {
        this.korisnickoIme = korisnickoIme;
        this.lozinka = lozinka;
    }
    
    // Getteri i Setteri
    public String getKorisnickoIme() { return korisnickoIme; }
    public void setKorisnickoIme(String korisnickoIme) { this.korisnickoIme = korisnickoIme; }
    
    public String getLozinka() { return lozinka; }
    public void setLozinka(String lozinka) { this.lozinka = lozinka; }
}