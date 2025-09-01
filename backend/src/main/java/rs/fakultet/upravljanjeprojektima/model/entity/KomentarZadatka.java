package rs.fakultet.upravljanjeprojektima.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "komentar_zadatka")
public class KomentarZadatka {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zadatak_id", nullable = false)
    private Zadatak zadatak;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "korisnik_id", nullable = false)
    private Korisnik korisnik;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "Sadržaj komentara je obavezan")
    private String sadrzaj;
    
    @Column(nullable = false)
    private LocalDateTime datumKreiranja;
    
    private LocalDateTime datumAzuriranja;
    
    @PrePersist
    protected void onCreate() {
        datumKreiranja = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        datumAzuriranja = LocalDateTime.now();
    }
    
    // Konstruktori
    public KomentarZadatka() {}
    
    public KomentarZadatka(Zadatak zadatak, Korisnik korisnik, String sadrzaj) {
        this.zadatak = zadatak;
        this.korisnik = korisnik;
        this.sadrzaj = sadrzaj;
    }
    
    // Getteri i Setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Zadatak getZadatak() { return zadatak; }
    public void setZadatak(Zadatak zadatak) { this.zadatak = zadatak; }
    
    public Korisnik getKorisnik() { return korisnik; }
    public void setKorisnik(Korisnik korisnik) { this.korisnik = korisnik; }
    
    public String getSadrzaj() { return sadrzaj; }
    public void setSadrzaj(String sadrzaj) { this.sadrzaj = sadrzaj; }
    
    public LocalDateTime getDatumKreiranja() { return datumKreiranja; }
    public void setDatumKreiranja(LocalDateTime datumKreiranja) { this.datumKreiranja = datumKreiranja; }
    
    public LocalDateTime getDatumAzuriranja() { return datumAzuriranja; }
    public void setDatumAzuriranja(LocalDateTime datumAzuriranja) { this.datumAzuriranja = datumAzuriranja; }
}