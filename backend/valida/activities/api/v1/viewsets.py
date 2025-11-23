from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Sum

from activities.models import (
    Categoria, Atividade, AtividadeHistorico, AtividadeComentario,
    LogAuditoria, ConfiguracoesInstituicao, Notificacao,
    Relatorio, RelatorioHistorico, RelatorioComentario
)

from activities.api.v1.serializers import (
    CategoriaSerializer, AtividadeSerializer, NotificacaoSerializer,
    ProgressoSerializer, DecisaoSerializer, AtividadeHistoricoSerializer,
    AtividadeComentarioSerializer,
    RelatorioSerializer, RelatorioHistoricoSerializer,
    RelatorioComentarioSerializer, DecisaoRelatorioSerializer
)

from activities.api.v1.permissions import (
    IsOwnerOrAdmin, IsStudent, IsSecretary, IsStudentOrSecretary
)

from activities.api.v1.filters import AtividadeFilter



class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all().order_by("nome")
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        return [IsSecretary()]



class AtividadeViewSet(viewsets.ModelViewSet):
    queryset = Atividade.objects.all().order_by("-criado_em")
    serializer_class = AtividadeSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    pagination_class = None  # remove paginação

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = AtividadeFilter
    search_fields = ["titulo", "descricao", "status"]
    ordering_fields = ["criado_em", "data_inicio", "data_fim"]

    def get_permissions(self):
        if self.action in ["create", "list_me", "progresso"]:
            return [IsStudent()]
        if self.action in ["review", "decisao", "reclassificar"]:
            return [IsSecretary()]
        if self.action in ["timeline"]:
            return [IsStudentOrSecretary()]
        if self.action == "retrieve":
            return [IsOwnerOrAdmin()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(enviado_por=self.request.user)

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Atividade.objects.none()

        if user.is_staff or getattr(user, "role", None) == "secretary":
            return Atividade.objects.all()

        return Atividade.objects.filter(enviado_por=user)

    # ---------------------------- LISTA DO ALUNO ---------------------------------------
    @action(detail=False, methods=["get"], url_path="me")
    def list_me(self, request):
        atividades = Atividade.objects.filter(enviado_por=request.user)
        return Response(self.get_serializer(atividades, many=True).data)

    # ---------------------------- PROGRESSO ---------------------------------------------
    @action(detail=False, methods=["get"], url_path="progresso")
    def progresso(self, request):
        atividades = Atividade.objects.filter(
            enviado_por=request.user,
            status__in=[
                Atividade.Status.APROVADO,
                Atividade.Status.APROVADO_AJUSTE,
                Atividade.Status.COMPUTADO
            ]
        )
        total_horas = atividades.aggregate(Sum("horas_concedidas"))["horas_concedidas__sum"] or 0
        por_categoria = atividades.values("categoria").annotate(total=Sum("horas_concedidas"))
        configuracoes = ConfiguracoesInstituicao.objects.first() or ConfiguracoesInstituicao()

        data = {
            "total_horas": total_horas,
            "percentual": (total_horas / configuracoes.carga_minima) * 100,
            "por_categoria": {i["categoria"]: i["total"] for i in por_categoria}
        }
        return Response(ProgressoSerializer(data).data)

    # ---------------------------- TIMELINE ----------------------------------------------
    @action(detail=True, methods=["get"], url_path="timeline")
    def timeline(self, request, pk=None):
        atividade = self.get_object()

        historico = AtividadeHistorico.objects.filter(atividade=atividade)
        comentarios = AtividadeComentario.objects.filter(atividade=atividade)

        return Response({
            "historico": AtividadeHistoricoSerializer(historico, many=True).data,
            "comentarios": AtividadeComentarioSerializer(comentarios, many=True).data,
        })

    # ---------------------------- REVISÃO (SECRETARIA) ----------------------------------
    @action(detail=False, methods=["get"], url_path="review")
    def review(self, request):
        atividades = Atividade.objects.filter(status__in=["Enviado", "Em análise"])
        return Response(self.get_serializer(atividades, many=True).data)

    # ---------------------------- DECISÃO ------------------------------------------------
    @action(detail=True, methods=["patch"], url_path="decisao")
    def decisao(self, request, pk=None):
        atividade = self.get_object()
        serializer = DecisaoSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        status_novo = serializer.validated_data["status"]
        comentario = serializer.validated_data.get("comentario", "")
        horas_concedidas = serializer.validated_data.get("horas_concedidas")
        justificativa = serializer.validated_data.get("justificativa", "")
        checklist = serializer.validated_data.get("checklist")

        # aplica decisão
        if status_novo in ["Aprovado", "Aprovado com ajuste"]:
            atividade.aprovar(aprovado_por=request.user, horas_concedidas=horas_concedidas)
        elif status_novo == "Indeferido":
            atividade.indeferir(indeferido_por=request.user, justificativa=justificativa)
        elif status_novo == "Complementação solicitada":
            atividade.solicitar_complementacao(solicitado_por=request.user, checklist=checklist)

        LogAuditoria.objects.create(
            usuario=request.user,
            acao=f"Decisão: {status_novo}",
            antes=atividade.status,
            depois=status_novo
        )

        return Response({"success": "Decisão aplicada"})

    # ---------------------------- RECLASSIFICAR ------------------------------------------
    @action(detail=True, methods=["patch"], url_path="reclassificar")
    def reclassificar(self, request, pk=None):
        atividade = self.get_object()
        categoria_id = request.data.get("categoria")

        if not categoria_id:
            return Response({"error": "Categoria requerida"}, status=400)

        try:
            nova_cat = Categoria.objects.get(pk=categoria_id)
        except Categoria.DoesNotExist:
            return Response({"error": "Categoria não encontrada"}, status=404)

        antes = str(atividade.categoria)
        atividade.categoria = nova_cat
        atividade.save()

        LogAuditoria.objects.create(
            usuario=request.user,
            acao="Reclassificação",
            antes=antes,
            depois=str(nova_cat)
        )

        return Response({"success": "Categoria reclassificada"})



class NotificacaoViewSet(viewsets.ModelViewSet):
    queryset = Notificacao.objects.all()
    serializer_class = NotificacaoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notificacao.objects.filter(usuario=self.request.user)

    @action(detail=False, methods=["post"])
    def marcar_todas_como_lidas(self, request):
        count = Notificacao.objects.filter(usuario=request.user, lida=False).update(lida=True)
        return Response({"mensagem": f"{count} notificações marcadas como lidas."})

    @action(detail=True, methods=["patch"], url_path="marcar-lida")
    def marcar_lida(self, request, pk=None):
        notificacao = self.get_object()
        notificacao.marcar_como_lida()
        return Response({"success": "Notificação marcada como lida"})



# RELATÓRIO
class RelatorioViewSet(viewsets.ModelViewSet):
    queryset = Relatorio.objects.all().order_by("-criado_em")
    serializer_class = RelatorioSerializer
    permission_classes = [IsStudentOrSecretary]

    def perform_create(self, serializer):
        serializer.save(enviado_por=self.request.user)

    def get_queryset(self):
        user = self.request.user

        if user.role == "secretary" or user.is_staff:
            return Relatorio.objects.all()

        return Relatorio.objects.filter(enviado_por=user)

    
    @action(detail=True, methods=["get"], url_path="timeline")
    def timeline(self, request, pk=None):
        relatorio = self.get_object()

        historico = RelatorioHistorico.objects.filter(relatorio=relatorio)
        comentarios = RelatorioComentario.objects.filter(relatorio=relatorio)

        return Response({
            "historico": RelatorioHistoricoSerializer(historico, many=True).data,
            "comentarios": RelatorioComentarioSerializer(comentarios, many=True).data,
        })

    
    @action(detail=True, methods=["patch"], url_path="decisao")
    def decisao(self, request, pk=None):
        relatorio = self.get_object()
        serializer = DecisaoRelatorioSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        novo_status = serializer.validated_data["status"]
        comentario = serializer.validated_data.get("comentario", "")
        justificativa = serializer.validated_data.get("justificativa", "")
        checklist = serializer.validated_data.get("checklist")

        relatorio.tomar_decisao(
            usuario=request.user,
            novo_status=novo_status,
            comentario=comentario,
            justificativa=justificativa,
            checklist=checklist
        )

        return Response({"success": "Decisão aplicada"})
