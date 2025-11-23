from rest_framework import serializers
from activities.models import (
    Categoria, Atividade, AtividadeArquivo, AtividadeHistorico,
    AtividadeComentario, LogAuditoria, ConfiguracoesInstituicao, Notificacao,
    Relatorio, RelatorioHistorico, RelatorioComentario
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
    categoria_nome = serializers.CharField(source='categoria.nome', read_only=True)

    class Meta:
        model = Atividade
        fields = [
            "id", "titulo", "categoria", "categoria_nome", "descricao", "local", "data_inicio", "data_fim",
            "horas_solicitadas", "horas_concedidas", "vinculo", "contato", "observacoes",
            "justificativa", "checklist", "enviado_por", "status", "criado_em", "atualizado_em",
            "arquivos", "novos_arquivos"
        ]
        read_only_fields = [
            "enviado_por", "criado_em", "atualizado_em", "horas_concedidas", 
            "categoria_nome", "justificativa", "checklist"
        ]

    def create(self, validated_data):
        arquivos = validated_data.pop("novos_arquivos", [])
        user = self.context["request"].user
        validated_data["enviado_por"] = user
        atividade = Atividade.objects.create(**validated_data)
        for arquivo in arquivos:
            AtividadeArquivo.objects.create(atividade=atividade, arquivo=arquivo)
        return atividade

    def update(self, instance, validated_data):
        arquivos = validated_data.pop("novos_arquivos", [])
        for arquivo in arquivos:
            AtividadeArquivo.objects.create(atividade=instance, arquivo=arquivo)
        if instance.status == 'Complementação solicitada' and validated_data.get('status') == 'Enviado':
            instance.status = 'Enviado'
            # Limpa o checklist de complementação antigo
            instance.checklist = None
            instance.justificativa = None # Limpa justificativa de indeferimento anterior, se houver
        return super().update(instance, validated_data)


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


class RelatorioSerializer(serializers.ModelSerializer):
    atividade_titulo = serializers.CharField(source="atividade.titulo", read_only=True)
    enviado_por_nome = serializers.SerializerMethodField()

    class Meta:
        model = Relatorio
        fields = [
            "id", "titulo", "descricao", "arquivo", "status",
            "atividade", "atividade_titulo",
            "enviado_por", "enviado_por_nome", "avaliado_por",
            "justificativa", "checklist",
            "criado_em", "atualizado_em",
        ]
        read_only_fields = ["status", "enviado_por", "avaliado_por", "criado_em", "atualizado_em"]

    def get_enviado_por_nome(self, obj):
        return getattr(obj.enviado_por, "username", None)

    def validate(self, attrs):
        request = self.context["request"]
        atividade = attrs.get("atividade") or getattr(self.instance, "atividade", None)

        if request.method == "POST":
            # aluno só pode enviar relatório para atividade dele
            if atividade and atividade.enviado_por_id != request.user.id and not request.user.is_staff:
                raise serializers.ValidationError("Você só pode enviar relatório para suas próprias atividades.")

            # atividade precisa estar aprovada
            if atividade and atividade.status not in [Atividade.Status.APROVADO, Atividade.Status.APROVADO_AJUSTE, Atividade.Status.COMPUTADO]:
                raise serializers.ValidationError("Relatórios só podem ser enviados para atividades aprovadas.")

        return attrs


class RelatorioHistoricoSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.SerializerMethodField()

    class Meta:
        model = RelatorioHistorico
        fields = ["id", "status_anterior", "status_novo", "timestamp", "usuario_nome", "comentario"]

    def get_usuario_nome(self, obj):
        return getattr(obj.usuario, "username", None)


class RelatorioComentarioSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.SerializerMethodField()

    class Meta:
        model = RelatorioComentario
        fields = ["id", "mensagem", "timestamp", "usuario_nome"]

    def get_usuario_nome(self, obj):
        return getattr(obj.usuario, "username", None)


class DecisaoRelatorioSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Relatorio.Status.choices)
    comentario = serializers.CharField(required=False, allow_blank=True)
    justificativa = serializers.CharField(required=False, allow_blank=True)
    checklist = serializers.JSONField(required=False)