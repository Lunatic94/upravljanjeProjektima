-- Početni podaci za aplikaciju upravljanja projektima

-- Korisnici (lozinke su enkriptovane verzije reči "password123")
INSERT INTO korisnik (korisnicko_ime, email, lozinka, ime, prezime, uloga, datum_kreiranja, aktivan, email_verifikovan, datum_email_verifikacije) VALUES
('admin', 'admin@example.com', '$2a$10$F1GwSkq/1bQS7YM62GDUweBED.BkyUcO87KFFH.YN6l1ay95ZVZ8O', 'Administrator', 'System', 'ADMIN', CURRENT_TIMESTAMP, true, true, CURRENT_TIMESTAMP),
('marko_menadzer', 'marko@example.com', '$2a$10$F1GwSkq/1bQS7YM62GDUweBED.BkyUcO87KFFH.YN6l1ay95ZVZ8O', 'Marko', 'Petrović', 'MENADZER_PROJEKTA', CURRENT_TIMESTAMP, true, true, CURRENT_TIMESTAMP),
('ana_dev', 'ana@example.com', '$2a$10$F1GwSkq/1bQS7YM62GDUweBED.BkyUcO87KFFH.YN6l1ay95ZVZ8O', 'Ana', 'Nikolić', 'PROGRAMER', CURRENT_TIMESTAMP, true, true, CURRENT_TIMESTAMP),
('petar_dev', 'petar@example.com', '$2a$10$F1GwSkq/1bQS7YM62GDUweBED.BkyUcO87KFFH.YN6l1ay95ZVZ8O', 'Petar', 'Jovanović', 'PROGRAMER', CURRENT_TIMESTAMP, true, true, CURRENT_TIMESTAMP),
('milica_dev', 'milica@example.com', '$2a$10$F1GwSkq/1bQS7YM62GDUweBED.BkyUcO87KFFH.YN6l1ay95ZVZ8O', 'Milica', 'Stojanović', 'PROGRAMER', CURRENT_TIMESTAMP, true, true, CURRENT_TIMESTAMP);

-- Dodavanje test korisnika koji NIJE verifikovan (za testiranje)
INSERT INTO korisnik (korisnicko_ime, email, lozinka, ime, prezime, uloga, datum_kreiranja, aktivan, email_verifikovan, datum_email_verifikacije) VALUES
('test_neversifikovan', 'test@example.com', '$2a$10$F1GwSkq/1bQS7YM62GDUweBED.BkyUcO87KFFH.YN6l1ay95ZVZ8O', 'Test', 'Korisnik', 'PROGRAMER', CURRENT_TIMESTAMP, false, false, NULL);

-- Projekti
INSERT INTO projekat (naziv, opis, datum_pocetka, datum_zavrsetka, status, prioritet, kreirao_korisnik_id, menadzer_id, datum_kreiranja) VALUES
('E-commerce Web Aplikacija', 'Razvoj web aplikacije za online prodaju sa integriranim plaćanjem i upravljanjem inventarom', '2024-01-15', '2024-06-30', 'U_TOKU', 'VISOK', 2, 2, CURRENT_TIMESTAMP),
('Mobilna Aplikacija za Fitness', 'Android i iOS aplikacija za praćenje treninga i ishrane', '2024-02-01', '2024-08-31', 'U_TOKU', 'SREDNJI', 2, 2, CURRENT_TIMESTAMP),
('CRM Sistema', 'Customer Relationship Management sistem za upravljanje klijentima', '2024-03-01', '2024-09-30', 'PLANIRANJE', 'VISOK', 1, 2, CURRENT_TIMESTAMP),
('Automatizacija Testiranja', 'Implementacija automated testing framework-a', '2024-01-01', '2024-04-30', 'ZAVRSEN', 'SREDNJI', 2, 2, CURRENT_TIMESTAMP);

-- Članovi projekata (bez kolone 'uloga' - sada se čuva u zasebnoj tabeli)
INSERT INTO clan_projekta (projekat_id, korisnik_id, datum_pridruzivanja, aktivan) VALUES
-- E-commerce projekat
(1, 2, CURRENT_TIMESTAMP, true),  -- Marko (ID=2)
(1, 3, CURRENT_TIMESTAMP, true),  -- Ana (ID=3)
(1, 4, CURRENT_TIMESTAMP, true),  -- Petar (ID=4)

-- Fitness aplikacija
(2, 2, CURRENT_TIMESTAMP, true),  -- Marko (ID=2) 
(2, 5, CURRENT_TIMESTAMP, true),  -- Milica (ID=5)
(2, 3, CURRENT_TIMESTAMP, true),  -- Ana (ID=3)

-- CRM sistem
(3, 2, CURRENT_TIMESTAMP, true),  -- Marko (ID=2)
(3, 4, CURRENT_TIMESTAMP, true),  -- Petar (ID=4)

-- Automatizacija testiranja
(4, 2, CURRENT_TIMESTAMP, true),  -- Marko (ID=2)
(4, 5, CURRENT_TIMESTAMP, true);  -- Milica (ID=5)

