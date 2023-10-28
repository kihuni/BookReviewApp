# Django settings for bookreviewplatform project.

from pathlib import Path
import os
from datetime import timedelta

#import environ


#env = environ.Env()
#environ.Env.read_env()
#print(os.environ)

#SECRET_KEY = 'django-insecure-dzdzz3%%krny(o+w-&&sr963zeekc(s9cyo1c+jr$9n7%%sh%%kd4g'
#DEBUG = True
#ALLOWED_HOSTS = ['localhost', '127.0.0.1']


BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')

#SECRET_KEY = env('DJANGO_SECRET_KEY')
#DEBUG = env.bool('DJANGO_DEBUG', default=True)
#ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS', default=['localhost', '127.0.0.1', 'your-subdomain.onrender.com'])
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-dzdzz3%%krny(o+w-&&sr963zeekc(s9cyo1c+jr$9n7%%sh%%kd4g')
DEBUG = os.environ.get('DJANGO_DEBUG', 'True') == 'True' 
ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')


REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',),
    'DEFAULT_AUTHENTICATION_CLASSES': ('rest_framework_simplejwt.authentication.JWTAuthentication',),
}

SIMPLE_JWT = {
    'ROTATE_REFRESH_TOKENS': False,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'VALIDATED_TOKEN': True,
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=480), 
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'ROTATE_REFRESH_TOKENS': False,
}

INSTALLED_APPS = [
    'reviews',
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOWED_ORIGINS = [
    "https://book-review-app-tree-main-bookreview-frontend.vercel.app",
    "http://localhost:8000",
    "http://127.0.0.1:8000"
]

CORS_ALLOW_CREDENTIALS = True

#CORS_ORIGIN_ALLOW_ALL = env.bool('CORS_ORIGIN_ALLOW_ALL', default=True)
CORS_ORIGIN_ALLOW_ALL = os.environ.get('CORS_ORIGIN_ALLOW_ALL', 'True') == 'True'
ROOT_URLCONF = 'bookreviewplatform.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'bookreviewplatform.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.environ.get('POSTGRES_DB', 'default_db_name'),
        'USER': os.environ.get('POSTGRES_USER', 'default_user'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'default_password'),
        'HOST': os.environ.get('POSTGRES_HOST', 'db'),
        'PORT': int(os.environ.get('POSTGRES_PORT', 5432)),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

from whitenoise.storage import CompressedManifestStaticFilesStorage

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
