package watchproject.controller;

import watchproject.model.Watch;
import watchproject.repository.WatchRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/watches")
@CrossOrigin(origins = "http://localhost:5173")
public class WatchController {

    private final WatchRepository watchRepository;

    public WatchController(WatchRepository watchRepository) {
        this.watchRepository = watchRepository;
    }

    // =========================================
    // GET ALL PUBLIC WATCHES
    // =========================================

    @GetMapping
    public List<Watch> getAllWatches() {

        return watchRepository.findAllByOrderByPublishedDateDesc()
                .stream()
                .filter(watch ->
                        !"SOLD".equalsIgnoreCase(watch.getStatus())
                        || watch.getSoldDate() == null
                        || watch.getSoldDate().isAfter(
                                LocalDateTime.now().minusDays(30)
                        )
                )
                .toList();
    }

    // =========================================
    // GET ONE PUBLIC WATCH
    // =========================================

    @GetMapping("/{id}")
    public ResponseEntity<Watch> getWatchById(
            @PathVariable Long id) {

        Optional<Watch> watchOptional =
                watchRepository.findById(id);

        if (watchOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Watch watch = watchOptional.get();

        // Hide sold watches after 30 days
        if ("SOLD".equalsIgnoreCase(watch.getStatus())
                && watch.getSoldDate() != null
                && !watch.getSoldDate().isAfter(
                        LocalDateTime.now().minusDays(30)
                )) {

            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(watch);
    }

    // =========================================
    // GET LATEST 5 PUBLIC WATCHES
    // =========================================

    @GetMapping("/latest")
    public List<Watch> getLatestWatches() {

        return watchRepository
                .findAllByOrderByPublishedDateDesc()
                .stream()
                .filter(watch ->
                        watch.getPublishedDate() != null
                )
                .filter(watch ->
                        !"SOLD".equalsIgnoreCase(watch.getStatus())
                        || watch.getSoldDate() == null
                        || watch.getSoldDate().isAfter(
                                LocalDateTime.now().minusDays(30)
                        )
                )
                .limit(5)
                .toList();
    }
}