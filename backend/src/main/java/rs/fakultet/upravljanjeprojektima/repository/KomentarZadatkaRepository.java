package rs.fakultet.upravljanjeprojektima.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rs.fakultet.upravljanjeprojektima.model.entity.KomentarZadatka;
import rs.fakultet.upravljanjeprojektima.model.entity.Korisnik;
import rs.fakultet.upravljanjeprojektima.model.entity.Zadatak;

import java.util.List;

@Repository
public interface KomentarZadatkaRepository extends JpaRepository<KomentarZadatka, Long> {
    
    List<KomentarZadatka> findByZadatakOrderByDatumKreiranjaDesc(Zadatak zadatak);
    
    List<KomentarZadatka> findByKorisnik(Korisnik korisnik);
    
    @Query("SELECT kz FROM KomentarZadatka kz WHERE kz.zadatak = :zadatak ORDER BY kz.datumKreiranja ASC")
    List<KomentarZadatka> findKomentareZadatkaHronoloski(@Param("zadatak") Zadatak zadatak);
    
    @Query("SELECT COUNT(kz) FROM KomentarZadatka kz WHERE kz.zadatak = :zadatak")
    Long brojKomentaraZadatka(@Param("zadatak") Zadatak zadatak);
}