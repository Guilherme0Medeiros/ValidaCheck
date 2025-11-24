from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.exceptions import ValidationError

User = get_user_model()

# modelo de Categoria
class Categoria(models.Model):
    nome = models.CharField("Nome", max_length=100, unique=True)
    limite_horas = models.PositiveIntegerField("Limite de horas", default=0)
    obrigatoriedade = models.BooleanField("Obrigatoriedade", default=False)
    data_limite = models.DateField("Data limite", null=True, blank=True)
    periodo = models.CharField("Período", max_length=50, blank=True)
    regras = models.JSONField("Regras", blank=True, null=True)

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorias"

# modelo de Atividade
class Atividade(models.Model):
    class Status(models.TextChoices):
        RASCUNHO = "Rascunho", "Rascunho"
        ENVIADO = "Enviado", "Enviado"
        EM_ANALISE = "Em análise", "Em análise"
        COMPLEMENTACAO_SOLICITADA = "Complementação solicitada", "Complementação solicitada"
        APROVADO = "Aprovado", "Aprovado"
        APROVADO_AJUSTE = "Aprovado com ajuste", "Aprovado com ajuste"
        INDEFERIDO = "Indeferido", "Indeferido"
        COMPUTADO = "Computado", "Computado"

    titulo = models.CharField("Título", max_length=255)
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,
        related_name="atividades",
        verbose_name="Categoria"
    )
    descricao = models.TextField("Descrição", blank=True, null=True)
    local = models.CharField("Local", max_length=255, blank=True, null=True)
    data_inicio = models.DateField("Data de início", blank=True, null=True)
    data_fim = models.DateField("Data de término", blank=True, null=True)
    horas_solicitadas = models.PositiveIntegerField("Horas solicitadas", default=0)
    horas_concedidas = models.PositiveIntegerField("Horas concedidas", blank=True, null=True)
    vinculo = models.CharField("Vínculo (projeto/evento)", max_length=255, blank=True)
    contato = models.CharField("Contato responsável", max_length=255, blank=True)
    observacoes = models.TextField("Observações", blank=True)
    justificativa = models.TextField("Justificativa", blank=True, null=True)
    checklist = models.JSONField("Checklist de complementação", blank=True, null=True)

    enviado_por = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="atividades",
        null=True,
        blank=True,
        verbose_name="Enviado por"
    )
    avaliado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="atividades_avaliadas",
        verbose_name="Avaliado por"
    )

    status = models.CharField(
        "Status", max_length=50,
        choices=Status.choices,
        default=Status.RASCUNHO
    )

    criado_em = models.DateTimeField("Criado em", auto_now_add=True)
    atualizado_em = models.DateTimeField("Atualizado em", auto_now=True)

    #cria um registro de histórico sempre que o status muda
    def registrar_historico(self, usuario, status_novo, comentario=""):
        AtividadeHistorico.objects.create(
            atividade=self,
            status_anterior=self.status,
            status_novo=status_novo,
            usuario=usuario,
            comentario=comentario,
        )

    def aprovar(self, aprovado_por=None, horas_concedidas=None):
        status_anterior = self.status
        if horas_concedidas is None or horas_concedidas == self.horas_solicitadas:
            self.status = self.Status.APROVADO
            self.horas_concedidas = self.horas_solicitadas
        else:
            self.status = self.Status.APROVADO_AJUSTE
            self.horas_concedidas = horas_concedidas

        self.avaliado_por = aprovado_por
        self.save()
        self.registrar_historico(aprovado_por, self.status, "Atividade aprovada")

    def indeferir(self, indeferido_por=None, justificativa=None):
        self.status = self.Status.INDEFERIDO
        if justificativa:
            self.justificativa = justificativa
        self.avaliado_por = indeferido_por
        self.save()
        self.registrar_historico(indeferido_por, self.status, "Atividade indeferida")

    def solicitar_complementacao(self, solicitado_por=None, checklist=None):
        self.status = self.Status.COMPLEMENTACAO_SOLICITADA
        if checklist:
            self.checklist = checklist
        self.avaliado_por = solicitado_por
        self.save()
        self.registrar_historico(solicitado_por, self.status, "Complementação solicitada")

    def __str__(self):
        return f"{self.titulo} - {self.status}"

    class Meta:
        verbose_name = "Atividade"
        verbose_name_plural = "Atividades"



