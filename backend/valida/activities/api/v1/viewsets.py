from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Sum

from activities.models import Categoria, Atividade, Notificacao, AtividadeHistorico, LogAuditoria, ConfiguracoesInstituicao, AtividadeComentario
from activities.api.v1.serializers import (
    CategoriaSerializer, AtividadeSerializer, NotificacaoSerializer,
    ProgressoSerializer, DecisaoSerializer, AtividadeHistoricoSerializer, AtividadeComentarioSerializer
)
from activities.api.v1.permissions import IsOwnerOrAdmin, IsStudent, IsSecretary, IsStudentOrSecretary
from activities.api.v1.filters import AtividadeFilter


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all().order_by("nome")
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]  # alunos podem ler
        return [IsSecretary()]  # só secretaria edita


class AtividadeViewSet(viewsets.ModelViewSet):
    queryset = Atividade.objects.all().order_by("-criado_em")
    serializer_class = AtividadeSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin] 

    # CORREÇÃO: Desabilita a paginação
    pagination_class = None

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = AtividadeFilter
    search_fields = ["titulo", "descricao", "status"]
    ordering_fields = ["criado_em", "data_inicio", "data_fim"]

    def get_permissions(self):
        if self.action in ["create", "list_me", "progresso"]:
            return [IsStudent()]
        if self.action in ["review", "decisao", "reclassificar"]:
            return [IsSecretary()]
        if self.action == "timeline":
            # Permite que Alunos (para ver o seu) e Secretários (para decidir) vejam o histórico
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
        # Se for staff ou secretaria, mostra tudo
        if user.is_staff or getattr(user, "role", None) == "secretary":
            return Atividade.objects.all()
        # Senão, mostra apenas os do próprio usuário
        return Atividade.objects.filter(enviado_por=user)

    @action(detail=False, methods=["get"], url_path="me")
    def list_me(self, request):
        queryset = self.queryset.filter(enviado_por=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="progresso")
    def progresso(self, request):
        atividades = Atividade.objects.filter(
            enviado_por=request.user,
            status__in=["Aprovado", "Aprovado com ajuste", "Computado"]
        )
        total_horas = atividades.aggregate(Sum("horas_concedidas"))["horas_concedidas__sum"] or 0
        por_categoria = atividades.values("categoria").annotate(total=Sum("horas_concedidas"))
        configuracoes = ConfiguracoesInstituicao.objects.first() or ConfiguracoesInstituicao()
        percentual = (total_horas / configuracoes.carga_minima) * 100 if configuracoes.carga_minima else 0
        data = {
            "total_horas": total_horas,
            "percentual": percentual,
            "por_categoria": {item["categoria"]: item["total"] for item in por_categoria}
        }
        return Response(ProgressoSerializer(data).data)

    @action(detail=True, methods=["get"], url_path="timeline")
    def timeline(self, request, pk=None):
        # Esta ação agora é protegida pela permissão IsStudentOrSecretary
        atividade = self.get_object() # Adiciona verificação de permissão de objeto
        historico = AtividadeHistorico.objects.filter(atividade=atividade)
        comentarios = AtividadeComentario.objects.filter(atividade=atividade)
        return Response({
            "historico": AtividadeHistoricoSerializer(historico, many=True).data,
            "comentarios": AtividadeComentarioSerializer(comentarios, many=True).data,
        })

    @action(detail=False, methods=["get"], url_path="review")
    def review(self, request):
        queryset = self.queryset.filter(status__in=["Enviado", "Em análise"])
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["patch"], url_path="decisao")
    def decisao(self, request, pk=None):
        atividade = self.get_object()
        serializer = DecisaoSerializer(data=request.data)
        if serializer.is_valid():
            novo_status = serializer.validated_data["status"]
            comentario = serializer.validated_data.get("comentario", "")
            horas_concedidas = serializer.validated_data.get("horas_concedidas")
            justificativa = serializer.validated_data.get("justificativa", "")
            checklist = serializer.validated_data.get("checklist")

            if novo_status in ["Aprovado", "Aprovado com ajuste"]:
                atividade.aprovar(aprovado_por=request.user, horas_concedidas=horas_concedidas)
            elif novo_status == "Indeferido":
                atividade.indeferir(indeferido_por=request.user, justificativa=justificativa)
            elif novo_status == "Complementação solicitada":
                atividade.solicitar_complementacao(solicitado_por=request.user, checklist=checklist)

            LogAuditoria.objects.create(
                usuario=request.user,
                acao=f"Decisão: {novo_status}",
                antes=atividade.status,
                depois=novo_status
            )
            return Response({"success": "Decisão aplicada"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["patch"], url_path="reclassificar")
    def reclassificar(self, request, pk=None):
        atividade = self.get_object()
        nova_categoria_id = request.data.get("categoria")
        if nova_categoria_id:
            try:
                nova_categoria = Categoria.objects.get(pk=nova_categoria_id)
                antes = str(atividade.categoria)
                atividade.categoria = nova_categoria
                atividade.save()
                LogAuditoria.objects.create(
                    usuario=request.user,
                    acao="Reclassificação",
                    antes=antes,
                    depois=str(nova_categoria)
                )
                return Response({"success": "Categoria reclassificada"})
            except Categoria.DoesNotExist:
                return Response({"error": "Categoria não encontrada"}, status=status.HTTP_4404_NOT_FOUND)
        return Response({"error": "Categoria requerida"}, status=status.HTTP_400_BAD_REQUEST)


class NotificacaoViewSet(viewsets.ModelViewSet):
    queryset = Notificacao.objects.all()
    serializer_class = NotificacaoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notificacao.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=False, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def marcar_todas_como_lidas(self, request):
        count = Notificacao.objects.filter(usuario=request.user, lida=False).update(lida=True)
        return Response({"mensagem": f"{count} notificações marcadas como lidas."})

    @action(detail=True, methods=["patch"], url_path="marcar-lida")
    def marcar_lida(self, request, pk=None):
        notificacao = self.get_object()
        notificacao.marcar_como_lida()
        return Response({"success": "Notificação marcada como lida"})