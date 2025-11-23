from rest_framework import viewsets, permissions, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from users.models import User
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer,
    UserRegisterSerializer,
    ChangePasswordSerializer,
)

from django.views.decorators.csrf import csrf_exempt
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.http import JsonResponse
from django.utils.encoding import force_str
import json

token_generator = PasswordResetTokenGenerator()


# LOGIN
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    pass


# REGISTRO
class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = []

    def create(self, request, *args, **kwargs):
        print("Dados recebidos no backend:", request.data)
        return super().create(request, *args, **kwargs)


# CRUD + TROCA DE SENHA
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, 
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)

        user = request.user
        user.set_password(serializer.validated_data['new_password1'])
        user.save()

        return Response({"detail": "Senha atualizada com sucesso."}, status=status.HTTP_200_OK)


# RESET DE SENHA CONFIRMAR
@csrf_exempt
def password_reset_confirm(request):
    """
    POST { uid, token, new_password }
    """
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body)
        uidb64 = data.get("uid")
        token = data.get("token")
        new_password = data.get("new_password")
    except Exception:
        return JsonResponse({"detail": "Invalid data"}, status=400)

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except Exception:
        return JsonResponse({"detail": "Invalid uid"}, status=400)

    if not token_generator.check_token(user, token):
        return JsonResponse({"detail": "Invalid or expired token"}, status=400)

    user.set_password(new_password)
    user.save()
    return JsonResponse({"detail": "Password reset successful"})


# SOCIAL LOGIN → JWT
class SocialLoginJWTView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "role": user.role
        })
