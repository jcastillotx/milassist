#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Build frontend
echo "Building frontend..."
npm run build

# Change to server directory and install dependencies
echo "Installing server dependencies..."
cd server
npm install

# Start the application
echo "Starting MilAssist API..."
npm start
