package watchproject.controller;

import watchproject.model.Watch;
import watchproject.repository.WatchRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/watches")
@CrossOrigin(origins = "http://localhost:5173")
public class WatchController {

    @Autowired
    private WatchRepository watchRepository;

    // GET ALL WATCHES
    @GetMapping
    public List<Watch> getAllWatches() {
        return watchRepository.findAll();
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
                        || watch.getSoldDate().isAfter(LocalDateTime.now().minusDays(3))
                )
                .limit(5)
                .toList();
    }

    // CREATE WATCH
    @PostMapping
    public Watch createWatch(@RequestBody Watch watch) {

        if (watch.getPublishedDate() == null) {
            watch.setPublishedDate(LocalDateTime.now());
        }

        if ("SOLD".equalsIgnoreCase(watch.getStatus())
                && watch.getSoldDate() == null) {
            watch.setSoldDate(LocalDateTime.now());
        }

        return watchRepository.save(watch);
    }

    // UPDATE WATCH
    @PutMapping("/{id}")
    public Watch updateWatch(
            @PathVariable Long id,
            @RequestBody Watch updatedWatch) {

        Watch watch = watchRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Watch not found"));

        watch.setBrand(updatedWatch.getBrand());
        watch.setModelName(updatedWatch.getModelName());
        watch.setReferenceNumber(updatedWatch.getReferenceNumber());
        watch.setCategory(updatedWatch.getCategory());
        watch.setPurchasePrice(updatedWatch.getPurchasePrice());
        watch.setTargetSellingPrice(updatedWatch.getTargetSellingPrice());
        watch.setStatus(updatedWatch.getStatus());
        watch.setImageUrl(updatedWatch.getImageUrl());
        watch.setDescription(updatedWatch.getDescription());

        return watchRepository.save(watch);
    }

    // MARK WATCH AS SOLD
    @PatchMapping("/{id}/sold")
    public Watch markAsSold(@PathVariable Long id) {

        Watch watch = watchRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Watch not found"));

        watch.setStatus("SOLD");
        watch.setSoldDate(LocalDateTime.now());

        return watchRepository.save(watch);
    }

    // DELETE WATCH
    @DeleteMapping("/{id}")
    public void deleteWatch(@PathVariable Long id) {

        if (!watchRepository.existsById(id)) {
            throw new RuntimeException("Watch not found");
        }

        watchRepository.deleteById(id);
    }
}