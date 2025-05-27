#!/bin/bash
set -e

# Replace {YOUR_GIT_REOPO_URL} with your actual Git repository URL
#GIT_REPO_URL="https://github.com/codewithmuh/django-aws-ec2-nginx-gunicorn.git"

# If using Private Repo
#GIT_REPO_URL="https://<your_username>:<your_PAT>@github.com/codewithmuh/django-aws-ec2-autoscaling.git"

# Replace {YOUR_PROJECT_MAIN_DIR_NAME} with your actual project directory name
PROJECT_MAIN_DIR_NAME="Django-React-Cursor-main"

# Clone repository
#git clone "$GIT_REPO_URL" "/home/muralimn/$PROJECT_MAIN_DIR_NAME"

cd "/home/muralimn/$PROJECT_MAIN_DIR_NAME/backend"

# Make all .sh files executable
chmod +x scripts/*.sh

# Execute scripts for OS dependencies, Python dependencies, Gunicorn, Nginx, and starting the application
./scripts/instance_os_dependencies.sh
./scripts/python_dependencies.sh
./scripts/gunicorn.sh
./scripts/nginx.sh
./scripts/supervisor.sh
./scripts/start_app.sh

#gunicorn --bind 0.0.0.0:8001 --chdir /home/muralimn/Django-React-Tutorial-main/backend/crud  crud.wsgi:application

sudo service nginx restart
sudo systemctl restart gunicorn
sudo systemctl daemon-reload
sudo systemctl restart gunicorn
sudo nginx -t && sudo systemctl restart nginx

sudo systemctl restart gunicorn
sudo systemctl restart nginx

sudo systemctl start gunicorn
sudo systemctl enable gunicorn

sudo systemctl daemon-reload
sudo systemctl restart gunicorn
#sudo systemctl status gunicorn

sudo systemctl reload nginx
