package watchproject.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import watchproject.model.Watch;
import watchproject.repository.WatchRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminWatchControllerTest {

    @Mock
    private WatchRepository watchRepository;

    @InjectMocks
    private AdminWatchController adminWatchController;


    // =========================================
    // GET ALL WATCHES
    // =========================================

    @Test
    void shouldReturnAllWatchesForAdmin() {

        Watch watch = new Watch();
        watch.setId(1L);
        watch.setBrand("Seiko");
        watch.setModelName("Prospex Alpinist");

        when(watchRepository.findAllByOrderByPublishedDateDesc())
                .thenReturn(List.of(watch));

        List<Watch> result =
                adminWatchController.getAllWatches();

        assertEquals(1, result.size());
        assertEquals("Seiko", result.get(0).getBrand());
        assertEquals("Prospex Alpinist", result.get(0).getModelName());

        verify(watchRepository, times(1))
                .findAllByOrderByPublishedDateDesc();
    }


    // =========================================
    // CREATE WATCH
    // =========================================

    @Test
    void shouldCreateWatchSuccessfully() {

        Watch watch = createValidWatch();

        when(watchRepository.save(watch))
                .thenReturn(watch);

        ResponseEntity<?> response =
                adminWatchController.createWatch(watch);

        assertEquals(200, response.getStatusCode().value());

        assertEquals("Seiko", watch.getBrand());
        assertEquals("Prospex Alpinist", watch.getModelName());
        assertEquals("AVAILABLE", watch.getStatus());

        assertNotNull(watch.getPublishedDate());
        assertNull(watch.getSoldDate());

        verify(watchRepository, times(1))
                .save(watch);
    }


    // =========================================
    // REQUIRED FIELD VALIDATION
    // =========================================

    @Test
    void shouldRejectWatchWithoutBrand() {

        Watch watch = createValidWatch();
        watch.setBrand("");

        ResponseEntity<?> response =
                adminWatchController.createWatch(watch);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Brand is required.", response.getBody());

        verify(watchRepository, never()).save(any());
    }


    @Test
    void shouldRejectWatchWithoutModelName() {

        Watch watch = createValidWatch();
        watch.setModelName("");

        ResponseEntity<?> response =
                adminWatchController.createWatch(watch);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Model name is required.", response.getBody());

        verify(watchRepository, never()).save(any());
    }


    @Test
    void shouldRejectWatchWithNegativePurchasePrice() {

        Watch watch = createValidWatch();
        watch.setPurchasePrice(-1);

        ResponseEntity<?> response =
                adminWatchController.createWatch(watch);

        assertEquals(400, response.getStatusCode().value());
        assertEquals(
                "Purchase price cannot be negative.",
                response.getBody()
        );

        verify(watchRepository, never()).save(any());
    }


    @Test
    void shouldRejectWatchWithNegativeSellingPrice() {

        Watch watch = createValidWatch();
        watch.setTargetSellingPrice(-1);

        ResponseEntity<?> response =
                adminWatchController.createWatch(watch);

        assertEquals(400, response.getStatusCode().value());
        assertEquals(
                "Target selling price cannot be negative.",
                response.getBody()
        );

        verify(watchRepository, never()).save(any());
    }


    // =========================================
    // LINK VALIDATION
    // =========================================

    @Test
    void shouldRejectWatchWithBothFullAndMissingLinks() {

        Watch watch = createValidWatch();

        watch.setFullLinks(true);
        watch.setMissingLinks(true);

        ResponseEntity<?> response =
                adminWatchController.createWatch(watch);

        assertEquals(400, response.getStatusCode().value());

        assertEquals(
                "A watch cannot have both Full Links and Missing Links.",
                response.getBody()
        );

        verify(watchRepository, never()).save(any());
    }


    // =========================================
    // FULL SIZE RULE
    // =========================================

    @Test
    void shouldAutomaticallySetFullLinksForFullSizeWatch() {

        Watch watch = createValidWatch();

        watch.setWristSize("FULL SIZE");
        watch.setFullLinks(false);
        watch.setMissingLinks(true);

        when(watchRepository.save(watch))
                .thenReturn(watch);

        ResponseEntity<?> response =
                adminWatchController.createWatch(watch);

        assertEquals(200, response.getStatusCode().value());

        assertTrue(watch.isFullLinks());
        assertFalse(watch.isMissingLinks());

        verify(watchRepository, times(1))
                .save(watch);
    }


    // =========================================
    // STATUS NORMALIZATION
    // =========================================

    @Test
    void shouldDefaultStatusToAvailable() {

        Watch watch = createValidWatch();
        watch.setStatus(null);

        when(watchRepository.save(watch))
                .thenReturn(watch);

        ResponseEntity<?> response =
                adminWatchController.createWatch(watch);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("AVAILABLE", watch.getStatus());
        assertNull(watch.getSoldDate());
    }


    @Test
    void shouldNormalizeStatusToUppercase() {

        Watch watch = createValidWatch();
        watch.setStatus(" sold ");

        when(watchRepository.save(watch))
                .thenReturn(watch);

        ResponseEntity<?> response =
                adminWatchController.createWatch(watch);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("SOLD", watch.getStatus());

        assertNotNull(watch.getSoldDate());
    }


    @Test
    void shouldRejectInvalidStatus() {

        Watch watch = createValidWatch();
        watch.setStatus("PENDING");

        ResponseEntity<?> response =
                adminWatchController.createWatch(watch);

        assertEquals(400, response.getStatusCode().value());

        assertEquals(
                "Status must be either AVAILABLE or SOLD.",
                response.getBody()
        );

        verify(watchRepository, never()).save(any());
    }


    // =========================================
    // MARK AS SOLD
    // =========================================

    @Test
    void shouldMarkAvailableWatchAsSold() {

        Watch watch = createValidWatch();
        watch.setStatus("AVAILABLE");

        when(watchRepository.findById(1L))
                .thenReturn(Optional.of(watch));

        when(watchRepository.save(watch))
                .thenReturn(watch);

        ResponseEntity<?> response =
                adminWatchController.markAsSold(1L);

        assertEquals(200, response.getStatusCode().value());

        assertEquals("SOLD", watch.getStatus());
        assertNotNull(watch.getSoldDate());

        verify(watchRepository, times(1))
                .save(watch);
    }


    @Test
    void shouldRejectAlreadySoldWatch() {

        Watch watch = createValidWatch();
        watch.setStatus("SOLD");

        when(watchRepository.findById(1L))
                .thenReturn(Optional.of(watch));

        ResponseEntity<?> response =
                adminWatchController.markAsSold(1L);

        assertEquals(400, response.getStatusCode().value());

        assertEquals(
                "This watch is already marked as SOLD.",
                response.getBody()
        );

        verify(watchRepository, never()).save(any());
    }


    @Test
    void shouldReturnNotFoundWhenMarkingMissingWatchAsSold() {

        when(watchRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResponseEntity<?> response =
                adminWatchController.markAsSold(999L);

        assertEquals(404, response.getStatusCode().value());

        verify(watchRepository, never()).save(any());
    }


    // =========================================
    // DELETE
    // =========================================

    @Test
    void shouldDeleteExistingWatch() {

        when(watchRepository.existsById(1L))
                .thenReturn(true);

        ResponseEntity<?> response =
                adminWatchController.deleteWatch(1L);

        assertEquals(204, response.getStatusCode().value());

        verify(watchRepository, times(1))
                .deleteById(1L);
    }


    @Test
    void shouldReturnNotFoundWhenDeletingMissingWatch() {

        when(watchRepository.existsById(999L))
                .thenReturn(false);

        ResponseEntity<?> response =
                adminWatchController.deleteWatch(999L);

        assertEquals(404, response.getStatusCode().value());

        verify(watchRepository, never())
                .deleteById(any());
    }


    // =========================================
    // HELPER
    // =========================================

    private Watch createValidWatch() {

        Watch watch = new Watch();

        watch.setBrand("Seiko");
        watch.setModelName("Prospex Alpinist");
        watch.setReferenceNumber("SPB155J1");
        watch.setCategory("Prospex");

        watch.setPurchasePrice(22500);
        watch.setTargetSellingPrice(28000);

        watch.setStatus("AVAILABLE");

        watch.setWristSize("7.5 inches");

        watch.setInnerBox(true);
        watch.setOuterBox(true);
        watch.setManuals(true);
        watch.setCardAndPapers(true);
        watch.setHangtags(false);
        watch.setFullLinks(true);
        watch.setMissingLinks(false);

        return watch;
    }
}