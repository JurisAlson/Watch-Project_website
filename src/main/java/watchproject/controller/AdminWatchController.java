package watchproject.controller;

import watchproject.model.Watch;
import watchproject.repository.WatchRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/watches")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminWatchController {

    private final WatchRepository watchRepository;

    public AdminWatchController(WatchRepository watchRepository) {
        this.watchRepository = watchRepository;
    }

    // GET all watches for admin
    @GetMapping
    public List<Watch> getAllWatches() {
        return watchRepository.findAllByOrderByPublishedDateDesc();
    }

    // CREATE watch
    @PostMapping
    public Watch createWatch(@RequestBody Watch watch) {

        if (watch.getPublishedDate() == null) {
            watch.setPublishedDate(LocalDateTime.now());
        }

        if (watch.getStatus() == null || watch.getStatus().isBlank()) {
            watch.setStatus("AVAILABLE");
        }

        return watchRepository.save(watch);
    }

    // UPDATE watch
    @PutMapping("/{id}")
    public ResponseEntity<Watch> updateWatch(
            @PathVariable Long id,
            @RequestBody Watch updatedWatch) {

        return watchRepository.findById(id)
                .map(existingWatch -> {

                    existingWatch.setBrand(updatedWatch.getBrand());
                    existingWatch.setModelName(updatedWatch.getModelName());
                    existingWatch.setReferenceNumber(updatedWatch.getReferenceNumber());
                    existingWatch.setCategory(updatedWatch.getCategory());
                    existingWatch.setPurchasePrice(updatedWatch.getPurchasePrice());
                    existingWatch.setTargetSellingPrice(updatedWatch.getTargetSellingPrice());
                    existingWatch.setStatus(updatedWatch.getStatus());
                    existingWatch.setImageUrl(updatedWatch.getImageUrl());
                    existingWatch.setDescription(updatedWatch.getDescription());

                    return ResponseEntity.ok(watchRepository.save(existingWatch));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // MARK AS SOLD
    @PatchMapping("/{id}/sold")
    public ResponseEntity<Watch> markAsSold(@PathVariable Long id) {

        return watchRepository.findById(id)
                .map(watch -> {

                    watch.setStatus("SOLD");
                    watch.setSoldDate(LocalDateTime.now());

                    return ResponseEntity.ok(watchRepository.save(watch));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE watch
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWatch(@PathVariable Long id) {

        if (!watchRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        watchRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}