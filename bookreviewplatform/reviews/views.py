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
from .serializers import SelectedBookSerializer, BookSerializer, UserProfileSerializer, UserSerializers
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission, SAFE_METHODS,IsAuthenticatedOrReadOnly



jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def retrieve(self, request, *args, **kwargs):
        book_id = kwargs.get('pk')
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        book_data = serializer.data

        # Fetch additional details from the Google Books API using the book title and author
        google_books_api_url = 'https://www.googleapis.com/books/v1/volumes'
        api_key = os.environ.get('GOOGLE_BOOK_API_KEY')
        params = {'q': f'{book_data["title"]} {book_data["author"]}', 'key': api_key}

        try:
            response = requests.get(google_books_api_url, params=params)

            if response.status_code == 200:
                google_books_data = response.json()
                if 'items' in google_books_data:
                    item = google_books_data['items'][0]
                    book_data['google_books_data'] = {
                        'description': item['volumeInfo'].get('description', ''),
                        'published_date': item['volumeInfo'].get('publishedDate', ''),
                    }
                else:
                    print(f"Error: 'items' key not found in Google Books API response.")
            else:
                print(f"Error fetching data from Google Books API. Status code: {response.status_code}")

            return Response(book_data)

        except Exception as e:
            print(f"Error in Google Books API request: {e}")
            return Response({'detail': 'Error in Google Books API request.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['GET'])
    def search(self, request):
            query = request.query_params.get('query', '')
            
            # Perform a search using the Google Books API
            google_books_api_url = 'https://www.googleapis.com/books/v1/volumes'
            api_key = os.environ.get('GOOGLE_BOOK_API_KEY')
            params = {'q': query, 'key': api_key}

            try:
                response = requests.get(google_books_api_url, params=params)

                if response.status_code == 200:
                    google_books_data = response.json()
                    # Extract relevant book information from the API response
                    books = []
                    for item in google_books_data.get('items', []):
                        books.append({
                            'title': item['volumeInfo'].get('title', ''),
                            'author': ', '.join(item['volumeInfo'].get('authors', [])),
                            'description': item['volumeInfo'].get('description', ''),
                            'published_date': item['volumeInfo'].get('publishedDate', ''),
                        })
                    return Response(books)
                else:
                    print(f"Error fetching data from Google Books API. Status code: {response.status_code}")
                    return Response({'detail': 'Error in Google Books API request.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            except Exception as e:
                print(f"Error in Google Books API request: {e}")
                return Response({'detail': 'Error in Google Books API request.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['GET'])
    def recommendations(self, request, pk=None):
        book = self.get_object()
        recommendations = self.generate_google_books_recommendations(book)
        serializer = BookSerializer(recommendations, many=True)
        return Response(serializer.data)

    def generate_google_books_recommendations(self, book):
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
        
class SelectedBookViewSet(viewsets.ModelViewSet):
    queryset = SelectedBook.objects.all()
    serializer_class = SelectedBookSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['GET'])
    def user_books(self, request):
        user_books = SelectedBook.objects.filter(user_profile__user=request.user)
        serializer = SelectedBookSerializer(user_books, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['POST'])
    def selected_books(self, request):
        user_profile = request.user.userprofile
        book_id = request.data.get('book_id')
        user_profile.add_selected_book(book_id)
        return Response({'message': 'Book selected successfully'})

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        user = self.request.user
        return UserProfile.objects.filter(user=user)
    
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

            # Create or retrieve UserProfile for the user
            user_profile, created = UserProfile.objects.get_or_create(user=user)

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

            # Retrieve UserProfile for the user
            user_profile = UserProfile.objects.get(user=user)

            return Response({'token': access_token})
        
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
    
    @action(detail=False, methods=['POST'])
    def google_login(self, request):
        # Receive the token from the frontend
        id_token = request.data.get('token')

        # Verify the token with Google API
        google_response = self.verify_google_token(id_token)
        
        if google_response.get('error'):
            error_message = google_response.get('error_description', 'Google authentication failed.')
            return Response({'detail': error_message}, status=status.HTTP_401_UNAUTHORIZED)

        # Extract user information from the Google response
        google_user_info = google_response.get('user_info', {})
        email = google_user_info.get('email', '')
        username = google_user_info.get('email', '').split('@')[0]  # Using email as a username

        try:
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

        except Exception as e:
            # Log the exception for debugging purposes
            print(f"Error during Google login: {e}")

            # Return a generic error message to the client
            return Response({'detail': 'Internal server error during Google login.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def verify_google_token(self, id_token):
        google_api_url = 'https://www.googleapis.com/oauth2/v3/tokeninfo'
        params = {'id_token': id_token}

        try:
            response = requests.get(google_api_url, params=params)
            response.raise_for_status()
            return response.json()

        except requests.RequestException as e:
            # Log the exception for debugging purposes
            print(f"Error verifying Google token: {e}")

            # Return a specific error message to the client
            return {'error': 'Failed to verify Google token.', 'error_description': str(e)}
