#!/bin/bash

#     touch baseline.sh;
#bash 
#   chmod +x baseline.sh;

# script to configure Backend, frontend
# create root folder


#parameter to create project folders
# ./baseline.sh Django-React-Cursor-main backend frontend crud api


echo "Main Project Folder Name: $1"
echo "backend: $2"
echo "frondend $3"
echo "start project: $4
echo "App name: $5
#main folder

 sudo apt install python3.12
 sudo apt install pipx
 
 mkdir ./$1 

 sudo chmod -R a+rwx $2

 cd ./$1 

#backemd
mkdir ./$2

cd ./$2
chmod ugo+rwx $2

sudo apt install -y virtualenv

python3.12 -m  virtualenv venv

source ./venv/bin/activate

sudo apt install python3-django

sudo apt install python3-venv

django-admin startproject $4 .

django-admin startapp $5

pip install -U djangorestframework

## migration
python3.12 manage.py makemigrations

## migrate
python3.12 manage.py migrate

cd ..
sudo apt install nodejs
sudo npm create vite@latest $3 -- --template react
cd $3

sudo apt install npm
sudo apt-get install -f 


sudo npm install react-router-dom
sudo npm install axios 
sudo npm install react-hook-form @hookform/resolvers yup
sudo npm install @mui/icons-material
sudo npm install @mui/material @emotion/react @emotion/styled
sudo npm i material-react-table @mui/material @mui/x-date-pickers @mui/icons-material @emotion/react @emotion/styled
sudo npm install react-bootstrap bootstrap

pip install django-cors-headers
sudo pip install django-crispy-forms 
sudo pip install whitenoise

pip install django-crispy-forms  
python3 -m pip install whitenoise

sudo apt install gunicorn
sudo apt install nginx

sudo chmod -R a+rwx $1
cd ..
sudo chmod -R a+rwx $2
sudo chmod -R a+rwx $3

cd $2   #backend
cd $4   #project

pwd
sed "/django.contrib.staticfiles/s/$/ 'whitenoise.runserver_nostatic','rest_framework','corsheaders','crispy_forms','$5',/" settings.py > settings1.py
sed "/django.middleware.security.SecurityMiddleware/s/$/ 'whitenoise.middleware.WhiteNoiseMiddleware','corsheaders.middleware.CorsMiddleware',/" settings1.py > settings2.py
sed "/static/s/$/ STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles') MEDIA_URLS = '\/media\/' MEDIA_ROOT = os.path.join(BASE_DIR, 'media')/" settings.py > settings3.py
#sed "/static/s/$/ MEDIA_URLS = '\/media\/' MEDIA_ROOT = os.path.join(BASE_DIR, 'media')/" settings.py > settings3.py

cp settings1.py settings.py
rm settings1.py


 npm run lint
 sudo sysctl fs.inotify.max_user_watches=524288
 