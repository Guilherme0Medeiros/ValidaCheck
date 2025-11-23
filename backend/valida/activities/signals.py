from django.db.models.signals import post_save
from django.dispatch import receiver
from activities.models import Atividade, Notificacao, Relatorio


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
@receiver(post_save, sender=Relatorio)
def criar_notificacao_relatorio(sender, instance: Relatorio, created, **kwargs):
    # Novo relatório enviado
    if created:
        Notificacao.objects.create(
            usuario=instance.enviado_por,
            titulo="Relatório enviado com sucesso",
            mensagem=f"Seu relatório '{instance.titulo}' para a atividade '{instance.atividade.titulo}' foi enviado e aguarda análise.",
            tipo=Notificacao.Tipo.NOVO_RELATORIO,
        )
    else:
        # Decisões/complementações
        if instance.status == Relatorio.Status.COMPLEMENTACAO_SOLICITADA:
            Notificacao.objects.create(
                usuario=instance.enviado_por,
                titulo="Complementação solicitada no relatório",
                mensagem=f"Seu relatório '{instance.titulo}' requer complementação.",
                tipo=Notificacao.Tipo.COMPLEMENTACAO_SOLICITADA,
            )
        elif instance.status in [
            Relatorio.Status.APROVADO,
            Relatorio.Status.APROVADO_AJUSTE,
            Relatorio.Status.INDEFERIDO,
        ]:
            Notificacao.objects.create(
                usuario=instance.enviado_por,
                titulo="Decisão registrada no relatório",
                mensagem=f"Seu relatório '{instance.titulo}' foi {instance.status.lower()}.",
                tipo=Notificacao.Tipo.DECISAO,
            )