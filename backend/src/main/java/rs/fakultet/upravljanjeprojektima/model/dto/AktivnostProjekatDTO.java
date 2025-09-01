package rs.fakultet.upravljanjeprojektima.model.dto;

import rs.fakultet.upravljanjeprojektima.model.enums.TipAktivnosti;
import rs.fakultet.upravljanjeprojektima.model.enums.TipEntiteta;

import java.time.LocalDateTime;

public class AktivnostProjekatDTO {
    
    private Long id;
    private TipAktivnosti tipAktivnosti;
    private TipEntiteta tipEntiteta;
    private Long entitetId;
    private String opis;
    private LocalDateTime datumKreiranja;
    private KorisnikDTO korisnik;
    
    // Konstruktori
    public AktivnostProjekatDTO() {}
    
    public AktivnostProjekatDTO(Long id, TipAktivnosti tipAktivnosti, TipEntiteta tipEntiteta, 
                               Long entitetId, String opis, LocalDateTime datumKreiranja, KorisnikDTO korisnik) {
        this.id = id;
        this.tipAktivnosti = tipAktivnosti;
        this.tipEntiteta = tipEntiteta;
        this.entitetId = entitetId;
        this.opis = opis;
        this.datumKreiranja = datumKreiranja;
        this.korisnik = korisnik;
    }
    
    // Getteri i Setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
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
    
    public KorisnikDTO getKorisnik() { return korisnik; }
    public void setKorisnik(KorisnikDTO korisnik) { this.korisnik = korisnik; }
}