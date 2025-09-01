package rs.fakultet.upravljanjeprojektima.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import rs.fakultet.upravljanjeprojektima.model.enums.Prioritet;
import rs.fakultet.upravljanjeprojektima.model.enums.StatusProjekta;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "projekat")
public class Projekat {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    @NotBlank(message = "Naziv projekta je obavezan")
    @Size(max = 100, message = "Naziv ne može biti duži od 100 karaktera")
    private String naziv;
    
    @Column(columnDefinition = "TEXT")
    private String opis;
    
    private LocalDate datumPocetka;
    
    private LocalDate datumZavrsetka;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusProjekta status = StatusProjekta.PLANIRANJE;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Prioritet prioritet = Prioritet.SREDNJI;
    
    @Column(nullable = false)
    private LocalDateTime datumKreiranja;
    
    private LocalDateTime datumAzuriranja;
    
    // Relacije
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kreirao_korisnik_id", nullable = false)
    private Korisnik kreiraoPKorisnik;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menadzer_id")
    private Korisnik menadzer;
    
    @OneToMany(mappedBy = "projekat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Zadatak> zadaci;
    
    @OneToMany(mappedBy = "projekat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ClanProjekta> clanovi;
    
    @OneToMany(mappedBy = "projekat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<AktivnostProjekta> aktivnosti;
    
    @PrePersist
    protected void onCreate() {
        datumKreiranja = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        datumAzuriranja = LocalDateTime.now();
    }
    
    // Konstruktori
    public Projekat() {}
    
    public Projekat(String naziv, String opis, Korisnik kreiraoPKorisnik) {
        this.naziv = naziv;
        this.opis = opis;
        this.kreiraoPKorisnik = kreiraoPKorisnik;
    }
    
    // Getteri i Setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNaziv() { return naziv; }
    public void setNaziv(String naziv) { this.naziv = naziv; }
    
    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }
    
    public LocalDate getDatumPocetka() { return datumPocetka; }
    public void setDatumPocetka(LocalDate datumPocetka) { this.datumPocetka = datumPocetka; }
    
    public LocalDate getDatumZavrsetka() { return datumZavrsetka; }
    public void setDatumZavrsetka(LocalDate datumZavrsetka) { this.datumZavrsetka = datumZavrsetka; }
    
    public StatusProjekta getStatus() { return status; }
    public void setStatus(StatusProjekta status) { this.status = status; }
    
    public Prioritet getPrioritet() { return prioritet; }
    public void setPrioritet(Prioritet prioritet) { this.prioritet = prioritet; }
    
    public LocalDateTime getDatumKreiranja() { return datumKreiranja; }
    public void setDatumKreiranja(LocalDateTime datumKreiranja) { this.datumKreiranja = datumKreiranja; }
    
    public LocalDateTime getDatumAzuriranja() { return datumAzuriranja; }
    public void setDatumAzuriranja(LocalDateTime datumAzuriranja) { this.datumAzuriranja = datumAzuriranja; }
    
    public Korisnik getKreiraoPKorisnik() { return kreiraoPKorisnik; }
    public void setKreiraoPKorisnik(Korisnik kreiraoPKorisnik) { this.kreiraoPKorisnik = kreiraoPKorisnik; }
    
    public Korisnik getMenadzer() { return menadzer; }
    public void setMenadzer(Korisnik menadzer) { this.menadzer = menadzer; }
    
    public List<Zadatak> getZadaci() { return zadaci; }
    public void setZadaci(List<Zadatak> zadaci) { this.zadaci = zadaci; }
    
    public List<ClanProjekta> getClanovi() { return clanovi; }
    public void setClanovi(List<ClanProjekta> clanovi) { this.clanovi = clanovi; }
    
    public List<AktivnostProjekta> getAktivnosti() { return aktivnosti; }
    public void setAktivnosti(List<AktivnostProjekta> aktivnosti) { this.aktivnosti = aktivnosti; }
}