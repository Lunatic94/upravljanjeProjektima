package rs.fakultet.upravljanjeprojektima.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rs.fakultet.upravljanjeprojektima.model.entity.AktivnostProjekta;
import rs.fakultet.upravljanjeprojektima.model.entity.Korisnik;
import rs.fakultet.upravljanjeprojektima.model.entity.Projekat;
import rs.fakultet.upravljanjeprojektima.model.enums.TipAktivnosti;
import rs.fakultet.upravljanjeprojektima.model.enums.TipEntiteta;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AktivnostProjekatRepository extends JpaRepository<AktivnostProjekta, Long> {
    
    Page<AktivnostProjekta> findByProjekatOrderByDatumKreiranjaDesc(Projekat projekat, Pageable pageable);
    
    List<AktivnostProjekta> findByKorisnikOrderByDatumKreiranjaDesc(Korisnik korisnik);
    
    List<AktivnostProjekta> findByTipAktivnosti(TipAktivnosti tipAktivnosti);
    
    @Query("SELECT ap FROM AktivnostProjekta ap WHERE ap.projekat = :projekat AND ap.tipAktivnosti = :tip ORDER BY ap.datumKreiranja DESC")
    List<AktivnostProjekta> findAktivnostiPoTipu(@Param("projekat") Projekat projekat, @Param("tip") TipAktivnosti tip);
    
    @Query("SELECT ap FROM AktivnostProjekta ap WHERE ap.projekat = :projekat AND ap.datumKreiranja >= :odDatum ORDER BY ap.datumKreiranja DESC")
    List<AktivnostProjekta> findNedavneAktivnosti(@Param("projekat") Projekat projekat, @Param("odDatum") LocalDateTime odDatum);
    
    @Query("SELECT ap FROM AktivnostProjekta ap WHERE ap.tipEntiteta = :tipEntiteta AND ap.entitetId = :entitetId ORDER BY ap.datumKreiranja DESC")
    List<AktivnostProjekta> findAktivnostiEntiteta(@Param("tipEntiteta") TipEntiteta tipEntiteta, @Param("entitetId") Long entitetId);

    Page<AktivnostProjekta> findByProjekatAndTipAktivnostiOrderByDatumKreiranjaDesc(Projekat projekat, TipAktivnosti tipAktivnosti, Pageable pageable);
}