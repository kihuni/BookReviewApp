from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, ReadingChallengeViewSet, ReviewViewSet, UserProfileViewSet, VoteViewSet, UserViewSet
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'books/(?P<book_pk>\d+)/reviews', ReviewViewSet, basename='book-reviews')
router.register(r'votes', VoteViewSet)
router.register(r'user-profile', UserProfileViewSet, basename='user_profile')
router.register(r'user-profile/(?P<user_pk>\d+)/selected_books', UserProfileViewSet, basename='user_profile_selected_books')
router.register(r'reading-challenge', ReadingChallengeViewSet, basename='reading-challenge')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserViewSet.as_view({'post': 'register'})),
    path('login/', UserViewSet.as_view({'post': 'login'})),
    path('user-profile/<int:pk>/', UserViewSet.as_view({'get': 'user_profile'}), name='user-profile-detail'),
    path('user-books/', UserViewSet.as_view({'get': 'user_books'})),
    path('reviews/<int:pk>/vote/', ReviewViewSet.as_view({'post': 'vote'})),
    path('reviews/<int:pk>/upload-image/', ReviewViewSet.as_view({'post': 'upload_image'})),
    path('user/google-login/', UserViewSet.as_view({'post': 'google_login'}), name='google-login'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
