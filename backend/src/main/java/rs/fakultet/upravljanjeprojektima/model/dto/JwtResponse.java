package rs.fakultet.upravljanjeprojektima.model.dto;

public class JwtResponse {
    private String token;
    private String tip = "Bearer";
    private Long id;
    private String korisnickoIme;
    private String email;
    private String punoIme;
    private String ime;
    private String prezime;
    private String uloga;
    private String aktivan;
    
    //  Konstruktori
    public JwtResponse() {}
    
    public JwtResponse(String token, Long id, String korisnickoIme, String email, String punoIme, String ime, String prezime, String aktivan, String uloga) {
        this.token = token;
        this.id = id;
        this.korisnickoIme = korisnickoIme;
        this.email = email;
        this.punoIme = punoIme;
        this.ime = ime;
        this.prezime = prezime;
        this.aktivan = aktivan;
        this.uloga = uloga;
    }
    
    // Getteri i Setteri
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getTip() { return tip; }
    public void setTip(String tip) { this.tip = tip; }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getKorisnickoIme() { return korisnickoIme; }
    public void setKorisnickoIme(String korisnickoIme) { this.korisnickoIme = korisnickoIme; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPunoIme() { return punoIme; }
    public void setPunoIme(String punoIme) { this.punoIme = punoIme; }

    public String getIme() { return ime; }
    public void setIme(String ime) { this.ime = ime; }

    public String getPrezime() { return prezime; }
    public void setPrezime(String prezime) { this.prezime = prezime; }
    
    public String getUloga() { return uloga; }
    public void setUloga(String uloga) { this.uloga = uloga; }
}