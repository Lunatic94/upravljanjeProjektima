package rs.fakultet.upravljanjeprojektima.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rs.fakultet.upravljanjeprojektima.model.entity.Korisnik;
import rs.fakultet.upravljanjeprojektima.model.entity.Projekat;
import rs.fakultet.upravljanjeprojektima.model.enums.StatusProjekta;

import java.util.List;

@Repository
public interface ProjekatRepository extends JpaRepository<Projekat, Long> {
    
    List<Projekat> findByStatus(StatusProjekta status);
    
    List<Projekat> findByKreiraoPKorisnik(Korisnik korisnik);
    
    List<Projekat> findByMenadzer(Korisnik menadzer);
    
    @Query("SELECT p FROM Projekat p WHERE p.kreiraoPKorisnik = :korisnik OR p.menadzer = :korisnik")
    List<Projekat> findProjektiKorisnika(@Param("korisnik") Korisnik korisnik);
    
    @Query("SELECT DISTINCT p FROM Projekat p " +
           "LEFT JOIN p.clanovi cp " +
           "WHERE p.kreiraoPKorisnik = :korisnik OR p.menadzer = :korisnik OR cp.korisnik = :korisnik")
    List<Projekat> findSviProjektiKorisnika(@Param("korisnik") Korisnik korisnik);
    
    @Query("SELECT p FROM Projekat p WHERE " +
           "LOWER(p.naziv) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.opis) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Projekat> pretragaProjekta(@Param("search") String search);
    
    @Query("SELECT COUNT(p) FROM Projekat p WHERE p.status = :status")
    Long brojProjekataPoStatusu(@Param("status") StatusProjekta status);
}
