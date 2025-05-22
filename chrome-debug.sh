#!/bin/bash

CHROME_PATH="/opt/google/chrome/chrome"
DEBUG_PROFILE_DIR="/tmp/chrome-dev"

"$CHROME_PATH" --remote-debugging-port=9222 --user-data-dir="$DEBUG_PROFILE_DIR"
