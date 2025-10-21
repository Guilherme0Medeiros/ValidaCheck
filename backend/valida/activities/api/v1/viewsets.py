from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from activities.models import Categoria, Atividade
from activities.api.v1.serializers import CategoriaSerializer, AtividadeSerializer
from activities.api.v1.permissions import IsOwnerOrAdmin
from activities.api.v1.filters import AtividadeFilter
from users.api.v1.serializers import CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    pass


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
    search_fields = ["titulo", "descricao", "categoria__nome", "status"]
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
        atividade.approve(hours_granted=horas_concedidas)
        return Response({"status": "Aprovado"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[IsOwnerOrAdmin])
    def indeferir(self, request, pk=None):
        atividade = self.get_object()
        motivo = request.data.get("motivo")
        atividade.reject(reason=motivo)
        return Response({"status": "Indeferido"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[IsOwnerOrAdmin])
    def solicitar_complemento(self, request, pk=None):
        atividade = self.get_object()
        checklist = request.data.get("checklist")
        atividade.request_complement(checklist=checklist)
        return Response({"status": "Complementação solicitada"}, status=status.HTTP_200_OK)
