package rs.fakultet.upravljanjeprojektima.model.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class KreirajKomentarRequest {
    
    @NotBlank(message = "Sadržaj komentara je obavezan")
    @Size(max = 1000, message = "Komentar ne može biti duži od 1000 karaktera")
    private String sadrzaj;
    
    // Konstruktori
    public KreirajKomentarRequest() {}
    
    public KreirajKomentarRequest(String sadrzaj) {
        this.sadrzaj = sadrzaj;
    }
    
    // Getteri i Setteri
    public String getSadrzaj() { return sadrzaj; }
    public void setSadrzaj(String sadrzaj) { this.sadrzaj = sadrzaj; }
}