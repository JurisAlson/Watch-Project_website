package watchproject.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "watches")
@Data
public class Watch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String modelName;
    private String referenceNumber;
    private String category;

    private double purchasePrice;
    private double targetSellingPrice;

    private String status;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    // ================================
    // INCLUDED ITEMS
    // ================================

    private boolean innerBox;

    private boolean outerBox;

    private boolean manuals;

    private boolean cardAndPapers;

    private boolean hangtags;

    private boolean fullLinks;

    private boolean missingLinks;

    // ================================
    // WATCH SIZE
    // ================================

    private String wristSize;

    // ================================
    // DATES
    // ================================

    private LocalDateTime publishedDate;

    private LocalDateTime soldDate;
}