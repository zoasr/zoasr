#!/bin/bash

# Start a simple HTTP server to preview the README
# This will serve the preview.html file which shows all SVG components

echo "🚀 Starting preview server..."
echo "📝 Open your browser to: http://localhost:8080/preview.html"
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

cd /home/engine/project
python3 -m http.server 8080
