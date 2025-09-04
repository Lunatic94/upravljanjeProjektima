package rs.fakultet.upravljanjeprojektima.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rs.fakultet.upravljanjeprojektima.model.entity.ClanProjekta;
import rs.fakultet.upravljanjeprojektima.model.entity.Korisnik;
import rs.fakultet.upravljanjeprojektima.model.entity.Projekat;
import rs.fakultet.upravljanjeprojektima.model.enums.UlogaNaProjektu;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClanProjekatRepository extends JpaRepository<ClanProjekta, Long> {
    
    List<ClanProjekta> findByProjekat(Projekat projekat);
    
    List<ClanProjekta> findByKorisnik(Korisnik korisnik);
    
    List<ClanProjekta> findByProjekatAndAktivan(Projekat projekat, Boolean aktivan);
    
    List<ClanProjekta> findByKorisnikAndAktivan(Korisnik korisnik, Boolean aktivan);
    
    Optional<ClanProjekta> findByProjekatAndKorisnikAndAktivan(Projekat projekat, Korisnik korisnik, Boolean aktivan);

    Optional<ClanProjekta> findByProjekatAndKorisnik(Projekat projekat, Korisnik korisnik);

    
    // Nova query za pronalaženje članova sa specifičnom ulogom
    @Query("SELECT cp FROM ClanProjekta cp JOIN cp.uloge u WHERE cp.projekat = :projekat AND u = :uloga AND cp.aktivan = true")
    List<ClanProjekta> findClanovePoUlozi(@Param("projekat") Projekat projekat, @Param("uloga") UlogaNaProjektu uloga);
    
    @Query("SELECT COUNT(cp) FROM ClanProjekta cp WHERE cp.projekat = :projekat AND cp.aktivan = true")
    Long brojAktivnihClanova(@Param("projekat") Projekat projekat);
    
    boolean existsByProjekatAndKorisnikAndAktivan(Projekat projekat, Korisnik korisnik, Boolean aktivan);
}