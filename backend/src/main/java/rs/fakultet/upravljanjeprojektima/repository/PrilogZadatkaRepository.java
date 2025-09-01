package rs.fakultet.upravljanjeprojektima.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rs.fakultet.upravljanjeprojektima.model.entity.PrilogZadatka;
import rs.fakultet.upravljanjeprojektima.model.entity.Zadatak;

import java.util.List;

@Repository
public interface PrilogZadatkaRepository extends JpaRepository<PrilogZadatka, Long> {
    
    List<PrilogZadatka> findByZadatakOrderByDatumOkacivanja(Zadatak zadatak);
    
    List<PrilogZadatka> findByTipSadrzaja(String tipSadrzaja);
}