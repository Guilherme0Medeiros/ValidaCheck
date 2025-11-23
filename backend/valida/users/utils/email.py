from django.conf import settings
from django.core.mail import send_mail
from .tokens import generate_email_verification_token
import base64

def send_verification_email(user):
    # gera o token JWT normal
    token = generate_email_verification_token(user.id)

    # transforma em URL-safe para não quebrar a URL
    token_safe = base64.urlsafe_b64encode(token.encode()).decode().rstrip("=")

    # Montar link que vai para o endpoint Django
    verify_link = f"{settings.BACKEND_URL.rstrip('/')}/api/v1/users/verify-email/?token={token_safe}"

    subject = "Confirme seu email"
    message = (
        f"Olá {user.username},\n\n"
        "Clique no link abaixo para verificar seu e-mail:\n\n"
        f"{verify_link}\n\n"
        "Se você não solicitou, ignore esta mensagem.\n"
    )

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