class AtividadeArquivo(models.Model):
    atividade = models.ForeignKey(Atividade, on_delete=models.CASCADE, related_name='arquivos')
    arquivo = models.FileField("Arquivo", upload_to='atividades/arquivos/')

    class Meta:
        verbose_name = "Arquivo de Atividade"
        verbose_name_plural = "Arquivos de Atividades"


class AtividadeHistorico(models.Model):
    atividade = models.ForeignKey(Atividade, on_delete=models.CASCADE, related_name='historico')
    status_anterior = models.CharField("Status Anterior", max_length=50)
    status_novo = models.CharField("Status Novo", max_length=50)
    timestamp = models.DateTimeField("Timestamp", auto_now_add=True)
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    comentario = models.TextField("Comentário", blank=True)

    class Meta:
        verbose_name = "Histórico de Atividade"
        verbose_name_plural = "Históricos de Atividades"
        ordering = ["-timestamp"]


class AtividadeComentario(models.Model):
    atividade = models.ForeignKey(Atividade, on_delete=models.CASCADE, related_name='comentarios')
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    mensagem = models.TextField("Mensagem")
    timestamp = models.DateTimeField("Timestamp", auto_now_add=True)

    class Meta:
        verbose_name = "Comentário de Atividade"
        verbose_name_plural = "Comentários de Atividades"
        ordering = ["-timestamp"]

