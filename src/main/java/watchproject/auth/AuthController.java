package watchproject.auth;

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

    public AuthController(
            AdminAuthenticationService authenticationService,
            JwtService jwtService
    ) {
        this.authenticationService = authenticationService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {

        boolean authenticated =
                authenticationService.authenticate(
                        request.getUsername(),
                        request.getPassword()
                );

        if (!authenticated) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid username or password"
                    ));
        }

        String token =
                jwtService.generateToken(
                        request.getUsername()
                );

        return ResponseEntity.ok(
                Map.of(
                        "token", token
                )
        );
    }
}