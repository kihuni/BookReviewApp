#!/bin/bash
echo "Running migrations..."
python3 /code/manage.py migrate
echo "Starting gunicorn..."
gunicorn bookreviewplatform.wsgi:application --bind 0.0.0.0:8000
