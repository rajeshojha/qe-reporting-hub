package com.qe.emailnotifier.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class A11yMetric {
    
    private String platform;              // e.g., "Android", "iOS", "dWeb", "mWeb"
    private Integer attemptedPercentage;  // Percentage of tests attempted
    private Integer passPercentage;       // Percentage of tests passed
    private String comments;              // Additional notes
}
