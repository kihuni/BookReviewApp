# models.py

from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    reading_challenge_goal = models.PositiveIntegerField(default=0)
    reading_challenge_progress = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Profile for {self.user.username}"

class SelectedBook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey('Book', on_delete=models.CASCADE)
    selected_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} selected {self.book.title}"


class ReadingChallenge(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    goal = models.PositiveIntegerField(default=0)
    progress = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Reading Challenge for {self.user.username}"

class Review(models.Model):
    book = models.ForeignKey('Book', on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.book.title}"

class Vote(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    value = models.SmallIntegerField(choices=[(-1, 'Downvote'), (1, 'Upvote')]) 
    casted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['review', 'user']  

    def __str__(self):
        return f"Vote by {self.user.username} for review {self.review.id}"

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField()
    cover_image = models.ImageField(upload_to='books/covers/', null=True, blank=True)
    published_date = models.DateField(null=True, blank=True)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
