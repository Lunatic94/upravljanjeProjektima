package rs.fakultet.upravljanjeprojektima.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rs.fakultet.upravljanjeprojektima.model.entity.Korisnik;
import rs.fakultet.upravljanjeprojektima.repository.KorisnikRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Autowired
    KorisnikRepository korisnikRepository;
    
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String korisnickoIme) throws UsernameNotFoundException {
        Korisnik korisnik = korisnikRepository.findByKorisnickoIme(korisnickoIme)
                .orElseThrow(() -> new UsernameNotFoundException("Korisnik nije pronađen: " + korisnickoIme));
        
        return UserDetailsImpl.build(korisnik);
    }
}