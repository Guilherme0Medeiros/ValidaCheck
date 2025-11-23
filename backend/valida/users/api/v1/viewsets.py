from rest_framework import viewsets, permissions, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.utils.email import send_verification_email
from django.shortcuts import redirect
from users.utils.tokens import decode_email_verification_token
import base64
import jwt
from django.conf import settings
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
    
    def perform_create(self, serializer):
        # Salva usuário
        user = serializer.save()

        # Envia o e-mail
        send_verification_email(user)

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
    permission_classes = []

    def get(self, request):
        # pega o token da query string
        token = request.GET.get("token")
        if not token:
            return redirect(f"{settings.FRONTEND_URL.rstrip('/')}/email-verified?status=invalid")

        try:
            # adiciona padding de volta
            padding = 4 - (len(token) % 4)
            if padding != 4:
                token += "=" * padding

            # decodifica o token
            token_decoded = base64.urlsafe_b64decode(token.encode()).decode()
            payload = decode_email_verification_token(token_decoded)
            user_id = payload.get("user_id")

            user = User.objects.filter(id=user_id).first()
            if not user:
                return redirect(f"{settings.FRONTEND_URL.rstrip('/')}/verificar-email?status=invalid")

            if user.is_verified:
                return redirect(f"{settings.FRONTEND_URL.rstrip('/')}/verificar-email?status=already")

            # marca como verificado
            user.is_verified = True
            user.save(update_fields=["is_verified"])

            return redirect(f"{settings.FRONTEND_URL.rstrip('/')}/verificar-email?status=success")

        except jwt.ExpiredSignatureError:
            return redirect(f"{settings.FRONTEND_URL.rstrip('/')}/verificar-email?status=expired")

        except jwt.InvalidTokenError:
            return redirect(f"{settings.FRONTEND_URL.rstrip('/')}/verificar-email?status=invalid")

        except Exception:
            return redirect(f"{settings.FRONTEND_URL.rstrip('/')}/verificar-email?status=error")