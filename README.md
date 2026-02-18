# QE Reporting Hub

A Spring Boot web application that helps quality engineers send standardized end-to-end testing status and completion emails. This tool eliminates common issues with manually sent emails such as inconsistent formatting, font sizes, design, and recipient management.

## Features

✅ **Standardized Email Templates**
- Professional HTML email templates with consistent formatting
- Proper font sizes and styling
- Responsive design that works across email clients

📊 **Two Report Types**
- **Test Status Report**: Send ongoing test execution updates
- **Test Completion Report**: Send comprehensive test completion summaries

🎯 **Key Benefits**
- Consistent TO, CC, and BCC handling
- Real-time test metrics and statistics
- Easy-to-use web interface
- RESTful API for CI/CD integration
- Validation to prevent errors

## Technology Stack

- **Java 21**
- **Spring Boot 3.2.2**
- **Spring Boot Mail** (JavaMail)
- **Thymeleaf** (HTML templating)
- **Maven** (Build tool)

## Prerequisites

- Java 21 or higher
- Maven 3.6 or higher
- SMTP server access (Gmail, Outlook, or corporate mail server)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd /Users/r0o01gi/Documents/e2e-testing-email-notifier
   ```

2. **Configure email settings:**
   Edit `src/main/resources/application.properties` with your SMTP server details:

   **For Gmail:**
   ```properties
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-app-password
   ```
   
   Note: For Gmail, you need to create an [App Password](https://support.google.com/accounts/answer/185833).

   **For Outlook/Office365:**
   ```properties
   spring.mail.host=smtp.office365.com
   spring.mail.port=587
   spring.mail.username=your-email@outlook.com
   spring.mail.password=your-password
   ```

   **For Corporate SMTP Server:**
   ```properties
   spring.mail.host=smtp.yourcompany.com
   spring.mail.port=587
   spring.mail.username=your-email@yourcompany.com
   spring.mail.password=your-password
   ```

3. **Build the project:**
   ```bash
   export JAVA_HOME=$(/usr/libexec/java_home -v 21)
   mvn clean install
   ```

4. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```
   
   Or run the JAR file:
   ```bash
   java -jar target/e2e-testing-email-notifier-1.0.0.jar
   ```

5. **Access the web interface:**
   Open your browser and navigate to: `http://localhost:8080`

## Usage

### Web Interface

1. **Home Page** (`http://localhost:8080`)
   - Choose between Status Report or Completion Report

2. **Test Status Report** (`http://localhost:8080/status`)
   - Fill in project details, test status, metrics
   - Add blockers and notes
   - Specify recipients
   - Click "Send Email"

3. **Test Completion Report** (`http://localhost:8080/completion`)
   - Fill in project details and final results
   - Add failed test cases and summary
   - Include report URL if available
   - Specify recipients
   - Click "Send Email"

### REST API

You can also integrate with CI/CD pipelines using the REST API:

#### Send Test Status Email

```bash
POST http://localhost:8080/api/email/status
Content-Type: application/json

{
  "projectName": "MyProject",
  "testSuiteName": "Smoke Tests",
  "status": "IN_PROGRESS",
  "environment": "QA",
  "buildNumber": "#123",
  "branch": "develop",
  "totalTests": 100,
  "passedTests": 75,
  "failedTests": 5,
  "skippedTests": 0,
  "progressPercentage": "80%",
  "blockers": ["API timeout issue", "Database connection error"],
  "additionalNotes": "Tests running smoothly",
  "toRecipients": ["qa-team@company.com"],
  "ccRecipients": ["manager@company.com"],
  "bccRecipients": []
}
```

#### Send Test Completion Email

