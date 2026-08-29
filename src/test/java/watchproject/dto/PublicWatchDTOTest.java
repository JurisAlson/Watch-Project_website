package watchproject.dto;

import org.junit.jupiter.api.Test;
import watchproject.model.Watch;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class PublicWatchDTOTest {

    @Test
    void shouldConvertWatchToPublicDTO() {

        // Arrange
        Watch watch = new Watch();

        watch.setId(1L);
        watch.setBrand("Seiko");
        watch.setModelName("Prospex Alpinist");
        watch.setReferenceNumber("SPB155J1");
        watch.setCategory("Prospex");

        watch.setPurchasePrice(22500);
        watch.setTargetSellingPrice(28000);

        watch.setStatus("AVAILABLE");
        watch.setImageUrl("https://example.com/watch.jpg");
        watch.setDescription("Seiko Alpinist in excellent condition.");

        watch.setInnerBox(true);
        watch.setOuterBox(true);
        watch.setManuals(true);
        watch.setCardAndPapers(true);
        watch.setHangtags(false);
        watch.setFullLinks(true);
        watch.setMissingLinks(false);

        watch.setWristSize("7.5 inches");

        LocalDateTime publishedDate = LocalDateTime.of(2026, 8, 30, 12, 0);

        watch.setPublishedDate(publishedDate);

        // Act
        PublicWatchDTO dto = PublicWatchDTO.from(watch);

        // Assert
        assertEquals(1L, dto.id());
        assertEquals("Seiko", dto.brand());
        assertEquals("Prospex Alpinist", dto.modelName());
        assertEquals("SPB155J1", dto.referenceNumber());
        assertEquals("Prospex", dto.category());

        assertEquals(28000, dto.targetSellingPrice());
        assertEquals("AVAILABLE", dto.status());

        assertEquals(
                "https://example.com/watch.jpg",
                dto.imageUrl()
        );

        assertEquals(
                "Seiko Alpinist in excellent condition.",
                dto.description()
        );

        assertTrue(dto.innerBox());
        assertTrue(dto.outerBox());
        assertTrue(dto.manuals());
        assertTrue(dto.cardAndPapers());

        assertFalse(dto.hangtags());

        assertTrue(dto.fullLinks());

        assertFalse(dto.missingLinks());

        assertEquals("7.5 inches", dto.wristSize());

        assertEquals(publishedDate, dto.publishedDate());
    }

    @Test
    void shouldNotExposePurchasePrice() {

        // Arrange
        Watch watch = new Watch();

        watch.setBrand("Seiko");
        watch.setPurchasePrice(22500);
        watch.setTargetSellingPrice(28000);

        // Act
        PublicWatchDTO dto = PublicWatchDTO.from(watch);

        // Assert
        assertEquals(28000, dto.targetSellingPrice());

        // PublicWatchDTO intentionally has no purchasePrice field.
        // If purchasePrice were accidentally added to the DTO,
        // this test would need to be reconsidered.
        assertFalse(
                java.util.Arrays.stream(
                        PublicWatchDTO.class.getRecordComponents()
                )
                .anyMatch(component ->
                        component.getName().equals("purchasePrice")
                )
        );
    }
}