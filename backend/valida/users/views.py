from django.views.decorators.csrf import csrf_exempt
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.http import JsonResponse
from django.utils.encoding import force_str
from django.contrib.auth import get_user_model
import json

User = get_user_model()
token_generator = PasswordResetTokenGenerator()

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
