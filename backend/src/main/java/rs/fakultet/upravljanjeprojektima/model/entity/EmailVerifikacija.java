package rs.fakultet.upravljanjeprojektima.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "email_verifikacija")
public class EmailVerifikacija {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String token;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private LocalDateTime datumKreiranja;
    
    @Column(nullable = false)
    private LocalDateTime datumIsteka;
    
    @Column(nullable = false)
    private Boolean iskoriscen = false;
    
    @PrePersist
    protected void onCreate() {
        datumKreiranja = LocalDateTime.now();
        datumIsteka = LocalDateTime.now().plusHours(24); // Token važi 24 sata
    }
    
    // Konstruktori, getteri i setteri
    public EmailVerifikacija() {}
    
    public EmailVerifikacija(String token, String email) {
        this.token = token;
        this.email = email;
    }
    
    // ... getteri i setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public LocalDateTime getDatumKreiranja() { return datumKreiranja; }
    public void setDatumKreiranja(LocalDateTime datumKreiranja) { this.datumKreiranja = datumKreiranja; }
    
    public LocalDateTime getDatumIsteka() { return datumIsteka; }
    public void setDatumIsteka(LocalDateTime datumIsteka) { this.datumIsteka = datumIsteka; }
    
    public Boolean getIskoriscen() { return iskoriscen; }
    public void setIskoriscen(Boolean iskoriscen) { this.iskoriscen = iskoriscen; }
    
    public boolean isTokenValid() {
        return !iskoriscen && LocalDateTime.now().isBefore(datumIsteka);
    }
}
