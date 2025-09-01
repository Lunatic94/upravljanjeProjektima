// ManualDataSourceConfig.java
package rs.fakultet.upravljanjeprojektima.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class ManualDataSourceConfig {
    
    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/upravljanje_projektima?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&createDatabaseIfNotExist=true");
        config.setUsername("root");
        config.setPassword("root");
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        
        // Connection pool settings
        config.setMaximumPoolSize(5);
        config.setConnectionTimeout(30000);
        config.setConnectionTestQuery("SELECT 1");
        
        return new HikariDataSource(config);
    }
}