package watchproject.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import watchproject.model.Watch;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class WatchRepositoryTest {

    @Autowired
    private WatchRepository watchRepository;


    // =========================================
    // SAVE AND RETRIEVE
    // =========================================

    @Test
    void shouldSaveAndRetrieveWatch() {

        Watch watch = createWatch(
                "Seiko",
                "Prospex Alpinist",
                LocalDateTime.now()
        );

        Watch savedWatch =
                watchRepository.save(watch);

        assertNotNull(savedWatch.getId());

        Watch foundWatch =
                watchRepository.findById(savedWatch.getId())
                        .orElseThrow();

        assertEquals(
                "Seiko",
                foundWatch.getBrand()
        );

        assertEquals(
                "Prospex Alpinist",
                foundWatch.getModelName()
        );

        assertEquals(
                "SPB155J1",
                foundWatch.getReferenceNumber()
        );
    }


    // =========================================
    // ORDER BY PUBLISHED DATE DESC
    // =========================================

    @Test
    void shouldReturnWatchesOrderedByPublishedDateDescending() {

        LocalDateTime olderDate =
                LocalDateTime.now().minusDays(2);

        LocalDateTime newerDate =
                LocalDateTime.now();

        Watch olderWatch = createWatch(
                "Seiko",
                "Older Watch",
                olderDate
        );

        Watch newerWatch = createWatch(
                "Seiko",
                "Newer Watch",
                newerDate
        );

        watchRepository.save(olderWatch);
        watchRepository.save(newerWatch);

        List<Watch> watches =
                watchRepository
                        .findAllByOrderByPublishedDateDesc();

        assertEquals(2, watches.size());

        assertEquals(
                "Newer Watch",
                watches.get(0).getModelName()
        );

        assertEquals(
                "Older Watch",
                watches.get(1).getModelName()
        );
    }


    // =========================================
    // MULTIPLE WATCHES
    // =========================================

    @Test
    void shouldStoreMultipleWatches() {

        Watch watch1 = createWatch(
                "Seiko",
                "Prospex Alpinist",
                LocalDateTime.now()
        );

        Watch watch2 = createWatch(
                "Seiko",
                "Seiko 5 GMT",
                LocalDateTime.now().minusHours(1)
        );

        Watch watch3 = createWatch(
                "Grand Seiko",
                "SBGA211",
                LocalDateTime.now().minusHours(2)
        );

        watchRepository.save(watch1);
        watchRepository.save(watch2);
        watchRepository.save(watch3);

        List<Watch> watches =
                watchRepository.findAll();

        assertEquals(3, watches.size());
    }


    // =========================================
    // DELETE
    // =========================================

    @Test
    void shouldDeleteWatch() {

        Watch watch = createWatch(
                "Seiko",
                "Watch To Delete",
                LocalDateTime.now()
        );

        Watch savedWatch =
                watchRepository.save(watch);

        Long id = savedWatch.getId();

        assertTrue(
                watchRepository.existsById(id)
        );

        watchRepository.deleteById(id);

        assertFalse(
                watchRepository.existsById(id)
        );
    }


    // =========================================
    // HELPER
    // =========================================

    private Watch createWatch(
            String brand,
            String modelName,
            LocalDateTime publishedDate) {

        Watch watch = new Watch();

        watch.setBrand(brand);
        watch.setModelName(modelName);
        watch.setReferenceNumber("SPB155J1");
        watch.setCategory("Prospex");

        watch.setPurchasePrice(22500);
        watch.setTargetSellingPrice(28000);

        watch.setStatus("AVAILABLE");

        watch.setImageUrl(
                "https://example.com/watch.jpg"
        );

        watch.setDescription(
                "Test watch"
        );

        watch.setInnerBox(true);
        watch.setOuterBox(true);
        watch.setManuals(true);
        watch.setCardAndPapers(true);
        watch.setHangtags(false);
        watch.setFullLinks(true);
        watch.setMissingLinks(false);

        watch.setWristSize("7.5 inches");

        watch.setPublishedDate(publishedDate);

        return watch;
    }
}