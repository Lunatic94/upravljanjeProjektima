package rs.fakultet.upravljanjeprojektima.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rs.fakultet.upravljanjeprojektima.model.entity.Korisnik;
import rs.fakultet.upravljanjeprojektima.model.enums.UlogaKorisnika;

import java.util.List;
import java.util.Optional;

@Repository
public interface KorisnikRepository extends JpaRepository<Korisnik, Long> {
    
    Optional<Korisnik> findByKorisnickoIme(String korisnickoIme);
    
    Optional<Korisnik> findByEmail(String email);
    
    boolean existsByKorisnickoIme(String korisnickoIme);
    
    boolean existsByEmail(String email);
    
    List<Korisnik> findByAktivan(Boolean aktivan);
    
    List<Korisnik> findByUloga(UlogaKorisnika uloga);
    
    @Query("SELECT k FROM Korisnik k WHERE k.aktivan = true AND " +
           "(LOWER(k.ime) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(k.prezime) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(k.korisnickoIme) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Korisnik> pretragaKorisnika(@Param("search") String search);
    
    @Query("SELECT k FROM Korisnik k WHERE k.uloga = :uloga AND k.aktivan = true")
    List<Korisnik> findAktivniKorisnikePOulozi(@Param("uloga") UlogaKorisnika uloga);
}