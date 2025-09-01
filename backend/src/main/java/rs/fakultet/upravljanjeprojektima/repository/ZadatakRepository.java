package rs.fakultet.upravljanjeprojektima.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rs.fakultet.upravljanjeprojektima.model.entity.Korisnik;
import rs.fakultet.upravljanjeprojektima.model.entity.Projekat;
import rs.fakultet.upravljanjeprojektima.model.entity.Zadatak;
import rs.fakultet.upravljanjeprojektima.model.enums.StatusZadatka;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ZadatakRepository extends JpaRepository<Zadatak, Long> {
    
    List<Zadatak> findByProjekat(Projekat projekat);
    
    List<Zadatak> findByDodeljen(Korisnik dodeljen);
    
    List<Zadatak> findByStatus(StatusZadatka status);
    
    List<Zadatak> findByKreiraoPKorisnik(Korisnik kreiraoPKorisnik);
    
    @Query("SELECT z FROM Zadatak z WHERE z.projekat = :projekat AND z.status = :status")
    List<Zadatak> findZadatkePoStatusuUProjektu(@Param("projekat") Projekat projekat, @Param("status") StatusZadatka status);
    
    @Query("SELECT z FROM Zadatak z WHERE z.dodeljen = :korisnik AND z.status IN :statusi")
    List<Zadatak> findAktivniZadaciKorisnika(@Param("korisnik") Korisnik korisnik, @Param("statusi") List<StatusZadatka> statusi);
    
    @Query("SELECT z FROM Zadatak z WHERE z.rokZavrsetka <= :datum AND z.status != 'ZAVRSENO'")
    List<Zadatak> findZadatkeKojiIsticu(@Param("datum") LocalDate datum);
    
    @Query("SELECT z FROM Zadatak z WHERE z.rokZavrsetka < :datum AND z.status != 'ZAVRSENO'")
    List<Zadatak> findKasneZadatke(@Param("datum") LocalDate datum);
    
    @Query("SELECT z FROM Zadatak z WHERE z.projekat = :projekat AND " +
           "(LOWER(z.naslov) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(z.opis) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Zadatak> pretragaZadataka(@Param("projekat") Projekat projekat, @Param("search") String search);
    
    @Query("SELECT COUNT(z) FROM Zadatak z WHERE z.projekat = :projekat AND z.status = :status")
    Long brojZadatakaPoStatusu(@Param("projekat") Projekat projekat, @Param("status") StatusZadatka status);
}