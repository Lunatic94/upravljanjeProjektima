package rs.fakultet.upravljanjeprojektima.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import rs.fakultet.upravljanjeprojektima.model.enums.UlogaKorisnika;
import com.fasterxml.jackson.annotation.JsonIgnore;

import io.micrometer.common.lang.Nullable;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "korisnik")
public class Korisnik {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    @NotBlank(message = "Korisničko ime je obavezno")
    @Size(min = 3, max = 50, message = "Korisničko ime mora imati između 3 i 50 karaktera")
    private String korisnickoIme;
    
    @Column(unique = true, nullable = false)
    @Email(message = "Email mora biti valjan")
    @NotBlank(message = "Email je obavezan")
    private String email;
    
    @Column(nullable = false)
    @NotBlank(message = "Lozinka je obavezna")
    @Size(min = 6, message = "Lozinka mora imati najmanje 6 karaktera")
    @JsonIgnore
    private String lozinka;
    
    @Column(nullable = false)
    @NotBlank(message = "Ime je obavezno")
    private String ime;
    
    @Column(nullable = false)
    @NotBlank(message = "Prezime je obavezno")
    private String prezime;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UlogaKorisnika uloga;
    
    @Column(nullable = false)
    private LocalDateTime datumKreiranja;
    
    private LocalDateTime datumAzuriranja;
    
    @Column(nullable = false)
    private Boolean aktivan = true;

    @Column(nullable = false)
    private Boolean emailVerifikovan = false;

    @Column
    private LocalDateTime datumEmailVerifikacije;
    
    // Relacije
    @OneToMany(mappedBy = "kreiraoPKorisnik", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Projekat> kreiraoProjekte;
    
    @OneToMany(mappedBy = "menadzer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Projekat> menadzovaniProjekti;
    
    @OneToMany(mappedBy = "kreiraoPKorisnik", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Zadatak> kreiroZadatke;
    
    @OneToMany(mappedBy = "dodeljen", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Zadatak> dodeljeniZadaci;
    
    @OneToMany(mappedBy = "korisnik", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ClanProjekta> clanstvaProjekta;
    
    @OneToMany(mappedBy = "korisnik", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<SesijaKorisnika> sesije;
    
    @PrePersist
    protected void onCreate() {
        datumKreiranja = LocalDateTime.now();
    }
    
    @PreUpdate
    @Nullable
    protected void onUpdate() {
        datumAzuriranja = LocalDateTime.now();
    }
    
    // Konstruktori
    public Korisnik() {}
    
    public Korisnik(String korisnickoIme, String email, String lozinka, String ime, String prezime, UlogaKorisnika uloga) {
        this.korisnickoIme = korisnickoIme;
        this.email = email;
        this.lozinka = lozinka;
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
    
    public String getLozinka() { return lozinka; }
    public void setLozinka(String lozinka) { this.lozinka = lozinka; }
    
    public String getIme() { return ime; }
    public void setIme(String ime) { this.ime = ime; }
    
    public String getPrezime() { return prezime; }
    public void setPrezime(String prezime) { this.prezime = prezime; }
    
    public UlogaKorisnika getUloga() { return uloga; }
    public void setUloga(UlogaKorisnika uloga) { this.uloga = uloga; }
    
    public LocalDateTime getDatumKreiranja() { return datumKreiranja; }
    public void setDatumKreiranja(LocalDateTime datumKreiranja) { this.datumKreiranja = datumKreiranja; }
    
    public LocalDateTime getDatumAzuriranja() { return datumAzuriranja; }
    public void setDatumAzuriranja(LocalDateTime datumAzuriranja) { this.datumAzuriranja = datumAzuriranja; }
    
    public Boolean getAktivan() { return aktivan; }
    public void setAktivan(Boolean aktivan) { this.aktivan = aktivan; }

    public Boolean getEmailVerifikovan() { return emailVerifikovan; }
    public void setEmailVerifikovan(Boolean emailVerifikovan) { this.emailVerifikovan = emailVerifikovan; }

    public LocalDateTime getDatumEmailVerifikacije() { return datumEmailVerifikacije; }
    
    public void setDatumEmailVerifikacije(LocalDateTime datumEmailVerifikacije) { 
        this.datumEmailVerifikacije = datumEmailVerifikacije; 
    }
    
    public List<Projekat> getKreiraoProjekte() { return kreiraoProjekte; }
    public void setKreiraoProjekte(List<Projekat> kreiraoProjekte) { this.kreiraoProjekte = kreiraoProjekte; }
    
    public List<Projekat> getMenadzovaniProjekti() { return menadzovaniProjekti; }
    public void setMenadzovaniProjekti(List<Projekat> menadzovaniProjekti) { this.menadzovaniProjekti = menadzovaniProjekti; }
    
    public List<Zadatak> getKreiroZadatke() { return kreiroZadatke; }
    public void setKreiroZadatke(List<Zadatak> kreiroZadatke) { this.kreiroZadatke = kreiroZadatke; }
    
    public List<Zadatak> getDodeljeniZadaci() { return dodeljeniZadaci; }
    public void setDodeljeniZadaci(List<Zadatak> dodeljeniZadaci) { this.dodeljeniZadaci = dodeljeniZadaci; }
    
    public List<ClanProjekta> getClanstvaProjekta() { return clanstvaProjekta; }
    public void setClanstvaProjekta(List<ClanProjekta> clanstvaProjekta) { this.clanstvaProjekta = clanstvaProjekta; }
    
    public List<SesijaKorisnika> getSesije() { return sesije; }
    public void setSesije(List<SesijaKorisnika> sesije) { this.sesije = sesije; }
    
    public String getPunoIme() {
        return ime + " " + prezime;
    }
}