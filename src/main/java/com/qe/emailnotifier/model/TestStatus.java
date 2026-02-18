package com.qe.emailnotifier.model;

public enum TestStatus {
    IN_PROGRESS("In Progress"),
    PASSED("Passed"),
    FAILED("Failed"),
    BLOCKED("Blocked"),
    SKIPPED("Skipped");

    private final String displayName;

    TestStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
