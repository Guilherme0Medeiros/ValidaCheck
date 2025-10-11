from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

# Register your models here.
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("username", "email", "role", "is_staff", "is_active")
    list_filter = ("role", "is_staff", "is_active")
    search_fields = ("username", "email")
    ordering = ("username",)
    fieldsets = (
        (None, {'fields': ("username", "password")}),
        ("Informações pessoais", {"fields": ("email", "first_name", "last_name")}),
        ("Permissões", {"fields": ("role", "is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Datas impostantes", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wine", ),
            "fields": ("username", "email", "password1", "password2", "role", "is_active", "is_staff"),
        }),
    )
