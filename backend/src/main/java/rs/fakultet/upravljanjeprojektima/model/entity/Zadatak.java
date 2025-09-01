package rs.fakultet.upravljanjeprojektima.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import rs.fakultet.upravljanjeprojektima.model.enums.Prioritet;
import rs.fakultet.upravljanjeprojektima.model.enums.StatusZadatka;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "zadatak")
public class Zadatak {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    @NotBlank(message = "Naslov zadatka je obavezan")
    @Size(max = 200, message = "Naslov ne može biti duži od 200 karaktera")
    private String naslov;
    
    @Column(columnDefinition = "TEXT")
    private String opis;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusZadatka status = StatusZadatka.TREBA_URADITI;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Prioritet prioritet = Prioritet.SREDNJI;
    
    private Integer procenjeniSati;
    
    private Integer stvarniSati;
    
    private LocalDate rokZavrsetka;
    
    @Column(nullable = false)
    private LocalDateTime datumKreiranja;
    
    private LocalDateTime datumAzuriranja;
    
    // Relacije
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projekat_id", nullable = false)
    private Projekat projekat;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dodeljen_korisnik_id")
    private Korisnik dodeljen;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kreirao_korisnik_id", nullable = false)
    private Korisnik kreiraoPKorisnik;
    
    @OneToMany(mappedBy = "zadatak", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<KomentarZadatka> komentari;
    
    @OneToMany(mappedBy = "zadatak", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<PrilogZadatka> prilozi;
    
    @PrePersist
    protected void onCreate() {
        datumKreiranja = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        datumAzuriranja = LocalDateTime.now();
    }
    
    // Konstruktori
    public Zadatak() {}
    
    public Zadatak(String naslov, String opis, Projekat projekat, Korisnik kreiraoPKorisnik) {
        this.naslov = naslov;
        this.opis = opis;
        this.projekat = projekat;
        this.kreiraoPKorisnik = kreiraoPKorisnik;
    }
    
    // Getteri i Setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNaslov() { return naslov; }
    public void setNaslov(String naslov) { this.naslov = naslov; }
    
    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }
    
    public StatusZadatka getStatus() { return status; }
    public void setStatus(StatusZadatka status) { this.status = status; }
    
    public Prioritet getPrioritet() { return prioritet; }
    public void setPrioritet(Prioritet prioritet) { this.prioritet = prioritet; }
    
    public Integer getProcenjeniSati() { return procenjeniSati; }
    public void setProcenjeniSati(Integer procenjeniSati) { this.procenjeniSati = procenjeniSati; }
    
    public Integer getStvarniSati() { return stvarniSati; }
    public void setStvarniSati(Integer stvarniSati) { this.stvarniSati = stvarniSati; }
    
    public LocalDate getRokZavrsetka() { return rokZavrsetka; }
    public void setRokZavrsetka(LocalDate rokZavrsetka) { this.rokZavrsetka = rokZavrsetka; }
    
    public LocalDateTime getDatumKreiranja() { return datumKreiranja; }
    public void setDatumKreiranja(LocalDateTime datumKreiranja) { this.datumKreiranja = datumKreiranja; }
    
    public LocalDateTime getDatumAzuriranja() { return datumAzuriranja; }
    public void setDatumAzuriranja(LocalDateTime datumAzuriranja) { this.datumAzuriranja = datumAzuriranja; }
    
    public Projekat getProjekat() { return projekat; }
    public void setProjekat(Projekat projekat) { this.projekat = projekat; }
    
    public Korisnik getDodeljen() { return dodeljen; }
    public void setDodeljen(Korisnik dodeljen) { this.dodeljen = dodeljen; }
    
    public Korisnik getKreiraoPKorisnik() { return kreiraoPKorisnik; }
    public void setKreiraoPKorisnik(Korisnik kreiraoPKorisnik) { this.kreiraoPKorisnik = kreiraoPKorisnik; }
    
    public List<KomentarZadatka> getKomentari() { return komentari; }
    public void setKomentari(List<KomentarZadatka> komentari) { this.komentari = komentari; }
    
    public List<PrilogZadatka> getPrilozi() { return prilozi; }
    public void setPrilozi(List<PrilogZadatka> prilozi) { this.prilozi = prilozi; }
}