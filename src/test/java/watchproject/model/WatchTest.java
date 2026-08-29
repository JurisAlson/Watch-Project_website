package watchproject.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class WatchTest {
@Test
    void shouldStoreWatchInformationCorrectly() {

        // Arrange
        Watch watch = new Watch();

        watch.setBrand("Seiko");
        watch.setModelName("Prospex Alpinist");
        watch.setReferenceNumber("SPB155J1");
        watch.setCategory("Prospex");

        watch.setPurchasePrice(22500);
        watch.setTargetSellingPrice(28000);

        watch.setStatus("AVAILABLE");

        watch.setInnerBox(true);
        watch.setOuterBox(true);
        watch.setManuals(true);
        watch.setCardAndPapers(true);
        watch.setHangtags(false);
        watch.setFullLinks(true);
        watch.setMissingLinks(false);

        watch.setWristSize("7.5 inches");

        // Act & Assert
        assertEquals("Seiko", watch.getBrand());
        assertEquals("Prospex Alpinist", watch.getModelName());
        assertEquals("SPB155J1", watch.getReferenceNumber());
        assertEquals("Prospex", watch.getCategory());

        assertEquals(22500, watch.getPurchasePrice());
        assertEquals(28000, watch.getTargetSellingPrice());

        assertEquals("AVAILABLE", watch.getStatus());

        assertTrue(watch.isInnerBox());
        assertTrue(watch.isOuterBox());
        assertTrue(watch.isManuals());
        assertTrue(watch.isCardAndPapers());
        assertFalse(watch.isHangtags());
        assertTrue(watch.isFullLinks());
        assertFalse(watch.isMissingLinks());

        assertEquals("7.5 inches", watch.getWristSize());
    }
}
