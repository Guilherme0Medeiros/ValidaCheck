from django_filters import rest_framework as filters
from activities.models import Atividade


class AtividadeFilter(filters.FilterSet):
    data_inicio = filters.DateFilter(field_name="data_inicio", lookup_expr="gte")
    data_fim = filters.DateFilter(field_name="data_fim", lookup_expr="lte")
    categoria = filters.CharFilter(field_name="categoria", lookup_expr="icontains")
    status = filters.CharFilter(field_name="status", lookup_expr="iexact")

    class Meta:
        model = Atividade
        fields = ["categoria", "status", "data_inicio", "data_fim"]
