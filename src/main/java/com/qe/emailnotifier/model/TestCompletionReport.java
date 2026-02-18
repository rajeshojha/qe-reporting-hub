package com.qe.emailnotifier.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestCompletionReport {

    // Email metadata
    private String senderEmail;         // Sender's email address
    private List<String> recipients;
    private List<String> ccRecipients;
    private List<String> bccRecipients;
    private String subject;

    @NotBlank(message = "Project name is required")
    private String projectName;

    private String riskStatus;
    
    private String testEnvironment;
    
    private String completionDate;

    // Report content
    private String overallStatus;
    
    @NotNull(message = "Total test cases is required")
    private Integer totalTestCases;
    
    private Integer passedTestCases;
    
    private Integer failedTestCases;
    
    private Integer blockedTestCases;

    private Double passPercentage;

    private String remarks;
}
