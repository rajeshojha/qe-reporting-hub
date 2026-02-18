package com.qe.emailnotifier.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccessibilityResult {
    
    private String platform;           // e.g., "Web", "IOS", "Android"
    private String attemptedPercentage; // e.g., "100%"
    private String passPercentage;      // e.g., "90%"
    private String comments;
}
