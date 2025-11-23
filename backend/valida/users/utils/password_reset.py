from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings
from django.core.mail import send_mail
from django.urls import reverse

token_generator = PasswordResetTokenGenerator()

def send_password_reset_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = token_generator.make_token(user)
    # Link para frontend página que terá formulário para nova senha, e que chamará backend para confirmar/reset
    reset_link = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password?uid={uid}&token={token}"
    subject = "Recuperação de senha"
    message = f"Olá {user.username},\n\nUse o link abaixo para redefinir sua senha:\n\n{reset_link}\n\nSe você não solicitou, ignore."
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)
