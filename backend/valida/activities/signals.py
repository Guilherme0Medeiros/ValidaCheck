from django.db.models.signals import post_save
from django.dispatch import receiver
from activities.models import Atividade, Notificacao


@receiver(post_save, sender=Atividade)
def criar_notificacao_atividade(sender, instance, created, **kwargs):
    if created:
        Notificacao.objects.create(
            usuario=instance.enviado_por,
            titulo="Atividade enviada com sucesso",
            mensagem=f"Sua atividade '{instance.titulo}' foi registrada e está aguardando análise.",
            tipo=Notificacao.Tipo.NOVA_ATIVIDADE,
        )
    else:
        if instance.status == Atividade.Status.COMPLEMENTACAO_SOLICITADA:
            Notificacao.objects.create(
                usuario=instance.enviado_por,
                titulo="Complementação solicitada",
                mensagem=f"Sua atividade '{instance.titulo}' requer complementação.",
                tipo=Notificacao.Tipo.COMPLEMENTACAO_SOLICITADA,
            )
        elif instance.status in [
            Atividade.Status.APROVADO,
            Atividade.Status.APROVADO_AJUSTE,
            Atividade.Status.INDEFERIDO,
        ]:
            Notificacao.objects.create(
                usuario=instance.enviado_por,
                titulo="Decisão registrada",
                mensagem=f"Sua atividade '{instance.titulo}' foi {instance.status.lower()}.",
                tipo=Notificacao.Tipo.DECISAO,
            )
