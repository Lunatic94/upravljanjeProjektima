package rs.fakultet.upravljanjeprojektima.model.entity;

import jakarta.persistence.*;
import rs.fakultet.upravljanjeprojektima.model.enums.UlogaNaProjektu;

import java.time.LocalDateTime;

@Entity
@Table(name = "clan_projekta", uniqueConstraints = @UniqueConstraint(columnNames = {"projekat_id", "korisnik_id"}))
public class ClanProjekta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projekat_id", nullable = false)
    private Projekat projekat;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "korisnik_id", nullable = false)
    private Korisnik korisnik;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UlogaNaProjektu uloga;
    
    @Column(nullable = false)
    private LocalDateTime datumPridruzivanja;
    
    private LocalDateTime datumNapustanja;
    
    @Column(nullable = false)
    private Boolean aktivan = true;
    
    @PrePersist
    protected void onCreate() {
        datumPridruzivanja = LocalDateTime.now();
    }
    
    // Konstruktori
    public ClanProjekta() {}
    
    public ClanProjekta(Projekat projekat, Korisnik korisnik, UlogaNaProjektu uloga) {
        this.projekat = projekat;
        this.korisnik = korisnik;
        this.uloga = uloga;
    }
    
    // Getteri i Setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Projekat getProjekat() { return projekat; }
    public void setProjekat(Projekat projekat) { this.projekat = projekat; }
    
    public Korisnik getKorisnik() { return korisnik; }
    public void setKorisnik(Korisnik korisnik) { this.korisnik = korisnik; }
    
    public UlogaNaProjektu getUloga() { return uloga; }
    public void setUloga(UlogaNaProjektu uloga) { this.uloga = uloga; }
    
    public LocalDateTime getDatumPridruzivanja() { return datumPridruzivanja; }
    public void setDatumPridruzivanja(LocalDateTime datumPridruzivanja) { this.datumPridruzivanja = datumPridruzivanja; }
    
    public LocalDateTime getDatumNapustanja() { return datumNapustanja; }
    public void setDatumNapustanja(LocalDateTime datumNapustanja) { this.datumNapustanja = datumNapustanja; }
    
    public Boolean getAktivan() { return aktivan; }
    public void setAktivan(Boolean aktivan) { this.aktivan = aktivan; }
}