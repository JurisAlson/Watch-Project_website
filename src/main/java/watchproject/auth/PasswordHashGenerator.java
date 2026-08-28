package watchproject.auth;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        String password = "admin1";

        String hash = encoder.encode(password);

        System.out.println();
        System.out.println("BCrypt hash:");
        System.out.println(hash);
        System.out.println();
    }
}