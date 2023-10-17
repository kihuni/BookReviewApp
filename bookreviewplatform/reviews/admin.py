from django.contrib import admin
from .models import Book, Review, Vote

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'author', 'published_date']
    search_fields = ['title', 'author']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['book', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']

@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ['review', 'user', 'value', 'casted_at']

# For local dev

# list_display defines which fields of the model will be displayed in the list view.
# search_fields adds a search bar to the top of the model's list view and specifies which fields
# will be searched.
# list_filter adds a sidebar allowing filtering based on the specified fields.

