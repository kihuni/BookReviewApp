from rest_framework import serializers
from .models import Book, Review, Vote

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