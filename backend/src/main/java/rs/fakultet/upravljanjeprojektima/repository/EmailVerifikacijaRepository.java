package rs.fakultet.upravljanjeprojektima.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import rs.fakultet.upravljanjeprojektima.model.entity.EmailVerifikacija;

@Repository
public interface EmailVerifikacijaRepository extends JpaRepository<EmailVerifikacija, Long> {
    
    Optional<EmailVerifikacija> findByToken(String token);
    
    Optional<EmailVerifikacija> findByEmailAndIskoriscen(String email, Boolean iskoriscen);
    
    @Modifying
    @Query("DELETE FROM EmailVerifikacija e WHERE e.datumIsteka < :datum")
    void obrisiIstekleTokene(@Param("datum") LocalDateTime datum);
}