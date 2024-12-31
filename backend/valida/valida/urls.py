from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from users.api.v1.views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    UserRegisterView,
)
from rest_framework import routers
from users.api.v1.views import UserViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/v1/", include("activities.api.v1.router")),
    path("api/v1/", include(router.urls)),

    path("api/v1/auth/register/", UserRegisterView.as_view(), name="register"),
    path("api/v1/auth/login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/v1/auth/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),

    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
