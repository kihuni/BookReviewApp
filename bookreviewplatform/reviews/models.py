from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Book(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='books', null=True)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField()
    cover_image = models.ImageField(upload_to='books/covers/', null=True, blank=True)
    published_date = models.DateField(null=True, blank=True)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Review(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])  # Ratings from 1 to 5
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.book.title}"

class Vote(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    value = models.SmallIntegerField(choices=[(-1, 'Downvote'), (1, 'Upvote')])  # -1 for downvote, 1 for upvote
    casted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['review', 'user']  # A user can only upvote/downvote a review once

    def __str__(self):
        return f"Vote by {self.user.username} for review {self.review.id}"
    
 
