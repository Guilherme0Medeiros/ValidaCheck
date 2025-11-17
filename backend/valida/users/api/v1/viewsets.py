from rest_framework import viewsets, permissions, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import AccessToken
from users.models import User
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer,
    UserRegisterSerializer,
    ChangePasswordSerializer,
)

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

    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = request.user
        user.set_password(serializer.validated_data['new_password1'])
        user.save()
        return Response({"detail": "Senha atualizada com sucesso."}, status=status.HTTP_200_OK)

class VerifyEmailView(APIView):
    def get(self, request):
        token = request.query_params.get('token')

        try: 
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            user = User.objects.get(id=user_id)

            if user.is_verified:
                return Response({"detail": "E-mail já verificado."}, status=status.HTTP_200_OK)
            
            user.is_verified = True
            user.save()

            return Response({"detail": "E-mail verificado com sucesso!"}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"detail": "Token inválido ou expirado"}, status=status.HTTP_400_BAD_REQUEST)