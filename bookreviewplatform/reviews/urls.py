from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, UserProfileViewSet, UserViewSet
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions


schema_view = get_schema_view(
    openapi.Info(
        title="bookReviewApp",
        default_version='v1',
        description="Your API description",
        terms_of_service="https://www.yourapp.com/terms/",
        contact=openapi.Contact(email="contact@yourapp.com"),
        license=openapi.License(name="Your License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

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
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# Add static URLs for media files in DEBUG mode
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
