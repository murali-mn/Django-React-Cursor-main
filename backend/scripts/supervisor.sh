#!/usr/bin/bash

# Replace {YOUR_PROJECT_MAIN_DIR_NAME} with your actual project directory name
PROJECT_MAIN_DIR_NAME="Django-React-Tutorial-main"

# Copy gunicorn socket and service files
sudo cp "/home/muralimn/$PROJECT_MAIN_DIR_NAME/backend/supervisor/supervisor.conf" "/etc/supervisor/conf.d/$PROJECT_MAIN_DIR_NAME.conf"

# Start and enable Gunicorn service
sudo supervisorctl reread
sudo supervisorctl update

python -m pip install numpy


echo "supervisorctl started successfully."