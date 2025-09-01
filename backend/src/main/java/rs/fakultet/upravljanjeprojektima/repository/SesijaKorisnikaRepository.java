package rs.fakultet.upravljanjeprojektima.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rs.fakultet.upravljanjeprojektima.model.entity.Korisnik;
import rs.fakultet.upravljanjeprojektima.model.entity.SesijaKorisnika;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SesijaKorisnikaRepository extends JpaRepository<SesijaKorisnika, Long> {
    
    Optional<SesijaKorisnika> findByTokenAndAktivan(String token, Boolean aktivan);
    
    List<SesijaKorisnika> findByKorisnikAndAktivan(Korisnik korisnik, Boolean aktivan);
    
    @Modifying
    @Query("UPDATE SesijaKorisnika s SET s.aktivan = false WHERE s.korisnik = :korisnik AND s.aktivan = true")
    void deaktivirajSveSesijeKorisnika(@Param("korisnik") Korisnik korisnik);
    
    @Modifying
    @Query("UPDATE SesijaKorisnika s SET s.aktivan = false WHERE s.datumIsteka < :datum")
    void deaktivirajIstekleSesije(@Param("datum") LocalDateTime datum);
    
    @Query("SELECT s FROM SesijaKorisnika s WHERE s.datumIsteka < :datum AND s.aktivan = true")
    List<SesijaKorisnika> findIstekleSesije(@Param("datum") LocalDateTime datum);
}