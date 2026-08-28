package watchproject.auth;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static class LoginAttempt {

        private int failedAttempts;
        private Instant lockedUntil;

        public LoginAttempt() {
            this.failedAttempts = 0;
            this.lockedUntil = null;
        }
    }

    private final Map<String, LoginAttempt> attempts =
            new ConcurrentHashMap<>();

    public boolean isLocked(String key) {

        LoginAttempt attempt = attempts.get(key);

        if (attempt == null) {
            return false;
        }

        if (attempt.lockedUntil == null) {
            return false;
        }

        if (Instant.now().isAfter(attempt.lockedUntil)) {

            attempt.lockedUntil = null;

            return false;
        }

        return true;
    }

    public long getRemainingLockSeconds(String key) {

        LoginAttempt attempt = attempts.get(key);

        if (attempt == null ||
                attempt.lockedUntil == null) {

            return 0;
        }

        long seconds = Duration.between(
                Instant.now(),
                attempt.lockedUntil
        ).getSeconds();

        return Math.max(seconds, 0);
    }

    public void recordFailure(String key) {

        LoginAttempt attempt =
                attempts.computeIfAbsent(
                        key,
                        k -> new LoginAttempt()
                );

        attempt.failedAttempts++;

        if (attempt.failedAttempts >= 3) {

            int lockLevel =
                    (attempt.failedAttempts - 1) / 3;

            long lockMinutes =
                    5L * (1L << (lockLevel - 1));

            attempt.lockedUntil =
                    Instant.now()
                            .plus(Duration.ofMinutes(lockMinutes));
        }
    }

    public void reset(String key) {
        attempts.remove(key);
    }
}