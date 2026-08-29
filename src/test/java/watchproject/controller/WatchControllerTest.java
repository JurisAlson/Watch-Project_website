package watchproject.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import watchproject.dto.PublicWatchDTO;
import watchproject.model.Watch;
import watchproject.repository.WatchRepository;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WatchControllerTest {

@Mock
private WatchRepository watchRepository;

@InjectMocks
private WatchController watchController;

@Test
void shouldReturnAvailableWatches() {

    // Arrange
    Watch watch = new Watch();

    watch.setId(1L);
    watch.setBrand("Seiko");
    watch.setModelName("Prospex Alpinist");
    watch.setReferenceNumber("SPB155J1");
    watch.setCategory("Prospex");
    watch.setTargetSellingPrice(28000);
    watch.setStatus("AVAILABLE");
    watch.setPublishedDate(LocalDateTime.now());

    when(watchRepository.findAllByOrderByPublishedDateDesc())
            .thenReturn(List.of(watch));

    // Act
    List<PublicWatchDTO> result =
            watchController.getAllWatches();

    // Assert
    assertEquals(1, result.size());

    PublicWatchDTO returnedWatch = result.get(0);

    assertEquals("Seiko", returnedWatch.brand());
    assertEquals("Prospex Alpinist", returnedWatch.modelName());
    assertEquals("SPB155J1", returnedWatch.referenceNumber());
    assertEquals(28000, returnedWatch.targetSellingPrice());
    assertEquals("AVAILABLE", returnedWatch.status());

    verify(watchRepository, times(1))
            .findAllByOrderByPublishedDateDesc();
}
@Test
void shouldReturnSoldWatchIfSoldWithinLast30Days() {

    // Arrange
    Watch watch = new Watch();

    watch.setId(2L);
    watch.setBrand("Seiko");
    watch.setModelName("Presage");
    watch.setStatus("SOLD");
    watch.setTargetSellingPrice(25000);

    watch.setSoldDate(
            LocalDateTime.now().minusDays(10)
    );

    when(watchRepository.findAllByOrderByPublishedDateDesc())
            .thenReturn(List.of(watch));

    // Act
    List<PublicWatchDTO> result =
            watchController.getAllWatches();

    // Assert
    assertEquals(1, result.size());
    assertEquals("SOLD", result.get(0).status());

    verify(watchRepository, times(1))
            .findAllByOrderByPublishedDateDesc();
}


@Test
void shouldHideSoldWatchIfSoldMoreThan30DaysAgo() {

    // Arrange
    Watch watch = new Watch();

    watch.setId(3L);
    watch.setBrand("Seiko");
    watch.setModelName("Prospex");
    watch.setStatus("SOLD");
    watch.setTargetSellingPrice(30000);

    watch.setSoldDate(
            LocalDateTime.now().minusDays(31)
    );

    when(watchRepository.findAllByOrderByPublishedDateDesc())
            .thenReturn(List.of(watch));

    // Act
    List<PublicWatchDTO> result =
            watchController.getAllWatches();

    // Assert
    assertTrue(result.isEmpty());

    verify(watchRepository, times(1))
            .findAllByOrderByPublishedDateDesc();
}


@Test
void shouldReturnSoldWatchIfSoldDateIsMissing() {

    // Arrange
    Watch watch = new Watch();

    watch.setId(4L);
    watch.setBrand("Seiko");
    watch.setModelName("Seiko 5");
    watch.setStatus("SOLD");
    watch.setTargetSellingPrice(20000);

    // No sold date
    watch.setSoldDate(null);

    when(watchRepository.findAllByOrderByPublishedDateDesc())
            .thenReturn(List.of(watch));

    // Act
    List<PublicWatchDTO> result =
            watchController.getAllWatches();

    // Assert
    assertEquals(1, result.size());
    assertEquals("SOLD", result.get(0).status());

    verify(watchRepository, times(1))
            .findAllByOrderByPublishedDateDesc();
}

}
