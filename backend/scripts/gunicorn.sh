#!/usr/bin/bash

# Replace {YOUR_PROJECT_MAIN_DIR_NAME} with your actual project directory name
PROJECT_MAIN_DIR_NAME="Django-React-Cursor-main"

# Copy gunicorn socket and service files
sudo cp "/home/muralimn/$PROJECT_MAIN_DIR_NAME/backend/gunicorn/gunicorn.socket" "/etc/systemd/system/gunicorn.socket"
sudo cp "/home/muralimn/$PROJECT_MAIN_DIR_NAME/backend/gunicorn/gunicorn.service" "/etc/systemd/system/gunicorn.service"

# Start and enable Gunicorn service
sudo systemctl start gunicorn.service
sudo systemctl enable gunicorn.service
