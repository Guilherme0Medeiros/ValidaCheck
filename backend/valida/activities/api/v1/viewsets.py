from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from activities.models import Categoria, Atividade, Notificacao
from activities.api.v1.serializers import (
    CategoriaSerializer,
    AtividadeSerializer,
    NotificacaoSerializer,
)
from activities.api.v1.permissions import IsOwnerOrAdmin
from activities.api.v1.filters import AtividadeFilter


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all().order_by("nome")
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class AtividadeViewSet(viewsets.ModelViewSet):
    queryset = Atividade.objects.all().order_by("-criado_em")
    serializer_class = AtividadeSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = AtividadeFilter
    search_fields = ["titulo", "descricao", "categoria", "status"]
    ordering_fields = ["criado_em", "data_inicio", "data_fim"]

    def perform_create(self, serializer):
        serializer.save(enviado_por=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Atividade.objects.none()
        if user.is_staff or getattr(user, "role", None) == "secretario":
            return Atividade.objects.all()
        return Atividade.objects.filter(enviado_por=user)

    @action(detail=True, methods=["post"], permission_classes=[IsOwnerOrAdmin])
    def aprovar(self, request, pk=None):
        atividade = self.get_object()
        horas_concedidas = request.data.get("horas_concedidas")
        atividade.aprovar(horas_concedidas=horas_concedidas)
        return Response({"status": "Aprovado"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[IsOwnerOrAdmin])
    def indeferir(self, request, pk=None):
        atividade = self.get_object()
        motivo = request.data.get("motivo")
        atividade.indeferir(justificativa=motivo)
        return Response({"status": "Indeferido"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[IsOwnerOrAdmin])
    def solicitar_complemento(self, request, pk=None):
        atividade = self.get_object()
        checklist = request.data.get("checklist")
        atividade.solicitar_complementacao(checklist=checklist)
        return Response({"status": "Complementação solicitada"}, status=status.HTTP_200_OK)


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
        Notificacao.objects.filter(usuario=request.user, lida=False).update(lida=True)
        return Response({"mensagem": "Todas as notificações foram marcadas como lidas."})
