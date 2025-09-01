package rs.fakultet.upravljanjeprojektima;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("rs.fakultet.upravljanjeprojektima.model.entity")
public class UpravljanjeprojektimaApplication {
    public static void main(String[] args) {
        SpringApplication.run(UpravljanjeprojektimaApplication.class, args);
    }
}