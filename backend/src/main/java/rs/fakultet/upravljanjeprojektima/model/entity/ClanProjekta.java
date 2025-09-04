package rs.fakultet.upravljanjeprojektima.model.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import rs.fakultet.upravljanjeprojektima.model.enums.UlogaNaProjektu;

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
    
    // IZMENA: Umesto jedne uloge, sada imamo listu uloga
    @ElementCollection(targetClass = UlogaNaProjektu.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(
        name = "clan_projekta_uloge",
        joinColumns = @JoinColumn(name = "clan_projekta_id")
    )
    @Column(name = "uloga")
    private Set<UlogaNaProjektu> uloge = new HashSet<>();
    
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
        this.uloge = new HashSet<>();
        this.uloge.add(uloga);
    }
    
    public ClanProjekta(Projekat projekat, Korisnik korisnik, Set<UlogaNaProjektu> uloge) {
        this.projekat = projekat;
        this.korisnik = korisnik;
        this.uloge = uloge != null ? uloge : new HashSet<>();
    }
    
    // Getteri i Setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Projekat getProjekat() { return projekat; }
    public void setProjekat(Projekat projekat) { this.projekat = projekat; }
    
    public Korisnik getKorisnik() { return korisnik; }
    public void setKorisnik(Korisnik korisnik) { this.korisnik = korisnik; }
    
    public Set<UlogaNaProjektu> getUloge() { return uloge; }
    public void setUloge(Set<UlogaNaProjektu> uloge) { this.uloge = uloge; }
    
    public LocalDateTime getDatumPridruzivanja() { return datumPridruzivanja; }
    public void setDatumPridruzivanja(LocalDateTime datumPridruzivanja) { this.datumPridruzivanja = datumPridruzivanja; }
    
    public LocalDateTime getDatumNapustanja() { return datumNapustanja; }
    public void setDatumNapustanja(LocalDateTime datumNapustanja) { this.datumNapustanja = datumNapustanja; }
    
    public Boolean getAktivan() { return aktivan; }
    public void setAktivan(Boolean aktivan) { this.aktivan = aktivan; }
    
    // Helper metode za rad sa ulogama
    public void dodajUlogu(UlogaNaProjektu uloga) {
        if (this.uloge == null) {
            this.uloge = new HashSet<>();
        }
        this.uloge.add(uloga);
    }
    
    public void ukloniUlogu(UlogaNaProjektu uloga) {
        if (this.uloge != null) {
            this.uloge.remove(uloga);
        }
    }
    
    public boolean imaUlogu(UlogaNaProjektu uloga) {
        return this.uloge != null && this.uloge.contains(uloga);
    }
    
    public boolean imaBiloKojuUlogu() {
        return this.uloge != null && !this.uloge.isEmpty();
    }
}