from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, ReviewViewSet, VoteViewSet, UserViewSet
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'books/(?P<book_pk>\d+)/reviews', ReviewViewSet, basename='book-reviews')
router.register(r'votes', VoteViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserViewSet.as_view({'post': 'register'})),
    path('login/', UserViewSet.as_view({'post': 'login'})),
    path('user-profile/', UserViewSet.as_view({'get': 'profile'})),
    path('user-books/', UserViewSet.as_view({'get': 'user_books'})),
    path('reviews/<int:pk>/vote/', ReviewViewSet.as_view({'post': 'vote'})),
    path('reviews/<int:pk>/upload-image/', ReviewViewSet.as_view({'post': 'upload_image'})),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
