from rest_framework import serializers
from activities.models import (
    Categoria, Atividade, AtividadeArquivo, AtividadeHistorico, AtividadeComentario,
    LogAuditoria, ConfiguracoesInstituicao, Notificacao
)


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ["id", "nome", "limite_horas", "obrigatoriedade", "data_limite", "periodo", "regras"]


class AtividadeArquivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AtividadeArquivo
        fields = ["id", "arquivo"]


class AtividadeSerializer(serializers.ModelSerializer):
    enviado_por = serializers.StringRelatedField(read_only=True)
    arquivos = AtividadeArquivoSerializer(many=True, read_only=True)
    novos_arquivos = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Atividade
        fields = [
            "id", "titulo", "categoria", "descricao", "local", "data_inicio", "data_fim",
            "horas_solicitadas", "horas_concedidas", "vinculo", "contato", "observacoes",
            "justificativa", "enviado_por", "status", "criado_em", "atualizado_em",
            "arquivos", "novos_arquivos"
        ]
        read_only_fields = ["enviado_por", "criado_em", "atualizado_em", "horas_concedidas", "status"]

    def create(self, validated_data):
        arquivos = validated_data.pop("novos_arquivos", [])
        user = self.context["request"].user
        validated_data["enviado_por"] = user
        atividade = Atividade.objects.create(**validated_data)
        for arquivo in arquivos:
            AtividadeArquivo.objects.create(atividade=atividade, arquivo=arquivo)
        return atividade


class AtividadeHistoricoSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField()

    class Meta:
        model = AtividadeHistorico
        fields = '__all__'


class AtividadeComentarioSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = AtividadeComentario
        fields = '__all__'


class LogAuditoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogAuditoria
        fields = '__all__'


class ProgressoSerializer(serializers.Serializer):
    total_horas = serializers.FloatField()
    percentual = serializers.FloatField()
    por_categoria = serializers.DictField()


class DecisaoSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Atividade.Status.choices)
    horas_concedidas = serializers.IntegerField(required=False)
    comentario = serializers.CharField(required=False)
    justificativa = serializers.CharField(required=False)
    checklist = serializers.JSONField(required=False)


class NotificacaoSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Notificacao
        fields = ["id", "usuario", "titulo", "mensagem", "tipo", "lida", "criada_em"]
        read_only_fields = ["usuario", "criada_em"]
