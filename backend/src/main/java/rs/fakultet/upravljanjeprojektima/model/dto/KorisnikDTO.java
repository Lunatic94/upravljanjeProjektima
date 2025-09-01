package rs.fakultet.upravljanjeprojektima.model.dto;

import rs.fakultet.upravljanjeprojektima.model.enums.UlogaKorisnika;

import java.time.LocalDateTime;

public class KorisnikDTO {
    private Long id;
    private String korisnickoIme;
    private String email;
    private String ime;
    private String prezime;
    private UlogaKorisnika uloga;
    private LocalDateTime datumKreiranja;
    private Boolean aktivan;
    
    // Konstruktori
    public KorisnikDTO() {}
    
    public KorisnikDTO(Long id, String korisnickoIme, String email, String ime, String prezime, UlogaKorisnika uloga) {
        this.id = id;
        this.korisnickoIme = korisnickoIme;
        this.email = email;
        this.ime = ime;
        this.prezime = prezime;
        this.uloga = uloga;
    }
    
    // Getteri i Setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getKorisnickoIme() { return korisnickoIme; }
    public void setKorisnickoIme(String korisnickoIme) { this.korisnickoIme = korisnickoIme; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getIme() { return ime; }
    public void setIme(String ime) { this.ime = ime; }
    
    public String getPrezime() { return prezime; }
    public void setPrezime(String prezime) { this.prezime = prezime; }
    
    public UlogaKorisnika getUloga() { return uloga; }
    public void setUloga(UlogaKorisnika uloga) { this.uloga = uloga; }
    
    public LocalDateTime getDatumKreiranja() { return datumKreiranja; }
    public void setDatumKreiranja(LocalDateTime datumKreiranja) { this.datumKreiranja = datumKreiranja; }
    
    public Boolean getAktivan() { return aktivan; }
    public void setAktivan(Boolean aktivan) { this.aktivan = aktivan; }
    
    public String getPunoIme() {
        return ime + " " + prezime;
    }
}