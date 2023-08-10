#!/bin/sh

python /usr/src/app/backend/manage.py makemigrations
python /usr/src/app/backend/manage.py migrate --no-input
python manage.py collectstatic --no-input

# python /usr/src/app/backend/manage.py runserver 0.0.0.0:8000
gunicorn config.wsgi -b 0.0.0.0:8000
