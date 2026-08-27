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

    // =========================================
    // GET ALL WATCHES FOR ADMIN
    // =========================================

    @GetMapping
    public List<Watch> getAllWatches() {

        return watchRepository
                .findAllByOrderByPublishedDateDesc();
    }

    // =========================================
    // CREATE WATCH
    // =========================================

    @PostMapping
    public ResponseEntity<?> createWatch(
            @RequestBody Watch watch) {

        // =========================================
        // REQUIRED FIELD VALIDATION
        // =========================================

        if (watch.getBrand() == null
                || watch.getBrand().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Brand is required.");
        }

        if (watch.getModelName() == null
                || watch.getModelName().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Model name is required.");
        }

        if (watch.getReferenceNumber() == null
                || watch.getReferenceNumber().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Reference number is required.");
        }

        if (watch.getCategory() == null
                || watch.getCategory().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Category is required.");
        }

        // =========================================
        // WRIST SIZE VALIDATION
        // =========================================

        if (watch.getWristSize() == null
                || watch.getWristSize().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Wrist size is required.");
        }

        // =========================================
        // PRICE VALIDATION
        // =========================================

        if (watch.getPurchasePrice() < 0) {

            return ResponseEntity.badRequest()
                    .body("Purchase price cannot be negative.");
        }

        if (watch.getTargetSellingPrice() < 0) {

            return ResponseEntity.badRequest()
                    .body("Target selling price cannot be negative.");
        }

        // =========================================
        // LINK VALIDATION
        // =========================================
        // Full Links and Missing Links are mutually
        // exclusive.
        // =========================================

        if (watch.isFullLinks()
                && watch.isMissingLinks()) {

            return ResponseEntity.badRequest()
                    .body(
                        "A watch cannot have both Full Links and Missing Links."
                    );
        }

        // =========================================
        // FULL SIZE VALIDATION
        // =========================================
        //
        // FULL SIZE means the bracelet is complete.
        // Therefore Missing Links cannot be selected.
        //
        // The frontend will automatically handle the
        // checkbox behavior, but the backend also
        // protects the database from invalid data.
        // =========================================

        if ("FULL SIZE".equalsIgnoreCase(
                watch.getWristSize())) {

            watch.setMissingLinks(false);
            watch.setFullLinks(true);
        }

        // =========================================
        // NORMALIZE TEXT
        // =========================================

        watch.setBrand(
                watch.getBrand().trim()
        );

        watch.setModelName(
                watch.getModelName().trim()
        );

        watch.setReferenceNumber(
                watch.getReferenceNumber().trim()
        );

        watch.setCategory(
                watch.getCategory().trim()
        );

        watch.setWristSize(
                watch.getWristSize().trim()
        );

        // =========================================
        // STATUS
        // =========================================

        if (watch.getStatus() == null
                || watch.getStatus().isBlank()) {

            watch.setStatus("AVAILABLE");

        } else {

            watch.setStatus(
                    watch.getStatus()
                            .trim()
                            .toUpperCase()
            );
        }

        // =========================================
        // VALID STATUS ONLY
        // =========================================

        if (!"AVAILABLE".equals(watch.getStatus())
                && !"SOLD".equals(watch.getStatus())) {

            return ResponseEntity.badRequest()
                    .body(
                        "Status must be either AVAILABLE or SOLD."
                    );
        }

        // =========================================
        // PUBLISHED DATE
        // =========================================

        if (watch.getPublishedDate() == null) {

            watch.setPublishedDate(
                    LocalDateTime.now()
            );
        }

        // =========================================
        // SOLD DATE
        // =========================================

        if ("SOLD".equals(watch.getStatus())) {

            if (watch.getSoldDate() == null) {

                watch.setSoldDate(
                        LocalDateTime.now()
                );
            }

        } else {

            watch.setSoldDate(null);
        }

        // =========================================
        // SAVE
        // =========================================

        return ResponseEntity.ok(
                watchRepository.save(watch)
        );
    }

    // =========================================
    // UPDATE WATCH
    // =========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateWatch(
            @PathVariable Long id,
            @RequestBody Watch updatedWatch) {

        return watchRepository.findById(id)
                .map(existingWatch -> {

                    // =========================================
                    // REQUIRED FIELD VALIDATION
                    // =========================================

                    if (updatedWatch.getBrand() == null
                            || updatedWatch.getBrand().isBlank()) {

                        return ResponseEntity.badRequest()
                                .body("Brand is required.");
                    }

                    if (updatedWatch.getModelName() == null
                            || updatedWatch.getModelName().isBlank()) {

                        return ResponseEntity.badRequest()
                                .body("Model name is required.");
                    }

                    if (updatedWatch.getReferenceNumber() == null
                            || updatedWatch.getReferenceNumber().isBlank()) {

                        return ResponseEntity.badRequest()
                                .body("Reference number is required.");
                    }

                    if (updatedWatch.getCategory() == null
                            || updatedWatch.getCategory().isBlank()) {

                        return ResponseEntity.badRequest()
                                .body("Category is required.");
                    }

                    // =========================================
                    // WRIST SIZE VALIDATION
                    // =========================================

                    if (updatedWatch.getWristSize() == null
                            || updatedWatch.getWristSize().isBlank()) {

                        return ResponseEntity.badRequest()
                                .body("Wrist size is required.");
                    }

                    // =========================================
                    // PRICE VALIDATION
                    // =========================================

                    if (updatedWatch.getPurchasePrice() < 0) {

                        return ResponseEntity.badRequest()
                                .body(
                                    "Purchase price cannot be negative."
                                );
                    }

                    if (updatedWatch.getTargetSellingPrice() < 0) {

                        return ResponseEntity.badRequest()
                                .body(
                                    "Target selling price cannot be negative."
                                );
                    }

                    // =========================================
                    // LINK VALIDATION
                    // =========================================

                    if (updatedWatch.isFullLinks()
                            && updatedWatch.isMissingLinks()) {

                        return ResponseEntity.badRequest()
                                .body(
                                    "A watch cannot have both Full Links and Missing Links."
                                );
                    }

                    // =========================================
                    // WRIST SIZE / FULL SIZE RULE
                    // =========================================

                    if ("FULL SIZE".equalsIgnoreCase(
                            updatedWatch.getWristSize())) {

                        updatedWatch.setMissingLinks(false);
                        updatedWatch.setFullLinks(true);
                    }

                    // =========================================
                    // STATUS
                    // =========================================

                    String newStatus =
                            updatedWatch.getStatus();

                    if (newStatus == null
                            || newStatus.isBlank()) {

                        newStatus = "AVAILABLE";
                    }

                    newStatus = newStatus
                            .trim()
                            .toUpperCase();

                    if (!"AVAILABLE".equals(newStatus)
                            && !"SOLD".equals(newStatus)) {

                        return ResponseEntity.badRequest()
                                .body(
                                    "Status must be either AVAILABLE or SOLD."
                                );
                    }

                    // =========================================
                    // IMPORTANT:
                    // STORE OLD STATUS BEFORE CHANGING IT
                    // =========================================

                    String oldStatus =
                            existingWatch.getStatus();

                    // =========================================
                    // BASIC INFORMATION
                    // =========================================

                    existingWatch.setBrand(
                            updatedWatch.getBrand().trim()
                    );

                    existingWatch.setModelName(
                            updatedWatch.getModelName().trim()
                    );

                    existingWatch.setReferenceNumber(
                            updatedWatch.getReferenceNumber().trim()
                    );

                    existingWatch.setCategory(
                            updatedWatch.getCategory().trim()
                    );

                    // =========================================
                    // PRICING
                    // =========================================

                    existingWatch.setPurchasePrice(
                            updatedWatch.getPurchasePrice()
                    );

                    existingWatch.setTargetSellingPrice(
                            updatedWatch.getTargetSellingPrice()
                    );

                    // =========================================
                    // STATUS
                    // =========================================

                    existingWatch.setStatus(
                            newStatus
                    );

                    // =========================================
                    // MEDIA
                    // =========================================

                    existingWatch.setImageUrl(
                            updatedWatch.getImageUrl()
                    );

                    existingWatch.setDescription(
                            updatedWatch.getDescription()
                    );

                    // =========================================
                    // INCLUDED ITEMS
                    // =========================================

                    existingWatch.setInnerBox(
                            updatedWatch.isInnerBox()
                    );

                    existingWatch.setOuterBox(
                            updatedWatch.isOuterBox()
                    );

                    existingWatch.setManuals(
                            updatedWatch.isManuals()
                    );

                    existingWatch.setCardAndPapers(
                            updatedWatch.isCardAndPapers()
                    );

                    existingWatch.setHangtags(
                            updatedWatch.isHangtags()
                    );

                    existingWatch.setFullLinks(
                            updatedWatch.isFullLinks()
                    );

                    existingWatch.setMissingLinks(
                            updatedWatch.isMissingLinks()
                    );

                    // =========================================
                    // WRIST SIZE
                    // =========================================

                    existingWatch.setWristSize(
                            updatedWatch.getWristSize().trim()
                    );

                    // =========================================
                    // SOLD DATE
                    // =========================================

                    if ("SOLD".equals(newStatus)) {

                        /*
                         * Only create a new sold date when the
                         * watch is being changed from AVAILABLE
                         * to SOLD.
                         */
                        if (!"SOLD".equalsIgnoreCase(oldStatus)) {

                            existingWatch.setSoldDate(
                                    LocalDateTime.now()
                            );
                        }

                    } else {

                        /*
                         * If the watch becomes AVAILABLE again,
                         * remove the sold date.
                         */
                        existingWatch.setSoldDate(null);
                    }

                    // =========================================
                    // SAVE
                    // =========================================

                    return ResponseEntity.ok(
                            watchRepository.save(existingWatch)
                    );
                })
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // =========================================
    // MARK AS SOLD
    // =========================================

    @PatchMapping("/{id}/sold")
    public ResponseEntity<?> markAsSold(
            @PathVariable Long id) {

        return watchRepository.findById(id)
                .map(watch -> {

                    // =========================================
                    // ALREADY SOLD
                    // =========================================

                    if ("SOLD".equalsIgnoreCase(
                            watch.getStatus())) {

                        return ResponseEntity.badRequest()
                                .body(
                                    "This watch is already marked as SOLD."
                                );
                    }

                    // =========================================
                    // MARK SOLD
                    // =========================================

                    watch.setStatus("SOLD");

                    watch.setSoldDate(
                            LocalDateTime.now()
                    );

                    return ResponseEntity.ok(
                            watchRepository.save(watch)
                    );
                })
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // =========================================
    // DELETE WATCH
    // =========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWatch(
            @PathVariable Long id) {

        if (!watchRepository.existsById(id)) {

            return ResponseEntity.notFound().build();
        }

        watchRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}