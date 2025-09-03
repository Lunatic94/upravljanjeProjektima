package rs.fakultet.upravljanjeprojektima.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${app.verification.url}")
    private String verificationUrl;
    
    public void posaljiVerifikacioniEmail(String email, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(email);
            helper.setSubject("Verifikacija email adrese - Upravljanje Projektima");
            
            String verifyLink = verificationUrl + "?token=" + token;
            String htmlContent = createEmailTemplate(verifyLink);
            
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Greška pri slanju email-a: " + e.getMessage());
        }
    }
    
    private String createEmailTemplate(String verifyLink) {
        return """
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #333; margin-bottom: 10px;">Dobrodošli u Sistem za Upravljanje Projektima</h1>
                        <p style="color: #666; font-size: 16px;">Potrebno je da verifikujete svoju email adresu</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
                        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
                            Da biste završili registraciju i aktivirali svoj nalog, kliknite na dugme ispod:
                        </p>
                        
                        <div style="text-align: center;">
                            <a href="%%VERIFY_LINK%%" 
                               style="display: inline-block; background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                                Verifikuj Email
                            </a>
                        </div>
                        
                        <p style="color: #666; font-size: 14px; margin-top: 20px;">
                            Ako dugme ne radi, kopirajte i zaljepite sledeći link u vaš browser:
                        </p>
                        <p style="color: #007bff; word-break: break-all; font-size: 14px;">%%VERIFY_LINK%%</p>
                    </div>
                    
                    <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
                        <p style="color: #999; font-size: 14px; margin: 0;">
                            Ovaj link važi 24 sata. Ako niste kreiranje naloga, zanemarite ovaj email.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """.replace("%%VERIFY_LINK%%", verifyLink);
    }
}
