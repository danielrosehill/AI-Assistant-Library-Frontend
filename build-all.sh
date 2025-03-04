#!/bin/bash

# This script runs the build.js script repeatedly until all files are processed

echo "Starting build process..."

# Clear the build output file
> build-output.txt

# Initial run
node build.js | tee -a build-output.txt

# Continue running until all files are processed
while [ $? -eq 0 ] && grep -q "To process the next batch" build-output.txt; do
    # Extract the next command from the output
    NEXT_COMMAND=$(grep -A 1 "To process the next batch" build-output.txt | tail -n 1)
    
    echo "Running next batch: $NEXT_COMMAND"
    
    # Run the next command
    $NEXT_COMMAND | tee -a build-output.txt
done

echo "Build process completed!"