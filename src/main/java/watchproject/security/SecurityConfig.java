package watchproject.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
            // =========================================
            // CORS
            // =========================================

            .cors(cors -> {})

            // =========================================
            // CSRF
            // =========================================

            .csrf(csrf -> csrf.disable())

            // =========================================
            // SESSION
            // =========================================

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // =========================================
            // AUTHORIZATION
            // =========================================

            .authorizeHttpRequests(auth -> auth

    // LOGIN — PUBLIC
    .requestMatchers(
        "/api/auth/login"
    ).permitAll()

    // ADMIN — GET ALL WATCHES
    .requestMatchers(
        HttpMethod.GET,
        "/api/watches/admin/all"
    ).hasRole("ADMIN")

    // PUBLIC WATCH DATA
    .requestMatchers(
        HttpMethod.GET,
        "/api/watches",
        "/api/watches/**"
    ).permitAll()

    // ADMIN — CREATE
    .requestMatchers(
        HttpMethod.POST,
        "/api/watches",
        "/api/watches/**"
    ).hasRole("ADMIN")

    // ADMIN — UPDATE
    .requestMatchers(
        HttpMethod.PUT,
        "/api/watches",
        "/api/watches/**"
    ).hasRole("ADMIN")

    // ADMIN — MARK AS SOLD
    .requestMatchers(
        HttpMethod.PATCH,
        "/api/watches",
        "/api/watches/**"
    ).hasRole("ADMIN")

    // ADMIN — DELETE
    .requestMatchers(
        HttpMethod.DELETE,
        "/api/watches",
        "/api/watches/**"
    ).hasRole("ADMIN")

    .anyRequest().authenticated()
)

            // =========================================
            // JWT FILTER
            // =========================================

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }


    // =========================================
    // CORS CONFIGURATION
    // =========================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
            new CorsConfiguration();

        String frontendUrl = System.getenv().getOrDefault(
            "FRONTEND_URL",
            "http://localhost:5173"
        );

        configuration.setAllowedOrigins(
            List.of(frontendUrl)
        );

        configuration.setAllowedMethods(
            List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
            )
        );

        configuration.setAllowedHeaders(
            List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
            "/**",
            configuration
        );

        return source;
    }
}