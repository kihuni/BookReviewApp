# views.py

from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.decorators import action
from rest_framework_jwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import mixins
from .models import *
import os
import requests
from django.http import JsonResponse
import requests
from .serializers import UserProfileSerializer, ReadingChallengeSerializer, ReviewSerializer, VoteSerializers, UserSerializers
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission, SAFE_METHODS

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

class ReadingChallengeViewSet(viewsets.ModelViewSet):
    serializer_class = ReadingChallengeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ReadingChallenge.objects.filter(user=self.request.user)

class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.none()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated | ReadOnly]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        book_data = serializer.data

        # Fetch additional details from the Google Books API using the book title and author
        google_books_api_url = 'https://www.googleapis.com/books/v1/volumes'
        api_key = os.environ.get('GOOGLE_BOOK_API_KEY')
        params = {'q': f'{book_data["title"]} {book_data["author"]}', 'key': api_key}

        response = requests.get(google_books_api_url, params=params)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            google_books_data = response.json()

            # Update the book_data with additional details
            if 'items' in google_books_data:
                item = google_books_data['items'][0]
                book_data['google_books_data'] = {
                    'description': item['volumeInfo'].get('description', ''),
                    'published_date': item['volumeInfo'].get('publishedDate', ''),
                }
            else:
                # Handle the case where 'items' key is not present in the response
                print(f"Error: 'items' key not found in Google Books API response.")
        else:
            # Handle the case where the Google Books API request was not successful
            print(f"Error fetching data from Google Books API. Status code: {response.status_code}")

        return Response(book_data)

    @action(detail=True, methods=['GET'])
    def recommendations(self, request, pk=None):
        book = self.get_object()
        recommendations = self.generate_recommendations(book)
        serializer = UserProfileSerializer(recommendations, many=True)
        return Response(serializer.data)

    def generate_recommendations(self, book):
        google_books_api_url = 'https://www.googleapis.com/books/v1/volumes'
        api_key = os.environ.get('GOOGLE_BOOK_API_KEY')
        params = {'q': f'similar:{book.title} {book.author}', 'maxResults': 5, 'key': api_key}

        try:
            response = requests.get(google_books_api_url, params=params)
            response.raise_for_status()
            google_books_data = response.json()

            recommendations = []
            if 'items' in google_books_data:
                for item in google_books_data['items']:
                    recommendations.append({
                        'title': item['volumeInfo'].get('title', ''),
                        'author': ', '.join(item['volumeInfo'].get('authors', [])),
                        'description': item['volumeInfo'].get('description', ''),
                        'published_date': item['volumeInfo'].get('publishedDate', ''),
                    })

            return recommendations

        except requests.RequestException as e:
            print(f"Error fetching recommendations from Google Books API: {e}")
            return []

class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializers

class UserViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    
    def get_permissions(self):
        if self.action == 'register' or self.action == 'login':
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['POST'])
    def register(self, request):
        serializer = UserSerializers(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response({'token': access_token})
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['GET'])
    def profile(self, request):
        user_profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def reading_challenge(self, request):
        reading_challenge = ReadingChallenge.objects.get(user=request.user)
        serializer = ReadingChallengeSerializer(reading_challenge)
        return Response(serializer.data)

    @action(detail=False, methods=['POST'])
    def set_reading_challenge(self, request):
        serializer = ReadingChallengeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['PATCH'])
    def update_reading_challenge(self, request):
        reading_challenge = ReadingChallenge.objects.get(user=request.user)
        serializer = ReadingChallengeSerializer(reading_challenge, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['POST'])
    def google_login(self, request):
        # Receive the token from the frontend
        id_token = request.data.get('token')

        # Verify the token with Google API
        google_response = self.verify_google_token(id_token)
        
        if google_response.get('error'):
            return Response({'detail': 'Google authentication failed.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Extract user information from the Google response
        google_user_info = google_response.get('user_info', {})
        email = google_user_info.get('email', '')
        username = google_user_info.get('email', '').split('@')[0]  # Using email as a username

        # Check if the user with the provided email already exists
        user, created = User.objects.get_or_create(username=username, email=email)

        # Authenticate the user
        if created or not user.password:
            # If the user is newly created or doesn't have a password, set an unusable password
            user.set_unusable_password()
            user.save()

        # Generate JWT token for the authenticated user
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({'token': access_token})

    def verify_google_token(self, id_token):
        google_api_url = 'https://www.googleapis.com/oauth2/v3/tokeninfo'
        params = {'id_token': id_token}

        try:
            response = requests.get(google_api_url, params=params)
            response.raise_for_status()
            return response.json()

        except requests.RequestException as e:
            print(f"Error verifying Google token: {e}")
            return {'error': 'Failed to verify Google token.'}

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['POST'])
    def vote(self, request, pk=None):
        review = self.get_object()
        value = request.data.get('value')
        vote, created = Vote.objects.get_or_create(review=review, user=request.user, defaults={'value': value})

        if not created:
            vote.value = value
            vote.save()

        return Response({"message": "Vote casted successfully!"}, status=status.HTTP_201_CREATED)
