# Quick Start Guide

## Getting Started in 5 Minutes

### Step 1: Configure Email Settings

Edit `src/main/resources/application.properties`:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_APP_PASSWORD
```

**Important for Gmail users:**
- You must create an App Password (not your regular password)
- Visit: https://myaccount.google.com/apppasswords
- Generate a new app password and use it in the configuration

### Step 2: Build and Run

```bash
cd /Users/r0o01gi/Documents/e2e-testing-email-notifier
mvn spring-boot:run
```

### Step 3: Access the Application

Open your browser: http://localhost:8080

### Step 4: Send Your First Email

1. Click on "Create Status Report" or "Create Completion Report"
2. Fill in the form with your test details
3. Enter recipient email addresses
4. Click "Send Email"

## Sample Test Data

Use this sample data to test the application:

### For Status Report:
- Project Name: `Sample E2E Project`
- Test Suite: `Smoke Tests`
- Status: `In Progress`
- Environment: `QA`
- Build Number: `#100`
- Total Tests: `50`
- Passed: `40`
- Failed: `5`
- Skipped: `0`
- Progress: `80%`

### For Completion Report:
- Project Name: `Sample E2E Project`
- Test Suite: `Regression Tests`
- Final Status: `Passed`
- Environment: `Staging`
- Build Number: `#101`
- Total Tests: `100`
- Passed: `95`
- Failed: `5`
- Skipped: `0`

## Troubleshooting

### Issue: "Authentication failed"
**Solution:** 
- For Gmail: Use App Password, not your regular password
- For Outlook: Enable SMTP authentication in account settings
- For Corporate: Contact your IT department for SMTP credentials

### Issue: "Connection timeout"
**Solution:**
- Check if port 587 is blocked by firewall
- Try port 465 with SSL instead
- Verify the SMTP host address is correct

### Issue: Application won't start
**Solution:**
- Ensure Java 17 is installed: `java -version`
- Ensure Maven is installed: `mvn -version`
- Check if port 8080 is already in use

## API Usage Example

Send email programmatically using curl:

```bash
curl -X POST http://localhost:8080/api/email/status \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "MyProject",
    "testSuiteName": "API Tests",
    "status": "PASSED",
    "environment": "QA",
    "totalTests": 50,
    "passedTests": 50,
    "failedTests": 0,
    "toRecipients": ["qa-team@company.com"]
  }'
```

## Next Steps

1. Customize email templates in `src/main/resources/templates/`
2. Integrate with your CI/CD pipeline
3. Add your team's email addresses to common recipients
4. Schedule automated reports

## Support

For detailed documentation, see [README.md](README.md)
