package watchproject.auth;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import watchproject.security.JwtService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AdminAuthenticationService authenticationService;
    private final JwtService jwtService;
    private final LoginAttemptService loginAttemptService;

    public AuthController(
            AdminAuthenticationService authenticationService,
            JwtService jwtService,
            LoginAttemptService loginAttemptService
    ) {
        this.authenticationService = authenticationService;
        this.jwtService = jwtService;
        this.loginAttemptService = loginAttemptService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {

        String username =
                request.getUsername() == null
                        ? ""
                        : request.getUsername().trim();

        String ipAddress =
                httpRequest.getRemoteAddr();

        /*
         * Use both username and IP.
         *
         * This prevents one bad actor from
         * attacking the same account endlessly,
         * while also avoiding locking the account
         * for everyone because of one IP.
         */
        String attemptKey =
                username.toLowerCase() +
                ":" +
                ipAddress;

        // =========================================
        // CHECK LOCK
        // =========================================

        if (loginAttemptService.isLocked(attemptKey)) {

            long remaining =
                    loginAttemptService
                            .getRemainingLockSeconds(
                                    attemptKey
                            );

            return ResponseEntity
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of(
                            "message",
                            "Too many failed login attempts. Try again later.",
                            "retryAfterSeconds",
                            remaining
                    ));
        }

        // =========================================
        // AUTHENTICATE
        // =========================================

        boolean authenticated =
                authenticationService.authenticate(
                        username,
                        request.getPassword()
                );

        if (!authenticated) {

            loginAttemptService.recordFailure(
                    attemptKey
            );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid username or password"
                    ));
        }

        // =========================================
        // SUCCESS
        // =========================================

        loginAttemptService.reset(attemptKey);

        String token =
                jwtService.generateToken(username);

        return ResponseEntity.ok(
                Map.of(
                        "token",
                        token
                )
        );
    }
}