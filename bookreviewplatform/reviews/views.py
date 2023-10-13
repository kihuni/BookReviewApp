from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import mixins
from .models import *
from .serializers import  BookSerializer, ReviewSerializer,VoteSerializers,UserSerializer

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
    
class UserRegisterViewSet(viewsets.ViewSet):
    queryset = User.object.all()
    
    def create(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

class EmailVerificationViewSet(viewsets.ViewSet):
    def create(self, request):
        token = request.data.get('token')
        
        try:
            user = User.objects.get(email_verification_token=token)
            if user:
                user.email_verified = True
                user.save()
                return Response({"message": "Email successfully verified."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            pass
        
        return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
        
            