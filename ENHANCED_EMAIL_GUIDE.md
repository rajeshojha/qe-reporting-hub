# Enhanced E2E Test Status Email - Dynamic Fields Guide

## Overview
The status email template has been enhanced to match your sample email format with comprehensive E2E testing reporting capabilities.

## Dynamic Fields to Fill in UI

### **Basic Information** (Required)
- **projectName**: Name of the project (e.g., "Extra Savings and Tiering Enhancement")
- **testSuiteName**: Name of the test suite (e.g., "E2E Golden Flows")
- **status**: Test status - IN_PROGRESS, PASSED, FAILED, BLOCKED, or SKIPPED
- **environment**: Environment name (e.g., "Production", "Staging")

### **Basic Details** (Optional)
- **buildNumber**: Build/version number (e.g., "2.5.0")
- **branch**: Git branch name (e.g., "main", "release/v2.5")
- **startTime**: Test start time (format: "2026-02-13T08:00:00")
- **reportTime**: Report generation time (format: "2026-02-13T18:00:00")

### **Test Metrics** (Optional - for basic stats box)
- **totalTests**: Total number of test cases
- **passedTests**: Number of passed tests
- **failedTests**: Number of failed tests  
- **skippedTests**: Number of skipped tests
- **progressPercentage**: Progress indicator (e.g., "96%")

### **Enhanced Summary Section** (Optional)
- **summaryMessage**: Main summary text with stakeholder tags (e.g., "E2E Testing is On Track. 1 Critical P1 requires immediate resolution - @Deepti Yadav")
- **passRatePercentage**: Overall pass rate percentage (e.g., 84.0)
- **attemptRatePercentage**: Attempt rate percentage (e.g., 96.0)
- **criticalP1Count**: Number of critical P1 issues (e.g., 1)
- **taggedStakeholders**: List of stakeholders to tag (e.g., ["@Deepti Yadav - Vendor", "@Nitin Gupta"])

### **Key Callouts** (Optional)
- **keyCallouts**: List of important action items/callouts
  Example:
  ```
  [
    "All P1s must be resolved in 24 Hours",
    "Provide Updated SLAs/Planned Done Date for open P1's",
    "One pending ADA bug is ready to test"
  ]
  ```

### **Critical Defects Table** (Optional)
- **defects**: Array of defect objects with:
  - **bugId**: Bug ID (e.g., "CEPG-360265")
  - **priority**: Priority level (e.g., "P1", "P2", "P3")
  - **currentOwner**: Person assigned
  - **manager**: Manager name
  - **director**: Director name
  - **sdGd**: SD/GD field
  - **plannedDoneDate**: Target completion date (e.g., "09/02")
  - **status**: Current status (e.g., "Backlog", "Peer review", "WIP")

### **Test Cases / Golden Flows** (Optional)
- **testCasesLink**: Link to detailed test documentation (Confluence/etc.)
- **testCases**: Array of test case objects with:
  - **tcId**: Test case ID (e.g., "TC 1", "TC 2")
  - **overallStatus**: Overall result (e.g., "Passed", "Failed", "Not attempted")
  - **android**: Android platform result
  - **ios**: iOS platform result
  - **dWeb**: Desktop web result
  - **mWeb**: Mobile web result
  - **comments**: Associated bug IDs or notes

### **Accessibility (A11Y) Results** (Optional)
- **accessibilityResults**: Array of accessibility test results with:
  - **platform**: Platform name (e.g., "Web", "iOS", "Android")
  - **attemptedPercentage**: Percentage attempted (e.g., "100%")
  - **passPercentage**: Pass rate (e.g., "90%", "100%")
  - **comments**: Additional notes

### **Additional Fields**
- **blockers**: List of blocking issues (array of strings)
- **additionalNotes**: Free-form notes/comments

### **Email Recipients** (Required)
- **toRecipients**: Array of primary recipients (e.g., ["rajesh.kumar.ojha@walmart.com"])
- **ccRecipients**: Array of CC recipients
- **bccRecipients**: Array of BCC recipients

## Visual Features

### Automatic Styling
- **P1 bugs**: Red badge with white text
- **P2 bugs**: Yellow badge with black text
- **Pass rate metrics**: Green color when ≥95%, red otherwise  
- **Test results**: ✓ for Passed (green), ✗ for Failed (red)
- **Critical P1 count**: Displayed prominently in red if > 0
- **Stakeholder tags**: Highlighted in summary section

### Sections Displayed
Sections only appear if the corresponding data is provided:
- Summary section (if summaryMessage provided)
- Key Callouts (if keyCallouts array has items)
- Critical Defects table (if defects array has items)
- Test Cases table (if testCases array has items)
- Accessibility Results (if accessibilityResults array has items)
- Blockers section (if blockers array has items)
- Additional Notes (if additionalNotes provided)

## Example Test
See `test-enhanced-email.json` for a complete example with all fields populated.

## Backward Compatibility
The template is fully backward compatible - existing simple emails with just basic fields will work exactly as before. Enhanced sections only appear when the corresponding data is provided.
