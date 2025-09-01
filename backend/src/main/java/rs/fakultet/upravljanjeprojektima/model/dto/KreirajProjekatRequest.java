package rs.fakultet.upravljanjeprojektima.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import rs.fakultet.upravljanjeprojektima.model.enums.Prioritet;

import java.time.LocalDate;

public class KreirajProjekatRequest {
    
    @NotBlank(message = "Naziv projekta je obavezan")
    @Size(max = 100, message = "Naziv ne može biti duži od 100 karaktera")
    private String naziv;
    
    private String opis;
    private LocalDate datumPocetka;
    private LocalDate datumZavrsetka;
    private Prioritet prioritet = Prioritet.SREDNJI;
    private Long menadzerId;
    
    // Konstruktori
    public KreirajProjekatRequest() {}
    
    // Getteri i Setteri
    public String getNaziv() { return naziv; }
    public void setNaziv(String naziv) { this.naziv = naziv; }
    
    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }
    
    public LocalDate getDatumPocetka() { return datumPocetka; }
    public void setDatumPocetka(LocalDate datumPocetka) { this.datumPocetka = datumPocetka; }
    
    public LocalDate getDatumZavrsetka() { return datumZavrsetka; }
    public void setDatumZavrsetka(LocalDate datumZavrsetka) { this.datumZavrsetka = datumZavrsetka; }
    
    public Prioritet getPrioritet() { return prioritet; }
    public void setPrioritet(Prioritet prioritet) { this.prioritet = prioritet; }
    
    public Long getMenadzerId() { return menadzerId; }
    public void setMenadzerId(Long menadzerId) { this.menadzerId = menadzerId; }
}