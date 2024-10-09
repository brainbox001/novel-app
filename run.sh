#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting Node.js build process..."

# Build the application
npx tsc

echo "Node.js build process completed successfully."
