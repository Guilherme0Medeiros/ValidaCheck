from rest_framework.routers import DefaultRouter
from activities.api.v1.viewsets import CategoryViewSet, ActivityViewSet

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="categories")
router.register(r"activities", ActivityViewSet, basename="activities")

urlpatterns = router.urls
