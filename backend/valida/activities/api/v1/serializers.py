from rest_framework import serializers
from activities.models import Categoria, Atividade


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ["id", "nome", "limite_horas", "regras"]


class AtividadeSerializer(serializers.ModelSerializer):
    enviado_por = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Atividade
        fields = [
            "id",
            "titulo",
            "categoria",
            "descricao",
            "local",
            "data_inicio",
            "data_fim",
            "horas_solicitadas",
            "horas_concedidas",
            "documentos",
            "checklist",
            "justificativa",
            "enviado_por",
            "status",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = ["enviado_por", "criado_em", "atualizado_em", "horas_concedidas", "status"]

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["enviado_por"] = user
        return super().create(validated_data)
