from rest_framework import viewsets, permissions, generics
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.models import User
from .serializers import CustomTokenObtainPairSerializer, UserSerializer, UserRegisterSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CustomTokenRefreshView(TokenRefreshView):
    pass

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = []
    
    def create(self, request, *args, **kwargs):
        print("Dados recebidos no back", request.data)
        return super().create(request, *args, **kwargs)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
