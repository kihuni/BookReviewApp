from django.contrib import admin
from .models import Book

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'published_date']
    search_fields = ['title', 'author']

# For local dev

# list_display defines which fields of the model will be displayed in the list view.
# search_fields adds a search bar to the top of the model's list view and specifies which fields
# will be searched.
# list_filter adds a sidebar allowing filtering based on the specified fields.

