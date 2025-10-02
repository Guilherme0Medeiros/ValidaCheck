from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    limit_hours = models.PositiveIntegerField(default=0)
    rules = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.name


class Activity(models.Model):
    class Status(models.TextChoices):
        DRAFT = "Rascunho", "Rascunho"
        SENT = "Enviado", "Enviado"
        UNDER_REVIEW = "Em análise", "Em análise"
        APPROVED = "Aprovado", "Aprovado"
        APPROVED_ADJUSTED = "Aprovado com ajuste", "Aprovado com ajuste"
        REJECTED = "Indeferido", "Indeferido"
        COMPLEMENT_REQUESTED = "Complementação solicitada", "Complementação solicitada"
        COMPUTED = "Computado", "Computado"

    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)  # nos testes category = "Extensão", "Pesquisa"
    description = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)

    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)

    hours_requested = models.PositiveIntegerField(default=0)
    hours_granted = models.PositiveIntegerField(blank=True, null=True)

    documents = models.JSONField(blank=True, null=True)  # lista de arquivos
    checklist = models.JSONField(blank=True, null=True)  # usado quando coordenação pede complementação
    reason = models.TextField(blank=True, null=True)     # usado quando rejeita

    submitted_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="activities", null=True, blank=True
    )

    status = models.CharField(
        max_length=50, choices=Status.choices, default=Status.SENT
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def approve(self, approved_by=None, hours_granted=None):
        if hours_granted is None or hours_granted == self.hours_requested:
            self.status = self.Status.APPROVED
            self.hours_granted = self.hours_requested
        else:
            self.status = self.Status.APPROVED_ADJUSTED
            self.hours_granted = hours_granted
        self.save()

    def reject(self, reason=None):
        self.status = self.Status.REJECTED
        if reason:
            self.reason = reason
        self.save()

    def request_complement(self, checklist=None):
        self.status = self.Status.COMPLEMENT_REQUESTED
        if checklist:
            self.checklist = checklist
        self.save()

    def __str__(self):
        return f"{self.title} - {self.status}"
