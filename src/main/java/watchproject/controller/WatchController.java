package watchproject.controller;

import watchproject.model.Watch;
import watchproject.repository.WatchRepository;
import watchproject.dto.PublicWatchDTO;

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
    public List<PublicWatchDTO> getAllWatches() {

        return watchRepository.findAllByOrderByPublishedDateDesc()
                .stream()
                .filter(watch ->
                        !"SOLD".equalsIgnoreCase(watch.getStatus())
                        || watch.getSoldDate() == null
                        || watch.getSoldDate().isAfter(
                                LocalDateTime.now().minusDays(30)
                        )
                )
                .map(PublicWatchDTO::from)
                .toList();
    }

    // =========================================
    // GET ALL WATCHES — ADMIN
    // =========================================
    // This endpoint returns the full Watch entity,
    // including purchasePrice.
    //
    // It MUST be protected by Spring Security.

    @GetMapping("/admin/all")
    public List<Watch> getAllWatchesForAdmin() {

        return watchRepository.findAllByOrderByPublishedDateDesc();
    }


    // =========================================
    // GET ONE PUBLIC WATCH
    // =========================================

    @GetMapping("/{id}")
    public ResponseEntity<PublicWatchDTO> getWatchById(
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

        return ResponseEntity.ok(
                PublicWatchDTO.from(watch)
        );
    }

    // =========================================
    // GET LATEST 5 PUBLIC WATCHES
    // =========================================

    @GetMapping("/latest")
    public List<PublicWatchDTO> getLatestWatches() {

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
                .map(PublicWatchDTO::from)
                .toList();
    }

    // =========================================
    // CREATE WATCH — ADMIN
    // =========================================

    @PostMapping
    public ResponseEntity<Watch> createWatch(
            @RequestBody Watch watch) {

        if (watch.getPublishedDate() == null) {
            watch.setPublishedDate(LocalDateTime.now());
        }

        if ("SOLD".equalsIgnoreCase(watch.getStatus())
                && watch.getSoldDate() == null) {

            watch.setSoldDate(LocalDateTime.now());
        }

        Watch savedWatch =
                watchRepository.save(watch);

        return ResponseEntity.ok(savedWatch);
    }

    // =========================================
    // UPDATE WATCH — ADMIN
    // =========================================

    @PutMapping("/{id}")
    public ResponseEntity<Watch> updateWatch(
            @PathVariable Long id,
            @RequestBody Watch updatedWatch) {

        Optional<Watch> watchOptional =
                watchRepository.findById(id);

        if (watchOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Watch watch = watchOptional.get();

        watch.setBrand(updatedWatch.getBrand());
        watch.setModelName(updatedWatch.getModelName());
        watch.setReferenceNumber(
                updatedWatch.getReferenceNumber()
        );
        watch.setCategory(updatedWatch.getCategory());

        watch.setPurchasePrice(
                updatedWatch.getPurchasePrice()
        );

        watch.setTargetSellingPrice(
                updatedWatch.getTargetSellingPrice()
        );

        watch.setStatus(updatedWatch.getStatus());

        watch.setImageUrl(
                updatedWatch.getImageUrl()
        );

        watch.setDescription(
                updatedWatch.getDescription()
        );

        // =========================================
        // INCLUDED ITEMS
        // =========================================

        watch.setInnerBox(
                updatedWatch.isInnerBox()
        );

        watch.setOuterBox(
                updatedWatch.isOuterBox()
        );

        watch.setManuals(
                updatedWatch.isManuals()
        );

        watch.setCardAndPapers(
                updatedWatch.isCardAndPapers()
        );

        watch.setHangtags(
                updatedWatch.isHangtags()
        );

        watch.setFullLinks(
                updatedWatch.isFullLinks()
        );

        watch.setMissingLinks(
                updatedWatch.isMissingLinks()
        );

        // =========================================
        // WATCH SIZE
        // =========================================

        watch.setWristSize(
                updatedWatch.getWristSize()
        );

        // =========================================
        // DATES
        // =========================================

        if (updatedWatch.getPublishedDate() != null) {

            watch.setPublishedDate(
                    updatedWatch.getPublishedDate()
            );
        }

        if ("SOLD".equalsIgnoreCase(
                updatedWatch.getStatus())) {

            if (watch.getSoldDate() == null) {
                watch.setSoldDate(
                        LocalDateTime.now()
                );
            }

        } else {

            watch.setSoldDate(null);
        }

        Watch savedWatch =
                watchRepository.save(watch);

        return ResponseEntity.ok(savedWatch);
    }

    // =========================================
    // MARK WATCH AS SOLD — ADMIN
    // =========================================

    @PatchMapping("/{id}/sold")
    public ResponseEntity<Watch> markAsSold(
            @PathVariable Long id) {

        Optional<Watch> watchOptional =
                watchRepository.findById(id);

        if (watchOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Watch watch = watchOptional.get();

        watch.setStatus("SOLD");
        watch.setSoldDate(LocalDateTime.now());

        Watch savedWatch =
                watchRepository.save(watch);

        return ResponseEntity.ok(savedWatch);
    }

    // =========================================
    // DELETE WATCH — ADMIN
    // =========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWatch(
            @PathVariable Long id) {

        if (!watchRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        watchRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}