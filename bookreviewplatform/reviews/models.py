from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    reading_challenge_goal = models.PositiveIntegerField(default=0)
    reading_challenge_progress = models.PositiveIntegerField(default=0)

    def add_selected_book(self, book_id):
        # Check if the book is not already selected
        if not self.selected_books.filter(book__id=book_id).exists():
            selected_book = SelectedBook.objects.create(user_profile=self, book_id=book_id)
            self.selected_books.add(selected_book)
            print(f"Selected book added: {selected_book}")

    def get_selected_books_by_title(self, title):
        return self.selected_books.filter(book__title__icontains=title)

    def get_selected_books_by_author(self, author):
        return self.selected_books.filter(book__author__icontains=author)

    def get_selected_books_by_details(self, details):
        return self.selected_books.filter(book__description__icontains=details)

class SelectedBook(models.Model):
    user_profile = models.ForeignKey(UserProfile, related_name='selected_books', on_delete=models.CASCADE)
    book_id = models.CharField(max_length=255, default='some_default_value')

    def __str__(self):
        return f"SelectedBook {self.id} by {self.user_profile.user.username}"

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
