package watchproject.controller;

import watchproject.model.Watch;
import watchproject.repository.WatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watches")
@CrossOrigin(origins = "http://localhost:5173")
public class WatchController {

    @Autowired
    private WatchRepository watchRepository;

    @GetMapping
    public List<Watch> getAllWatches() {
        return watchRepository.findAll();
    }

    @GetMapping("/latest")
    public List<Watch> getLatestWatches() {
        return watchRepository.findAllByOrderByPublishedDateDesc()
                .stream()
                .filter(watch -> watch.getPublishedDate() != null)
                .limit(5)
                .toList();
    }

    @PostMapping
    public Watch createWatch(@RequestBody Watch watch) {
        return watchRepository.save(watch);
    }
}