-- NOVO: Uloge članova (Collection Table - kreirane automatski od strane Hibernate)
-- Tabela clan_projekta_uloge će biti kreirana automatski, ali dodajemo podatke
INSERT INTO clan_projekta_uloge (clan_projekta_id, uloga) VALUES
-- E-commerce projekat
(1, 'MENADZER_PROJEKTA'),  -- Marko je menadžer
(2, 'PROGRAMER'),          -- Ana je programer
(2, 'TESTER'),             -- Ana je i tester (VIŠE ULOGA!)
(3, 'PROGRAMER'),          -- Petar je programer

-- Fitness aplikacija  
(4, 'MENADZER_PROJEKTA'),  -- Marko je menadžer
(5, 'PROGRAMER'),          -- Milica je programer
(5, 'DIZAJNER'),           -- Milica je i dizajner (VIŠE ULOGA!)
(6, 'TESTER'),             -- Ana je tester

-- CRM sistem
(7, 'MENADZER_PROJEKTA'),  -- Marko je menadžer
(8, 'PROGRAMER'),          -- Petar je programer
(8, 'TESTER'),             -- Petar je i tester (VIŠE ULOGA!)

-- Automatizacija testiranja
(9, 'MENADZER_PROJEKTA'),  -- Marko je menadžer
(10, 'PROGRAMER'),         -- Milica je programer
(10, 'TESTER');            -- Milica je i tester (VIŠE ULOGA!)

-- Zadaci
INSERT INTO zadatak (naslov, opis, status, prioritet, procenjeni_sati, stvarni_sati, rok_zavrsetka, projekat_id, dodeljen_korisnik_id, kreirao_korisnik_id, datum_kreiranja) VALUES
-- E-commerce projekat
('Kreiranje user authentication', 'Implementacija login/register funkcionalnosti sa JWT tokenima', 'ZAVRSENO', 'VISOK', 40, 38, '2024-02-15', 1, 3, 2, CURRENT_TIMESTAMP),
('Dizajn product catalog stranice', 'Frontend za prikaz proizvoda sa filterima i search funkcionalnostima', 'U_TOKU', 'VISOK', 32, NULL, '2024-03-01', 1, 3, 2, CURRENT_TIMESTAMP),
('Implementacija shopping cart', 'Backend i frontend za košaricu i checkout proces', 'TREBA_URADITI', 'KRITICAN', 48, NULL, '2024-03-15', 1, 4, 2, CURRENT_TIMESTAMP),
('Payment gateway integracija', 'Integracija sa Stripe/PayPal za plaćanje', 'TREBA_URADITI', 'VISOK', 24, NULL, '2024-04-01', 1, NULL, 2, CURRENT_TIMESTAMP),

-- Fitness aplikacija
('Dizajn UI/UX mobilne app', 'Kreiranje mockup-a i dizajna za Android/iOS', 'ZAVRSENO', 'VISOK', 60, 55, '2024-02-28', 2, 5, 2, CURRENT_TIMESTAMP),
('Implementacija workout tracking', 'Funkcionalnost za praćenje treninga i vežbi', 'U_TOKU', 'VISOK', 80, NULL, '2024-04-15', 2, 5, 2, CURRENT_TIMESTAMP),
('Kreiranje baze podataka', 'Dizajn i implementacija database schema', 'NA_PREGLEDU', 'SREDNJI', 16, 18, '2024-03-10', 2, 3, 2, CURRENT_TIMESTAMP),

-- CRM sistem
('Analiza zahteva', 'Definisanje funkcionalnih i nefunkcionalnih zahteva', 'U_TOKU', 'KRITICAN', 20, NULL, '2024-03-20', 3, 4, 1, CURRENT_TIMESTAMP),
('Arhitektura sistema', 'Definisanje tehničke arhitekture i tehnologija', 'TREBA_URADITI', 'VISOK', 24, NULL, '2024-04-01', 3, NULL, 1, CURRENT_TIMESTAMP),

-- Automatizacija testiranja (završen projekat)
('Setup CI/CD pipeline', 'Konfiguracija Jenkins/GitHub Actions', 'ZAVRSENO', 'VISOK', 16, 14, '2024-01-31', 4, 5, 2, CURRENT_TIMESTAMP),
('Pisanje unit testova', 'Kreiranje unit testova za core funkcionalnosti', 'ZAVRSENO', 'SREDNJI', 40, 42, '2024-02-29', 4, 5, 2, CURRENT_TIMESTAMP),
('Integration testing', 'End-to-end testovi za kritične user flow-ove', 'ZAVRSENO', 'SREDNJI', 32, 30, '2024-03-31', 4, 5, 2, CURRENT_TIMESTAMP);

