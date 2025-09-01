package rs.fakultet.upravljanjeprojektima.model.dto;

import java.time.LocalDateTime;

public class KomentarZadatkaDTO {
    private Long id;
    private String sadrzaj;
    private LocalDateTime datumKreiranja;
    private LocalDateTime datumAzuriranja;
    private Long zadatakId;
    private KorisnikDTO korisnik;
    
    // Konstruktori
    public KomentarZadatkaDTO() {}
    
    // Getteri i Setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getSadrzaj() { return sadrzaj; }
    public void setSadrzaj(String sadrzaj) { this.sadrzaj = sadrzaj; }
    
    public LocalDateTime getDatumKreiranja() { return datumKreiranja; }
    public void setDatumKreiranja(LocalDateTime datumKreiranja) { this.datumKreiranja = datumKreiranja; }
    
    public LocalDateTime getDatumAzuriranja() { return datumAzuriranja; }
    public void setDatumAzuriranja(LocalDateTime datumAzuriranja) { this.datumAzuriranja = datumAzuriranja; }
    
    public Long getZadatakId() { return zadatakId; }
    public void setZadatakId(Long zadatakId) { this.zadatakId = zadatakId; }
    
    public KorisnikDTO getKorisnik() { return korisnik; }
    public void setKorisnik(KorisnikDTO korisnik) { this.korisnik = korisnik; }
}