package watchproject.controller;

import watchproject.model.Watch;
import watchproject.repository.WatchRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/watches")
@CrossOrigin(origins = "http://localhost:5173")
public class WatchController {

    private final WatchRepository watchRepository;

    public WatchController(WatchRepository watchRepository) {
        this.watchRepository = watchRepository;
    }

    // GET ALL AVAILABLE WATCHES
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

    // GET LATEST 5 WATCHES
    @GetMapping("/latest")
    public List<Watch> getLatestWatches() {

        return watchRepository.findAllByOrderByPublishedDateDesc()
                .stream()
                .filter(watch -> watch.getPublishedDate() != null)
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