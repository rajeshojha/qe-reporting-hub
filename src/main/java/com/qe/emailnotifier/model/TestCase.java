package com.qe.emailnotifier.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestCase {
    
    private String tcId;            // e.g., "TC 1", "TC 2"
    private String overallStatus;   // e.g., "Passed", "Failed", "Not attempted"
    private String android;         // Result for Android
    private String ios;             // Result for iOS
    
    @JsonProperty("dWeb")
    private String dWeb;            // Result for desktop web
    
    @JsonProperty("mWeb")
    private String mWeb;            // Result for mobile web
    
    private String comments;        // Associated bug IDs or notes
}
