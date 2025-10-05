from rest_framework import serializers
from activities.models import Category, Activity


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "limit_hours", "rules"]


class ActivitySerializer(serializers.ModelSerializer):
    submitted_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Activity
        fields = [
            "id",
            "title",
            "category",
            "description",
            "location",
            "start_date",
            "end_date",
            "hours_requested",
            "hours_granted",
            "documents",
            "checklist",
            "reason",
            "submitted_by",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["submitted_by", "created_at", "updated_at", "hours_granted", "status"]

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["submitted_by"] = user
        return super().create(validated_data)
