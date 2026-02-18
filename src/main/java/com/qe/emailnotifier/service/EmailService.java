package com.qe.emailnotifier.service;

import com.qe.emailnotifier.model.TestCompletionReport;
import com.qe.emailnotifier.model.TestStatusReport;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.from-name:E2E Testing Notification}")
    private String fromName;

    private static final DateTimeFormatter DATE_TIME_FORMATTER = 
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Send test status email notification
     */
    public void sendTestStatusEmail(TestStatusReport report) throws MessagingException {
        log.info("Preparing to send test status email for project: {}", 
                report.getProjectName());

        Context context = new Context();
        context.setVariable("report", report);
        context.setVariable("dateTimeFormatter", DATE_TIME_FORMATTER);

        String htmlContent = templateEngine.process("test-status-email", context);

        // Use the subject from the report or generate a default one
        String subject = report.getSubject() != null ? report.getSubject() : 
                String.format("[E2E Test Status] %s - %s",
                report.getProjectName(),
                report.getRiskStatus());

        sendEmail(report.getSenderEmail(), report.getRecipients(), report.getCcRecipients(), 
                report.getBccRecipients(), subject, htmlContent);

        log.info("Test status email sent successfully");
    }

    /**
     * Send test completion email notification
     */
    public void sendTestCompletionEmail(TestCompletionReport report) throws MessagingException {
        log.info("Preparing to send test completion email for project: {}", 
                report.getProjectName());

        Context context = new Context();
        context.setVariable("report", report);
        context.setVariable("dateTimeFormatter", DATE_TIME_FORMATTER);

        String htmlContent = templateEngine.process("test-completion-email", context);

        // Use the subject from the report or generate a default one
        String subject = report.getSubject() != null ? report.getSubject() : 
                String.format("[E2E Test Completed] %s - %s - %s (%.1f%% Passed)",
                report.getProjectName(),
                report.getRiskStatus(),
                report.getOverallStatus(),
                report.getPassPercentage() != null ? report.getPassPercentage() : 0.0);

        sendEmail(report.getSenderEmail(), report.getRecipients(), report.getCcRecipients(), 
                report.getBccRecipients(), subject, htmlContent);

        log.info("Test completion email sent successfully");
    }

    private void sendEmail(String senderEmail,
                          java.util.List<String> toRecipients,
                          java.util.List<String> ccRecipients,
                          java.util.List<String> bccRecipients,
                          String subject,
                          String htmlContent) throws MessagingException {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Use the sender email from report if provided, otherwise use default
            String effectiveFromEmail = (senderEmail != null && !senderEmail.isEmpty()) ? senderEmail : fromEmail;
            
            // Extract sender name from email address
            String effectiveFromName = fromName;
            if (senderEmail != null && !senderEmail.isEmpty() && senderEmail.contains("@")) {
                String username = senderEmail.substring(0, senderEmail.indexOf("@"));
                // Convert "john.doe" or "john_doe" to "John Doe"
                effectiveFromName = java.util.Arrays.stream(username.split("[._]"))
                    .map(part -> part.substring(0, 1).toUpperCase() + part.substring(1).toLowerCase())
                    .collect(java.util.stream.Collectors.joining(" "));
            }
            
            helper.setFrom(effectiveFromEmail, effectiveFromName);
            helper.setTo(toRecipients.toArray(new String[0]));

            if (ccRecipients != null && !ccRecipients.isEmpty()) {
                helper.setCc(ccRecipients.toArray(new String[0]));
            }

            if (bccRecipients != null && !bccRecipients.isEmpty()) {
                helper.setBcc(bccRecipients.toArray(new String[0]));
            }

            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (jakarta.mail.MessagingException e) {
            throw e;
        } catch (Exception e) {
            throw new MessagingException("Failed to send email", e);
        }
    }
}
