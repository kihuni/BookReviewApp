from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, UserProfileViewSet, UserViewSet
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'user-profile', UserProfileViewSet, basename='user_profile')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserViewSet.as_view({'post': 'register'})),
    path('login/', UserViewSet.as_view({'post': 'login'})),
    path('user-profile/<int:pk>/', UserViewSet.as_view({'get': 'user_profile'}), name='user-profile-detail'),
    path('user-books/', UserViewSet.as_view({'get': 'user_books'})),
    path('books/search/', BookViewSet.as_view({'get': 'search'}), name='book-search'),
    path('books/<int:pk>/recommendations/', BookViewSet.as_view({'get': 'recommendations'}), name='book-recommendations'),
]

# Add static URLs for media files in DEBUG mode
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
