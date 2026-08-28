package watchproject.dto;

import watchproject.model.Watch;

public record PublicWatchDTO(
        Long id,
        String brand,
        String modelName,
        String referenceNumber,
        String category,
        double targetSellingPrice,
        String status,
        String imageUrl,
        String description,
        boolean innerBox,
        boolean outerBox,
        boolean manuals,
        boolean cardAndPapers,
        boolean hangtags,
        boolean fullLinks,
        boolean missingLinks,
        String wristSize,
        java.time.LocalDateTime publishedDate,
        java.time.LocalDateTime soldDate
) {

    public static PublicWatchDTO from(Watch watch) {
        return new PublicWatchDTO(
                watch.getId(),
                watch.getBrand(),
                watch.getModelName(),
                watch.getReferenceNumber(),
                watch.getCategory(),
                watch.getTargetSellingPrice(),
                watch.getStatus(),
                watch.getImageUrl(),
                watch.getDescription(),
                watch.isInnerBox(),
                watch.isOuterBox(),
                watch.isManuals(),
                watch.isCardAndPapers(),
                watch.isHangtags(),
                watch.isFullLinks(),
                watch.isMissingLinks(),
                watch.getWristSize(),
                watch.getPublishedDate(),
                watch.getSoldDate()
        );
    }
}