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

    private String imageUrl;
    private String description;

    private LocalDateTime publishedDate;
    private LocalDateTime soldDate;
}