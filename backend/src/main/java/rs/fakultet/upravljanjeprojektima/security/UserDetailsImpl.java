package rs.fakultet.upravljanjeprojektima.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import rs.fakultet.upravljanjeprojektima.model.entity.Korisnik;

import java.util.Collection;
import java.util.Collections;
import java.util.Objects;

public class UserDetailsImpl implements UserDetails {
    
    private Long id;
    private String korisnickoIme;
    private String ime;
    private String prezime;
    private String email;
    private boolean aktivan;
    
    @JsonIgnore
    private String lozinka;
    
    private Collection<? extends GrantedAuthority> authorities;
    
    public UserDetailsImpl(Long id, String korisnickoIme, String prezime, String ime, String email, boolean aktivan, String lozinka,
                          Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.korisnickoIme = korisnickoIme;
        this.email = email;
        this.ime = ime;
        this.prezime = prezime;
        this.aktivan = aktivan;
        this.lozinka = lozinka;
        this.authorities = authorities;
    }
    
    public static UserDetailsImpl build(Korisnik korisnik) {
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + korisnik.getUloga().name());
        
        return new UserDetailsImpl(
                korisnik.getId(),
                korisnik.getKorisnickoIme(),
                korisnik.getIme(),
                korisnik.getPrezime(),
                korisnik.getEmail(),
                korisnik.getAktivan(),
                korisnik.getLozinka(),
                Collections.singletonList(authority)
        );
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    
    public Long getId() {
        return id;
    }
    
    public String getEmail() {
        return email;
    }
    
    @Override
    public String getPassword() {
        return lozinka;
    }
    
    @Override
    public String getUsername() {
        return korisnickoIme;
    }

    
    public String getIme() {
        return ime;
    }

    public String getPrezime() {
        return prezime;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return true;
    }
    public boolean isAktivan() {
        return aktivan;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDetailsImpl that = (UserDetailsImpl) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}