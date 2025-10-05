from django_filters import rest_framework as filters
from activities.models import Activity


class ActivityFilter(filters.FilterSet):
    start_date = filters.DateFilter(field_name="start_date", lookup_expr="gte")
    end_date = filters.DateFilter(field_name="end_date", lookup_expr="lte")
    category = filters.CharFilter(field_name="category", lookup_expr="icontains")
    status = filters.CharFilter(field_name="status", lookup_expr="iexact")

    class Meta:
        model = Activity
        fields = ["category", "status", "start_date", "end_date"]
