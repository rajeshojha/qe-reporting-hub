package com.qe.emailnotifier.model;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestStatusReport {

    // Email metadata
    private String senderEmail;         // Sender's email address
    private List<String> recipients;
    private List<String> ccRecipients;
    private List<String> bccRecipients;
    private String subject;

    @NotBlank(message = "Project name is required")
    private String projectName;
    
    private String vertical;            // Vertical/Track (e.g., Fulfilment)
    private String opifId;              // OPIF ID (e.g., OPIF-12345)

    private String riskStatus;
    
    private String testEnvironment;
    
    private String reportDate;
    
    private String programManagerName;

    // Report content
    private String summaryMessage;          // e.g., "E2E Testing is On Track"
    private Integer passRatePercentage;      // e.g., 84.0
    private Integer attemptRatePercentage;   // e.g., 96.0
    private Integer criticalP1Count;        // Number of critical P1 issues
    private List<String> taggedStakeholders; // @mentions for stakeholders
    private List<String> keyCallouts;       // Important bullet points/action items
    
    private String e2eJiraFilterLink;       // Jira filter link for E2E Critical Defects
    private String a11yJiraFilterLink;      // Jira filter link for ADA Critical Defects
    private String e2eConfluenceLink;       // Confluence link for E2E Golden Flows
    
    private List<Defect> defects;           // Critical defects table
    private List<TestCase> testCases;       // Golden flows test results
    private List<AccessibilityResult> accessibilityResults; // A11Y test results
    private List<A11yMetric> a11yMetrics;   // A11Y metrics per platform
    private List<String> thankYouNames;     // Thank you names
}
