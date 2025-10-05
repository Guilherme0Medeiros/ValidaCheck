from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from activities.models import Category, Activity
from activities.api.v1.serializers import CategorySerializer, ActivitySerializer
from activities.api.v1.permissions import IsOwnerOrAdmin
from activities.api.v1.filters import ActivityFilter


class CustomTokenObtainPairView(TokenObtainPairView):
    pass

class CustomTokenRefreshView(TokenRefreshView):
    pass


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all().order_by("-created_at")
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ActivityFilter
    search_fields = ["title", "description", "category", "status"]
    ordering_fields = ["created_at", "start_date", "end_date"]

    def perform_create(self, serializer):
        serializer.save(submitted_by=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Activity.objects.all()
        return Activity.objects.filter(submitted_by=user)

    @action(detail=True, methods=["post"], permission_classes=[IsOwnerOrAdmin])
    def approve(self, request, pk=None):
        activity = self.get_object()
        hours_granted = request.data.get("hours_granted")
        activity.approve(hours_granted=hours_granted)
        return Response({"status": "Aprovado"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[IsOwnerOrAdmin])
    def reject(self, request, pk=None):
        activity = self.get_object()
        reason = request.data.get("reason")
        activity.reject(reason=reason)
        return Response({"status": "Indeferido"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[IsOwnerOrAdmin])
    def request_complement(self, request, pk=None):
        activity = self.get_object()
        checklist = request.data.get("checklist")
        activity.request_complement(checklist=checklist)
        return Response({"status": "Complementação solicitada"}, status=status.HTTP_200_OK)
