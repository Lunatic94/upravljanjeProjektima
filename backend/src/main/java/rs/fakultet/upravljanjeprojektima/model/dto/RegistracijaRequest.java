package rs.fakultet.upravljanjeprojektima.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import rs.fakultet.upravljanjeprojektima.model.enums.UlogaKorisnika;

public class RegistracijaRequest {
    
    @NotBlank(message = "Korisničko ime je obavezno")
    @Size(min = 3, max = 50, message = "Korisničko ime mora imati između 3 i 50 karaktera")
    private String korisnickoIme;
    
    @NotBlank(message = "Email je obavezan")
    @Email(message = "Email mora biti valjan")
    private String email;
    
    @NotBlank(message = "Lozinka je obavezna")
    @Size(min = 6, message = "Lozinka mora imati najmanje 6 karaktera")
    private String lozinka;
    
    @NotBlank(message = "Ime je obavezno")
    private String ime;
    
    @NotBlank(message = "Prezime je obavezno")
    private String prezime;
    
    private UlogaKorisnika uloga = UlogaKorisnika.PROGRAMER;
    
    // Konstruktori
    public RegistracijaRequest() {}
    
    // Getteri i Setteri
    public String getKorisnickoIme() { return korisnickoIme; }
    public void setKorisnickoIme(String korisnickoIme) { this.korisnickoIme = korisnickoIme; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getLozinka() { return lozinka; }
    public void setLozinka(String lozinka) { this.lozinka = lozinka; }
    
    public String getIme() { return ime; }
    public void setIme(String ime) { this.ime = ime; }
    
    public String getPrezime() { return prezime; }
    public void setPrezime(String prezime) { this.prezime = prezime; }
    
    public UlogaKorisnika getUloga() { return uloga; }
    public void setUloga(UlogaKorisnika uloga) { this.uloga = uloga; }
}
