package watchproject.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthenticationService {

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    private final String adminUsername;
    private final String adminPasswordHash;

    public AdminAuthenticationService(
            @Value("${admin.username}") String adminUsername,
            @Value("${admin.password-hash}") String adminPasswordHash
    ) {
        this.adminUsername = adminUsername;
        this.adminPasswordHash = adminPasswordHash;
    }

    public boolean authenticate(
            String username,
            String password
    ) {

        if (!adminUsername.equals(username)) {
            return false;
        }

        return passwordEncoder.matches(
                password,
                adminPasswordHash
        );
    }
}