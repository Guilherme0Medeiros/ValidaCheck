from rest_framework.routers import DefaultRouter
from activities.api.v1.viewsets import CategoriaViewSet, AtividadeViewSet

router = DefaultRouter()
router.register(r"categorias", CategoriaViewSet, basename="categorias")
router.register(r"atividades", AtividadeViewSet, basename="atividades")

urlpatterns = router.urls
