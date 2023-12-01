from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def add_selected_book(self, book_id):
        if not self.selected_books.filter(book__id=book_id).exists():
            selected_book = SelectedBook.objects.create(user_profile=self, book_id=book_id)
            self.selected_books.add(selected_book)

    def get_selected_books_by_title(self, title):
        return self.selected_books.filter(book__title__icontains=title)

    def get_selected_books_by_author(self, author):
        return self.selected_books.filter(book__author__icontains=author)

    def get_selected_books_by_details(self, details):
        return self.selected_books.filter(book__description__icontains=details)

class SelectedBook(models.Model):
    user_profile = models.ForeignKey(UserProfile, related_name='selected_books', on_delete=models.CASCADE)
    book_id = models.CharField(max_length=255, default='some_default_value')

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField()
    cover_image = models.ImageField(upload_to='books/covers/', null=True, blank=True)
    published_date = models.DateField(null=True, blank=True)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
