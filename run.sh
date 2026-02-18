#!/bin/bash

# E2E Testing Email Notifier - Run Script

echo "🚀 Starting E2E Testing Email Notifier..."
echo ""

# Set Java 21
export JAVA_HOME=$(/usr/libexec/java_home -v 21)

# Check if Java 21 is available
if [ $? -ne 0 ]; then
    echo "❌ Error: Java 21 is required but not found."
    echo "Please install Java 21 from: https://www.oracle.com/java/technologies/downloads/"
    exit 1
fi

echo "✅ Using Java: $JAVA_HOME"
echo ""

# Run the application
mvn spring-boot:run
