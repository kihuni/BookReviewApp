from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.decorators import action
from rest_framework_jwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import mixins
from .models import *
from .serializers import  BookSerializer, ReviewSerializer,VoteSerializers, UserSerializers
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission, SAFE_METHODS

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

# Create your views here.
class ReadOnly(BasePermission):
    def has_permission(self,request,view):
        return request.method in SAFE_METHODS

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated | ReadOnly]
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Book.objects.filter(user=self.request.user)
        return Book.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    
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
        serializer = UserSerializers(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'])
    def user_books(self, request):
        user_books = Book.objects.filter(user=request.user)
        serializer = BookSerializer(user_books, many=True)
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if "book_pk" in self.kwargs:
            return Review.objects.filter(book__id=self.kwargs["book_pk"])
        return Review.objects.all()

    def perform_create(self, serializer):
        book_id = self.request.data.get('book')
        book_instance = Book.objects.get(id=book_id)
        serializer.save(user=self.request.user, book=book_instance)

    @action(detail=True, methods=['POST'])
    def vote(self, request, pk=None):
        review = self.get_object()
        value = request.data.get('value')
        vote, created = Vote.objects.get_or_create(review=review, user=request.user, defaults={'value': value})

        if not created:
            vote.value = value
            vote.save()

        return Response({"message": "Vote casted successfully!"}, status=status.HTTP_201_CREATED)
