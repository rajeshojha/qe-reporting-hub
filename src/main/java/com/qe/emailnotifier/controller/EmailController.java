package com.qe.emailnotifier.controller;

import com.qe.emailnotifier.model.*;
import com.qe.emailnotifier.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/api/email")
@RequiredArgsConstructor
@Slf4j
public class EmailController {

    private final EmailService emailService;
    private final TemplateEngine templateEngine;

    /**
     * Send test status email
     */
    @PostMapping("/status")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> sendTestStatusEmail(
            @Valid @RequestBody TestStatusReport report) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            emailService.sendTestStatusEmail(report);
            response.put("success", true);
            response.put("message", "Test status email sent successfully");
            return ResponseEntity.ok(response);
            
        } catch (MessagingException e) {
            log.error("Failed to send test status email", e);
            response.put("success", false);
            response.put("message", "Failed to send email: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Send test completion email
     */
    @PostMapping("/completion")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> sendTestCompletionEmail(
            @Valid @RequestBody TestCompletionReport report) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Calculate pass percentage if not provided
            if (report.getPassPercentage() == null && report.getTotalTestCases() != null && report.getTotalTestCases() > 0) {
                double passRate = (report.getPassedTestCases() * 100.0) / report.getTotalTestCases();
                report.setPassPercentage(passRate);
            }
            
            emailService.sendTestCompletionEmail(report);
            response.put("success", true);
            response.put("message", "Test completion email sent successfully");
            return ResponseEntity.ok(response);
            
        } catch (MessagingException e) {
            log.error("Failed to send test completion email", e);
            response.put("success", false);
            response.put("message", "Failed to send email: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Preview test status email template
     */
    @GetMapping(value = "/preview/status", produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String previewTestStatusEmail() {
        TestStatusReport mockReport = createMockTestStatusReport();
        
        Context context = new Context();
        context.setVariable("report", mockReport);
        
        return templateEngine.process("test-status-email", context);
    }

    /**
     * Preview test completion email template
     */
    @GetMapping(value = "/preview/completion", produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String previewTestCompletionEmail() {
        TestCompletionReport mockReport = createMockTestCompletionReport();
        
        Context context = new Context();
        context.setVariable("report", mockReport);
        
        return templateEngine.process("test-completion-email", context);
    }

    /**
     * Create mock data for test status report preview
     */
    private TestStatusReport createMockTestStatusReport() {
        return TestStatusReport.builder()
            .projectName("E2E Testing - Mobile App")
            .vertical("Fulfillment")
            .opifId("OPIF-234567")
            .riskStatus("At High Risk")
            .testEnvironment("QA Environment")
            .reportDate("February 16, 2026")
            .programManagerName("Sarah Johnson")
            .summaryMessage("E2E Testing is On Track")
            .passRatePercentage(84)
            .attemptRatePercentage(96)
            .criticalP1Count(2)
            .taggedStakeholders(Arrays.asList("@John Doe", "@Jane Smith", "@Bob Johnson"))
            .keyCallouts(Arrays.asList(
                "2 critical P1 defects need immediate attention",
                "Payment gateway integration delayed by 2 days",
                "A11Y compliance at 90% across all platforms"
            ))
            .defects(Arrays.asList(
                Defect.builder()
                    .bugId("CEPG-360265")
                    .priority("P1")
                    .currentOwner("John Smith")
                    .manager("Sarah Wilson")
                    .director("Mike Johnson")
                    .sdGd("Q4 2026")
                    .plannedDoneDate("02/18")
                    .status("In Progress")
                    .build(),
                Defect.builder()
                    .bugId("CEPG-360289")
                    .priority("P1")
                    .currentOwner("Alice Brown")
                    .manager("Tom Davis")
                    .director("Emily White")
                    .sdGd("Q4 2026")
                    .plannedDoneDate("02/20")
                    .status("Backlog")
                    .build(),
                Defect.builder()
                    .bugId("CEPG-360290")
                    .priority("P2")
                    .currentOwner("Bob Martinez")
                    .manager("Lisa Green")
                    .director("David Clark")
                    .sdGd("Q1 2027")
                    .plannedDoneDate("")
                    .status("Backlog")
                    .build()
            ))
            .testCases(Arrays.asList(
                TestCase.builder()
                    .tcId("TC 1")
                    .overallStatus("Passed")
                    .android("Passed")
                    .ios("Passed")
                    .dWeb("Passed")
                    .mWeb("Passed")
                    .comments("")
                    .build(),
                TestCase.builder()
                    .tcId("TC 2")
                    .overallStatus("Failed")
                    .android("Passed")
                    .ios("Failed")
                    .dWeb("Passed")
                    .mWeb("Passed")
                    .comments("CEPG-360265")
                    .build(),
                TestCase.builder()
                    .tcId("TC 3")
                    .overallStatus("In Progress")
                    .android("Passed")
                    .ios("In Progress")
                    .dWeb("Passed")
                    .mWeb("Not Attempted")
                    .comments("Testing in progress")
                    .build(),
                TestCase.builder()
                    .tcId("TC 4")
                    .overallStatus("Passed")
                    .android("Passed")
                    .ios("Passed")
                    .dWeb("Passed")
                    .mWeb("Not Attempted")
                    .comments("")
                    .build()
            ))
            .accessibilityResults(Arrays.asList(
                AccessibilityResult.builder()
                    .platform("Web")
                    .attemptedPercentage("100%")
                    .passPercentage("92%")
                    .comments("Minor color contrast issues")
                    .build(),
                AccessibilityResult.builder()
                    .platform("iOS")
                    .attemptedPercentage("100%")
                    .passPercentage("88%")
                    .comments("VoiceOver issues in checkout")
                    .build(),
                AccessibilityResult.builder()
                    .platform("Android")
                    .attemptedPercentage("95%")
                    .passPercentage("90%")
                    .comments("TalkBack improvements needed")
                    .build()
            ))
            .a11yMetrics(Arrays.asList(
                A11yMetric.builder()
                    .platform("Android")
                    .attemptedPercentage(95)
                    .passPercentage(90)
                    .comments("TalkBack improvements needed")
                    .build(),
                A11yMetric.builder()
                    .platform("iOS")
                    .attemptedPercentage(100)
                    .passPercentage(88)
                    .comments("VoiceOver issues in checkout")
                    .build(),
                A11yMetric.builder()
                    .platform("dWeb")
                    .attemptedPercentage(100)
                    .passPercentage(92)
                    .comments("Minor color contrast issues")
                    .build(),
                A11yMetric.builder()
                    .platform("mWeb")
                    .attemptedPercentage(98)
                    .passPercentage(94)
                    .comments("All tests passed")
                    .build()
            ))
            .thankYouNames(Arrays.asList(
                "Rajesh Ojha",
                "John Doe",
                "Jane Smith"
            ))
            .e2eJiraFilterLink("https://jira.walmart.com/issues/?filter=12345")
            .a11yJiraFilterLink("https://jira.walmart.com/issues/?filter=67890")
            .e2eConfluenceLink("https://confluence.walmart.com/display/QA/E2E+Golden+Flows")
            .build();
    }

    /**
     * Create mock data for test completion report preview
     */
    private TestCompletionReport createMockTestCompletionReport() {
        return TestCompletionReport.builder()
            .projectName("E2E Testing - Mobile App")
            .riskStatus("Sprint 24.2")
            .testEnvironment("Production")
            .completionDate("February 16, 2026")
            .overallStatus("Signed Off with Conditions")
            .totalTestCases(150)
            .passedTestCases(142)
            .failedTestCases(5)
            .blockedTestCases(3)
            .passPercentage(94.67)
            .remarks("E2E testing completed successfully with 94.67% pass rate. 5 minor defects identified and logged for future sprints. 3 test cases blocked due to environment limitations. Overall quality is acceptable for production release.")
            .build();
    }
}
