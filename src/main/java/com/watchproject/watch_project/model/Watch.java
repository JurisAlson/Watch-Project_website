package com.watchproject.watch_project.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "watches")
@Data
public class Watch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;              // e.g., Seiko
    private String modelName;          // e.g., Presage, SRPD61K1
    private String referenceNumber;    // e.g., SRPD61K1
    private String category;           // e.g., "Prospex", "Presage", "Seiko 5", "Limited Edition"
    private double purchasePrice;      // How much you bought it for
    private double targetSellingPrice; // Selling price you aim for
    private String status;             // e.g., "Available", "Reserved", "Sold"
}