package rs.fakultet.upravljanjeprojektima.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "prilog_zadatka")
public class PrilogZadatka {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zadatak_id", nullable = false)
    private Zadatak zadatak;
    
    @Column(nullable = false)
    @NotBlank(message = "Naziv fajla je obavezan")
    private String nazivFajla;
    
    @Column(nullable = false)
    @NotBlank(message = "Originalni naziv fajla je obavezan")
    private String originalniNazivFajla;
    
    @Column(nullable = false)
    @NotBlank(message = "Putanja fajla je obavezna")
    private String putanjaFajla;
    
    private Long velicineFajla;
    
    private String tipSadrzaja;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "okacio_korisnik_id", nullable = false)
    private Korisnik okacioKorisnik;
    
    @Column(nullable = false)
    private LocalDateTime datumOkacivanja;
    
    @PrePersist
    protected void onCreate() {
        datumOkacivanja = LocalDateTime.now();
    }
    
    // Konstruktori
    public PrilogZadatka() {}
    
    public PrilogZadatka(Zadatak zadatak, String nazivFajla, String originalniNazivFajla, 
                        String putanjaFajla, Long velicineFajla, String tipSadrzaja, Korisnik okacioKorisnik) {
        this.zadatak = zadatak;
        this.nazivFajla = nazivFajla;
        this.originalniNazivFajla = originalniNazivFajla;
        this.putanjaFajla = putanjaFajla;
        this.velicineFajla = velicineFajla;
        this.tipSadrzaja = tipSadrzaja;
        this.okacioKorisnik = okacioKorisnik;
    }
    
    // Getteri i Setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Zadatak getZadatak() { return zadatak; }
    public void setZadatak(Zadatak zadatak) { this.zadatak = zadatak; }
    
    public String getNazivFajla() { return nazivFajla; }
    public void setNazivFajla(String nazivFajla) { this.nazivFajla = nazivFajla; }
    
    public String getOriginalniNazivFajla() { return originalniNazivFajla; }
    public void setOriginalniNazivFajla(String originalniNazivFajla) { this.originalniNazivFajla = originalniNazivFajla; }
    
    public String getPutanjaFajla() { return putanjaFajla; }
    public void setPutanjaFajla(String putanjaFajla) { this.putanjaFajla = putanjaFajla; }
    
    public Long getVelicineFajla() { return velicineFajla; }
    public void setVelicineFajla(Long velicineFajla) { this.velicineFajla = velicineFajla; }
    
    public String getTipSadrzaja() { return tipSadrzaja; }
    public void setTipSadrzaja(String tipSadrzaja) { this.tipSadrzaja = tipSadrzaja; }
    
    public Korisnik getOkacioKorisnik() { return okacioKorisnik; }
    public void setOkacioKorisnik(Korisnik okacioKorisnik) { this.okacioKorisnik = okacioKorisnik; }
    
    public LocalDateTime getDatumOkacivanja() { return datumOkacivanja; }
    public void setDatumOkacivanja(LocalDateTime datumOkacivanja) { this.datumOkacivanja = datumOkacivanja; }
}