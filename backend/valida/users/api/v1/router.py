from django.urls import path
from rest_framework.routers import DefaultRouter
from .viewsets import (
    UserViewSet, 
    CustomTokenObtainPairView, 
    CustomTokenRefreshView,
    UserRegisterView
)

router = DefaultRouter()
router.register(r'', UserViewSet, basename='users')

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', UserRegisterView.as_view(), name='user_register')
]

urlpatterns += router.urls