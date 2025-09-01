package rs.fakultet.upravljanjeprojektima.model.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sesija_korisnika")
public class SesijaKorisnika {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "korisnik_id", nullable = false)
    private Korisnik korisnik;
    
    @Column(unique = true, nullable = false, length = 500)
    private String token;
    
    @Column(nullable = false)
    private LocalDateTime datumKreiranja;
    
    @Column(nullable = false)
    private LocalDateTime datumIsteka;
    
    @Column(nullable = false)
    private Boolean aktivan = true;
    
    @PrePersist
    protected void onCreate() {
        datumKreiranja = LocalDateTime.now();
    }
    
    // Konstruktori
    public SesijaKorisnika() {}
    
    public SesijaKorisnika(Korisnik korisnik, String token, LocalDateTime datumIsteka) {
        this.korisnik = korisnik;
        this.token = token;
        this.datumIsteka = datumIsteka;
    }
    
    // Getteri i Setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Korisnik getKorisnik() { return korisnik; }
    public void setKorisnik(Korisnik korisnik) { this.korisnik = korisnik; }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public LocalDateTime getDatumKreiranja() { return datumKreiranja; }
    public void setDatumKreiranja(LocalDateTime datumKreiranja) { this.datumKreiranja = datumKreiranja; }
    
    public LocalDateTime getDatumIsteka() { return datumIsteka; }
    public void setDatumIsteka(LocalDateTime datumIsteka) { this.datumIsteka = datumIsteka; }
    
    public Boolean getAktivan() { return aktivan; }
    public void setAktivan(Boolean aktivan) { this.aktivan = aktivan; }
    
    public boolean isIstekao() {
        return LocalDateTime.now().isAfter(datumIsteka);
    }
}