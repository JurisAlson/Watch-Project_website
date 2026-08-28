
package watchproject.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


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
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

.authorizeHttpRequests(auth -> auth

    .requestMatchers(
        "/api/auth/login"
    ).permitAll()

    .requestMatchers(
        org.springframework.http.HttpMethod.GET,
        "/api/watches",
        "/api/watches/**"
    ).permitAll()

    .requestMatchers(
        org.springframework.http.HttpMethod.POST,
        "/api/watches",
        "/api/watches/**"
    ).hasRole("ADMIN")

    .requestMatchers(
        org.springframework.http.HttpMethod.PUT,
        "/api/watches/**"
    ).hasRole("ADMIN")

    .requestMatchers(
        org.springframework.http.HttpMethod.PATCH,
        "/api/watches/**"
    ).hasRole("ADMIN")

    .requestMatchers(
        org.springframework.http.HttpMethod.DELETE,
        "/api/watches/**"
    ).hasRole("ADMIN")

    .anyRequest().authenticated()
)

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}