```bash
POST http://localhost:8080/api/email/completion
Content-Type: application/json

{
  "projectName": "MyProject",
  "testSuiteName": "Regression Tests",
  "finalStatus": "PASSED",
  "environment": "QA",
  "buildNumber": "#124",
  "branch": "main",
  "startTime": "2026-02-13T10:00:00",
  "endTime": "2026-02-13T12:30:00",
  "duration": "2 hours 30 minutes",
  "totalTests": 250,
  "passedTests": 245,
  "failedTests": 5,
  "skippedTests": 0,
  "failedTestCases": ["LoginTest.testPasswordReset", "CheckoutTest.testPayment"],
  "reportUrl": "https://reports.company.com/test-124",
  "summary": "Overall execution was successful with minor issues",
  "toRecipients": ["qa-team@company.com"],
  "ccRecipients": ["manager@company.com", "dev-team@company.com"],
  "bccRecipients": []
}
```

## Project Structure

```
e2e-testing-email-notifier/
├── src/
│   ├── main/
│   │   ├── java/com/qe/emailnotifier/
│   │   │   ├── E2eTestingEmailNotifierApplication.java
│   │   │   ├── config/
│   │   │   │   └── EmailConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── EmailController.java
│   │   │   │   └── WebController.java
│   │   │   ├── model/
│   │   │   │   ├── TestStatus.java
│   │   │   │   ├── TestStatusReport.java
│   │   │   │   └── TestCompletionReport.java
│   │   │   └── service/
│   │   │       └── EmailService.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── templates/
│   │           ├── index.html
│   │           ├── status-form.html
│   │           ├── completion-form.html
│   │           ├── test-status-email.html
│   │           └── test-completion-email.html
│   └── test/
│       └── java/com/qe/emailnotifier/
├── pom.xml
└── README.md
```

## Configuration Options

### Email Provider Settings

The application supports any SMTP server. Common configurations:

| Provider | Host | Port | SSL/TLS |
|----------|------|------|---------|
| Gmail | smtp.gmail.com | 587 | STARTTLS |
| Outlook/Office365 | smtp.office365.com | 587 | STARTTLS |
| Yahoo | smtp.mail.yahoo.com | 587 | STARTTLS |
| Corporate (example) | smtp.company.com | 587 | STARTTLS |

### Application Properties

- `server.port`: Web server port (default: 8080)
- `spring.mail.*`: SMTP configuration
- `app.email.from`: Sender email address
- `app.email.from-name`: Sender display name

## Troubleshooting

### Email Not Sending

1. **Check SMTP credentials**: Verify username and password
2. **Enable less secure apps** (Gmail): Create an App Password
3. **Firewall/Network**: Ensure SMTP port is not blocked
4. **Check logs**: Look for errors in console output

### Gmail App Password

1. Go to Google Account settings
2. Security → 2-Step Verification
3. App passwords → Generate new password
4. Use this password in `application.properties`

### Common Errors

- **Authentication failed**: Check username/password
- **Connection timeout**: Verify host and port
- **Invalid recipients**: Check email format

## CI/CD Integration Examples

### Jenkins Pipeline

```groovy
stage('Send Test Status') {
    steps {
        script {
            sh '''
                curl -X POST http://localhost:8080/api/email/status \
                -H "Content-Type: application/json" \
                -d '{
                    "projectName": "MyProject",
                    "testSuiteName": "Build '$BUILD_NUMBER'",
                    "status": "IN_PROGRESS",
                    "environment": "QA",
                    "buildNumber": "'$BUILD_NUMBER'",
                    "toRecipients": ["qa@company.com"]
                }'
            '''
        }
    }
}
```

### GitHub Actions

```yaml
- name: Send Test Completion Email
  run: |
    curl -X POST http://localhost:8080/api/email/completion \
    -H "Content-Type: application/json" \
    -d '{
      "projectName": "${{ github.repository }}",
      "testSuiteName": "E2E Tests",
      "finalStatus": "PASSED",
      "environment": "QA",
      "totalTests": 100,
      "passedTests": 98,
      "failedTests": 2,
      "toRecipients": ["qa@company.com"]
    }'
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is provided as-is for internal use.

## Support

For issues or questions, please contact your development team or create an issue in the project repository.

---

**Built with ❤️ for Quality Engineers**
