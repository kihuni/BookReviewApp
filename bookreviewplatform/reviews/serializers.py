from rest_framework import serializers
from .models import Book, ReadingChallenge, Review, UserProfile, Vote, User

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        
class ReadingChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingChallenge
        fields = '__all__'

        
class ReviewSerializer(serializers.ModelSerializer):
        class Meta:
            model = Review
            fields = '__all__'
    
class VoteSerializers(serializers.ModelSerializer):
        class Meta:
            model = Vote
            fields = '__all__'
            
class UserSerializers(serializers.ModelSerializer):
        
    def create(self, validate_data):
        # Remove the password from the validated_data dictionary
        password = validate_data.pop('password', None)
        
        # Create a user instance
        instance = self.Meta.model(**validate_data)
        
        # Check if the password exist and set it using set_password
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
        