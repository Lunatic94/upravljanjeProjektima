package rs.fakultet.upravljanjeprojektima.model.entity;

import jakarta.persistence.*;
import rs.fakultet.upravljanjeprojektima.model.enums.TipAktivnosti;
import rs.fakultet.upravljanjeprojektima.model.enums.TipEntiteta;

import java.time.LocalDateTime;

@Entity
@Table(name = "aktivnost_projekta")
public class AktivnostProjekta {
    
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
    private TipAktivnosti tipAktivnosti;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipEntiteta tipEntiteta;
    
    private Long entitetId;
    
    @Column(columnDefinition = "TEXT")
    private String opis;
    
    @Column(nullable = false)
    private LocalDateTime datumKreiranja;
    
    @PrePersist
    protected void onCreate() {
        datumKreiranja = LocalDateTime.now();
    }
    
    // Konstruktori
    public AktivnostProjekta() {}
    
    public AktivnostProjekta(Projekat projekat, Korisnik korisnik, TipAktivnosti tipAktivnosti, 
                           TipEntiteta tipEntiteta, Long entitetId, String opis) {
        this.projekat = projekat;
        this.korisnik = korisnik;
        this.tipAktivnosti = tipAktivnosti;
        this.tipEntiteta = tipEntiteta;
        this.entitetId = entitetId;
        this.opis = opis;
    }
    
    // Getteri i Setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Projekat getProjekat() { return projekat; }
    public void setProjekat(Projekat projekat) { this.projekat = projekat; }
    
    public Korisnik getKorisnik() { return korisnik; }
    public void setKorisnik(Korisnik korisnik) { this.korisnik = korisnik; }
    
    public TipAktivnosti getTipAktivnosti() { return tipAktivnosti; }
    public void setTipAktivnosti(TipAktivnosti tipAktivnosti) { this.tipAktivnosti = tipAktivnosti; }
    
    public TipEntiteta getTipEntiteta() { return tipEntiteta; }
    public void setTipEntiteta(TipEntiteta tipEntiteta) { this.tipEntiteta = tipEntiteta; }
    
    public Long getEntitetId() { return entitetId; }
    public void setEntitetId(Long entitetId) { this.entitetId = entitetId; }
    
    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }
    
    public LocalDateTime getDatumKreiranja() { return datumKreiranja; }
    public void setDatumKreiranja(LocalDateTime datumKreiranja) { this.datumKreiranja = datumKreiranja; }
}