-- Komentari na zadatke
INSERT INTO komentar_zadatka (zadatak_id, korisnik_id, sadrzaj, datum_kreiranja) VALUES
(1, 3, 'Završena implementacija. JWT tokenima je dodana refresh token funkcionalnost.', CURRENT_TIMESTAMP),
(1, 2, 'Odlično! Možemo preći na sledeći zadatak.', CURRENT_TIMESTAMP),
(2, 3, 'Počeo sam sa responsive dizajnom. Trebam feedback za mobile verziju.', CURRENT_TIMESTAMP),
(2, 2, 'Pošalji mi screenshot kada završiš osnovnu strukturu.', CURRENT_TIMESTAMP),
(5, 5, 'Kreirao sam sve potrebne screen-ove. UI je gotov 90%.', CURRENT_TIMESTAMP),
(6, 5, 'Imam problema sa GPS tracking funkcionalnošću. Potrebna pomoć.', CURRENT_TIMESTAMP),
(6, 2, 'Zakazićú meeting za sutra da prođemo kroz probleme.', CURRENT_TIMESTAMP),
(7, 3, 'Database schema je kreiran. Potreban code review.', CURRENT_TIMESTAMP),
(8, 4, 'Intervjuisao sam 5 potencijalnih korisnika. Imam detaljne notes.', CURRENT_TIMESTAMP);

-- Aktivnosti na projektima
INSERT INTO aktivnost_projekta (projekat_id, korisnik_id, tip_aktivnosti, tip_entiteta, entitet_id, opis, datum_kreiranja) VALUES
(1, 2, 'KREIRAN', 'PROJEKAT', 1, 'Kreiran projekat: E-commerce Web Aplikacija', CURRENT_TIMESTAMP - INTERVAL '30' DAY),
(1, 2, 'KREIRAN', 'ZADATAK', 1, 'Kreiran zadatak: Kreiranje user authentication', CURRENT_TIMESTAMP - INTERVAL '25' DAY),
(1, 3, 'ZAVRSEN', 'ZADATAK', 1, 'Završen zadatak: Kreiranje user authentication', CURRENT_TIMESTAMP - INTERVAL '20' DAY),
(1, 2, 'KREIRAN', 'ZADATAK', 2, 'Kreiran zadatak: Dizajn product catalog stranice', CURRENT_TIMESTAMP - INTERVAL '15' DAY),
(1, 2, 'DODELJEN', 'ZADATAK', 2, 'Zadatak Dizajn product catalog stranice dodeljen korisniku Ana Nikolić', CURRENT_TIMESTAMP - INTERVAL '15' DAY),

(2, 2, 'KREIRAN', 'PROJEKAT', 2, 'Kreiran projekat: Mobilna Aplikacija za Fitness', CURRENT_TIMESTAMP - INTERVAL '28' DAY),
(2, 5, 'ZAVRSEN', 'ZADATAK', 5, 'Završen zadatak: Dizajn UI/UX mobilne app', CURRENT_TIMESTAMP - INTERVAL '10' DAY),
(2, 2, 'KREIRAN', 'ZADATAK', 6, 'Kreiran zadatak: Implementacija workout tracking', CURRENT_TIMESTAMP - INTERVAL '8' DAY),

(3, 1, 'KREIRAN', 'PROJEKAT', 3, 'Kreiran projekat: CRM Sistema', CURRENT_TIMESTAMP - INTERVAL '20' DAY),
(3, 1, 'KREIRAN', 'ZADATAK', 8, 'Kreiran zadatak: Analiza zahteva', CURRENT_TIMESTAMP - INTERVAL '18' DAY),

(4, 2, 'KREIRAN', 'PROJEKAT', 4, 'Kreiran projekat: Automatizacija Testiranja', CURRENT_TIMESTAMP - INTERVAL '90' DAY),
(4, 5, 'ZAVRSEN', 'ZADATAK', 10, 'Završen zadatak: Setup CI/CD pipeline', CURRENT_TIMESTAMP - INTERVAL '85' DAY),
(4, 5, 'ZAVRSEN', 'ZADATAK', 11, 'Završen zadatak: Pisanje unit testova', CURRENT_TIMESTAMP - INTERVAL '60' DAY),
(4, 5, 'ZAVRSEN', 'ZADATAK', 12, 'Završen zadatak: Integration testing', CURRENT_TIMESTAMP - INTERVAL '30' DAY),
(4, 2, 'AZURIRAN', 'PROJEKAT', 4, 'Status projekta promenjen na ZAVRŠEN', CURRENT_TIMESTAMP - INTERVAL '25' DAY);

-- Test podaci za email verifikaciju
INSERT INTO email_verifikacija (token, email, datum_kreiranja, datum_isteka, iskoriscen) VALUES
('test-verification-token-123', 'test@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '24' HOUR, false),
('expired-token-456', 'expired@example.com', CURRENT_TIMESTAMP - INTERVAL '2' DAY, CURRENT_TIMESTAMP - INTERVAL '1' DAY, false),
('used-token-789', 'used@example.com', CURRENT_TIMESTAMP - INTERVAL '1' DAY, CURRENT_TIMESTAMP + INTERVAL '23' HOUR, true);