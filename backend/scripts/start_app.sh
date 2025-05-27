#!/usr/bin/env bash
set -e

PROJECT_MAIN_DIR_NAME="Django-React-Cursor-main"

# Validate variables
if [ -z "$PROJECT_MAIN_DIR_NAME" ]; then
    echo "Error: PROJECT_MAIN_DIR_NAME is not set. Please set it to your project directory name." >&2
    exit 1
fi

# Change ownership to ubuntu user
sudo chown -R muralimn:muralimn "/home/muralimn/$PROJECT_MAIN_DIR_NAME"

# Change directory to the project main directory
cd "/home/muralimn/$PROJECT_MAIN_DIR_NAME"

# Activate virtual environment
echo "Activating virtual environment..."
source "/home/muralimn/$PROJECT_MAIN_DIR_NAME/backend/venv/bin/activate"

# Run collectstatic command
echo "Running collectstatic command..."
python /home/muralimn/$PROJECT_MAIN_DIR_NAME/backend/manage.py collectstatic --noinput

# Restart Gunicorn and Nginx services
echo "Restarting Gunicorn and Nginx services..."
sudo service gunicorn restart
#sudo service nginx restart
sudo supervisorctl reload

echo "Application started successfully."