# modelo de Auditoria
class LogAuditoria(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    acao = models.CharField("Ação", max_length=255)
    antes = models.TextField("Antes", blank=True)
    depois = models.TextField("Depois", blank=True)
    timestamp = models.DateTimeField("Timestamp", auto_now_add=True)

    class Meta:
        verbose_name = "Log de Auditoria"
        verbose_name_plural = "Logs de Auditoria"
        ordering = ["-timestamp"]


class ConfiguracoesInstituicao(models.Model):
    carga_minima = models.PositiveIntegerField("Carga mínima total", default=200)
    periodo_maximo = models.PositiveIntegerField("Período máximo", default=12)

    class Meta:
        verbose_name = "Configuração da Instituição"
        verbose_name_plural = "Configurações da Instituição"


# modelo de Notificação
class Notificacao(models.Model):
    class Tipo(models.TextChoices):
        NOVA_ATIVIDADE = "nova_atividade", "Nova atividade enviada"
        COMPLEMENTACAO_SOLICITADA = "complementacao_solicitada", "Complementação solicitada"
        DECISAO = "decisao", "Decisão sobre atividade"
        META_ATINGIDA = "meta_atingida", "Meta de horas atingida"
        NOVO_RELATORIO = "novo_relatorio", "Novo relatório enviado"

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notificacoes", verbose_name="Usuário")
    titulo = models.CharField("Título", max_length=255)
    mensagem = models.TextField("Mensagem")
    tipo = models.CharField("Tipo", max_length=50, choices=Tipo.choices)
    lida = models.BooleanField("Lida", default=False)
    criada_em = models.DateTimeField("Criada em", default=timezone.now)

    def marcar_como_lida(self):
        self.lida = True
        self.save(update_fields=["lida"])

    def __str__(self):
        return f"{self.usuario} - {self.titulo}"

    class Meta:
        verbose_name = "Notificação"
        verbose_name_plural = "Notificações"
        ordering = ["-criada_em"]



class Relatorio(models.Model):
    class Status(models.TextChoices):
        ENVIADO = "Enviado", "Enviado"
        EM_ANALISE = "Em análise", "Em análise"
        COMPLEMENTACAO_SOLICITADA = "Complementação solicitada", "Complementação solicitada"
        APROVADO = "Aprovado", "Aprovado"
        APROVADO_AJUSTE = "Aprovado com ajuste", "Aprovado com ajuste"
        INDEFERIDO = "Indeferido", "Indeferido"
        COMPUTADO = "Computado", "Computado"

    atividade = models.ForeignKey(
        Atividade,
        on_delete=models.PROTECT,
        related_name="relatorios",
        verbose_name="Atividade vinculada"
    )
    titulo = models.CharField("Título", max_length=255)
    descricao = models.TextField("Descrição", blank=True, null=True)
    arquivo = models.FileField("Arquivo", upload_to="relatorios/%Y/%m/")
    enviado_por = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="relatorios",
        verbose_name="Enviado por"
    )
    avaliado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="relatorios_avaliados",
        verbose_name="Avaliado por"
    )
    status = models.CharField(
        "Status",
        max_length=50,
        choices=Status.choices,
        default=Status.ENVIADO
    )
    criado_em = models.DateTimeField("Criado em", auto_now_add=True)
    atualizado_em = models.DateTimeField("Atualizado em", auto_now=True)
    justificativa = models.TextField("Justificativa (quando indeferido)", blank=True, null=True)
    checklist = models.JSONField("Checklist de complementação", blank=True, null=True)

    def clean(self):
        # só permite enviar relatório para atividades aprovadas
        if self.atividade.status not in [
            Atividade.Status.APROVADO,
            Atividade.Status.APROVADO_AJUSTE,
            Atividade.Status.COMPUTADO,
        ]:
            raise ValidationError("Relatórios só podem ser enviados para atividades aprovadas.")

        # dono da atividade = dono do relatório
        if self.enviado_por_id and self.atividade.enviado_por_id and self.enviado_por_id != self.atividade.enviado_por_id:
            raise ValidationError("Você só pode enviar relatório para atividades que são suas.")

    # Registrar histórico
    def registrar_historico(self, usuario, status_novo, comentario=""):
        RelatorioHistorico.objects.create(
            relatorio=self,
            status_anterior=self.status,
            status_novo=status_novo,
            usuario=usuario,
            comentario=comentario,
        )

    # NOVO: método único para decisões
    def tomar_decisao(self, usuario, novo_status, comentario="", justificativa="", checklist=None):
        """
        Aplica qualquer decisão do admin em um único método.
        """

        if novo_status == self.Status.APROVADO:
            self.status = self.Status.APROVADO
            self.justificativa = None
            self.checklist = None

        elif novo_status == self.Status.APROVADO_AJUSTE:
            self.status = self.Status.APROVADO_AJUSTE
            self.justificativa = None
            self.checklist = None

        elif novo_status == self.Status.INDEFERIDO:
            self.status = self.Status.INDEFERIDO
            self.justificativa = justificativa
            self.checklist = None

        elif novo_status == self.Status.COMPLEMENTACAO_SOLICITADA:
            self.status = self.Status.COMPLEMENTACAO_SOLICITADA
            self.justificativa = None
            self.checklist = checklist

        else:
            raise ValidationError("Status inválido para decisão.")

        self.avaliado_por = usuario
        self.save()

        # registrar histórico
        self.registrar_historico(usuario, self.status, comentario or justificativa)

    def __str__(self):
        return f"Relatório: {self.titulo} — {self.atividade.titulo}"


class RelatorioHistorico(models.Model):
    relatorio = models.ForeignKey(Relatorio, on_delete=models.CASCADE, related_name='historico')
    status_anterior = models.CharField("Status Anterior", max_length=50)
    status_novo = models.CharField("Status Novo", max_length=50)
    timestamp = models.DateTimeField("Timestamp", auto_now_add=True)
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    comentario = models.TextField("Comentário", blank=True)

    class Meta:
        verbose_name = "Histórico de Relatório"
        verbose_name_plural = "Históricos de Relatórios"
        ordering = ["-timestamp"]


class RelatorioComentario(models.Model):
    relatorio = models.ForeignKey(Relatorio, on_delete=models.CASCADE, related_name='comentarios')
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    mensagem = models.TextField("Mensagem")
    timestamp = models.DateTimeField("Timestamp", auto_now_add=True)

    class Meta:
        verbose_name = "Comentário de Relatório"
        verbose_name_plural = "Comentários de Relatórios"
        ordering = ["-timestamp"]