# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /code

# Install dependencies
COPY requirements.txt /code/
RUN pip install --upgrade pip && pip install -r requirements.txt
RUN apt-get update && apt-get install -y netcat


# Explicitly install psycopg2
RUN pip install psycopg2-binary==2.9.1

# Copy the current directory contents into the container at /code
COPY . /code/
