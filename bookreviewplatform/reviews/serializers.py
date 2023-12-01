from rest_framework import serializers
from .models import Book, UserProfile, SelectedBook
from django.contrib.auth.models import User

class SelectedBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = SelectedBook
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    selected_books = SelectedBookSerializer(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
        
class UserSerializers(serializers.ModelSerializer):
    selected_books = SelectedBookSerializer(many=True, read_only=True)
    
    
    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)

        if password is not None:
            user.set_password(password)
        user.save()

        # Create or retrieve UserProfile for the user
       # user_profile, created = UserProfile.objects.get_or_create(user=user)

        return user