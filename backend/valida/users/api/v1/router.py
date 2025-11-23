from django.urls import path
from rest_framework.routers import DefaultRouter
from users.views import password_reset_confirm
from .viewsets import (
    UserViewSet, 
    CustomTokenObtainPairView, 
    CustomTokenRefreshView,
    UserRegisterView,
    VerifyEmailView
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', UserRegisterView.as_view(), name='user_register'),
    path('verify-email/', VerifyEmailView.as_view(), name="verify-email"), 
    path("reset-password-confirm/", password_reset_confirm),
]

urlpatterns += router.urls