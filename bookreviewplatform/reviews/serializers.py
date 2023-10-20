from rest_framework import serializers
from .models import Book, Review, Vote, User

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
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
    class Meta:
        model = User
        fields = ('id','username', 'password', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'password': {'write_only': True}
        }
        
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
        