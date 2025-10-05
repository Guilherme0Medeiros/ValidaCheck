from django.contrib import admin
from .models import Category, Activity


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "limit_hours")
    search_fields = ("name",)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "status", "submitted_by", "created_at")
    list_filter = ("status", "category")
    search_fields = ("title", "description", "category", "submitted_by__username")
