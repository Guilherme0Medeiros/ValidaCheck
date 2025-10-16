from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Categoria(models.Model):
    nome = models.CharField("Nome", max_length=100, unique=True)
    limite_horas = models.PositiveIntegerField("Limite de horas", default=0)
    regras = models.JSONField("Regras", blank=True, null=True)

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorias"


class Atividade(models.Model):
    class Status(models.TextChoices):
        RASCUNHO = "Rascunho", "Rascunho"
        ENVIADO = "Enviado", "Enviado"
        EM_ANALISE = "Em análise", "Em análise"
        APROVADO = "Aprovado", "Aprovado"
        APROVADO_AJUSTE = "Aprovado com ajuste", "Aprovado com ajuste"
        INDEFERIDO = "Indeferido", "Indeferido"
        COMPLEMENTACAO_SOLICITADA = "Complementação solicitada", "Complementação solicitada"
        COMPUTADO = "Computado", "Computado"

    titulo = models.CharField("Título", max_length=255)
    categoria = models.CharField("Categoria", max_length=100)
    descricao = models.TextField("Descrição", blank=True, null=True)
    local = models.CharField("Local", max_length=255, blank=True, null=True)

    data_inicio = models.DateField("Data de início", blank=True, null=True)
    data_fim = models.DateField("Data de término", blank=True, null=True)

    horas_solicitadas = models.PositiveIntegerField("Horas solicitadas", default=0)
    horas_concedidas = models.PositiveIntegerField("Horas concedidas", blank=True, null=True)

    documentos = models.JSONField("Documentos", blank=True, null=True)
    checklist = models.JSONField("Checklist", blank=True, null=True)
    justificativa = models.TextField("Justificativa", blank=True, null=True)

    enviado_por = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="atividades", null=True, blank=True, verbose_name="Enviado por"
    )

    status = models.CharField("Status", max_length=50, choices=Status.choices, default=Status.ENVIADO)

    criado_em = models.DateTimeField("Criado em", auto_now_add=True)
    atualizado_em = models.DateTimeField("Atualizado em", auto_now=True)

    def aprovar(self, aprovado_por=None, horas_concedidas=None):
        if horas_concedidas is None or horas_concedidas == self.horas_solicitadas:
            self.status = self.Status.APROVADO
            self.horas_concedidas = self.horas_solicitadas
        else:
            self.status = self.Status.APROVADO_AJUSTE
            self.horas_concedidas = horas_concedidas
        self.save()

    def indeferir(self, justificativa=None):
        self.status = self.Status.INDEFERIDO
        if justificativa:
            self.justificativa = justificativa
        self.save()

    def solicitar_complementacao(self, checklist=None):
        self.status = self.Status.COMPLEMENTACAO_SOLICITADA
        if checklist:
            self.checklist = checklist
        self.save()

    def __str__(self):
        return f"{self.titulo} - {self.status}"

    class Meta:
        verbose_name = "Atividade"
        verbose_name_plural = "Atividades"
