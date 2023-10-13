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

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

# Create your views here.

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    
class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializers
    
class UserViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()

    @action(detail=False, methods=['POST'])
    def register(self, request):
        serializer =  UserSerializers(data=request.data)
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
            try:
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                return Response({'token': access_token})
            except User.DoesNotExist:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['GET'])
    def profile(self, request):
        serializer =  UserSerializers(request.user)
        return Response(serializer.data)