#!/bin/bash

python3 /code/bookreviewplatform/manage.py migrate
gunicorn bookreviewplatform.wsgi:application --bind 0.0.0.0:8000
