# Use an official Python runtime as a parent image
FROM python:3.8-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /code

# Install dependencies
COPY requirements.txt /code/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the current directory contents into the container at /code
COPY . /code/

# Expose port 8000 for the app
EXPOSE 8000

# Define the command to run your Django application
CMD ["gunicorn", "bookreviewplatform.wsgi:application", "--bind", "0.0.0.0:8000"]
