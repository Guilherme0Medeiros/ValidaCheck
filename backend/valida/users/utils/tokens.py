import jwt 
from jwt import ExpiredSignatureError
from django.utils import timezone
from datetime import timedelta
from django.conf import settings

def generate_email_verification_token(user_id: int) -> str:
    exp = timezone.now() + timedelta(minutes=getattr(settings, "EMAIL_VERIFICATION_TOKEN_EXP_MINUTES", 60*24))
    payload = {
        "user_id": user_id,
        "type": "email_verification",
        "exp": exp,
    }
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    # pyjwt >= 2 retorna str
    if isinstance(token, bytes):
        token = token.decode()
    return token

def decode_email_verification_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except ExpiredSignatureError:
        raise ExpiredSignatureError("Verification token expired")

    # Verifica tipo do token
    if payload.get("type") != "email_verification":
        raise jwt.InvalidTokenError("Invalid token type")

    return payload
