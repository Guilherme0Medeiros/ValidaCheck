import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from activities.models import Activity

User = get_user_model()

@pytest.mark.django_db
def test_validator_can_filter_analysis_queue():
    validator = User.objects.create_user(username="coord", password="12345678", is_staff=True)
    client = APIClient()
    client.force_authenticate(validator)

    Activity.objects.create(title="Atividade 1", category="Extensão", status="Enviado")
    Activity.objects.create(title="Atividade 2", category="Pesquisa", status="Em análise")

    response = client.get("/api/activities/?status=Em análise")
    assert response.status_code == 200
    for item in response.data:
        assert item["status"] == "Em análise"


@pytest.mark.django_db
def test_validator_can_approve_without_adjustment():
    validator = User.objects.create_user(username="coord", password="12345678", is_staff=True)
    client = APIClient()
    client.force_authenticate(validator)

    activity = Activity.objects.create(title="Congresso", hours_requested=20, status="Em análise")

    response = client.post(f"/api/activities/{activity.id}/approve/", {"hours_granted": 20})
    assert response.status_code == 200
    assert response.data["status"] == "Aprovado"
    assert response.data["hours_granted"] == 20


@pytest.mark.django_db
def test_validator_can_approve_with_adjustment():
    validator = User.objects.create_user(username="coord", password="12345678", is_staff=True)
    client = APIClient()
    client.force_authenticate(validator)

    activity = Activity.objects.create(title="Projeto", hours_requested=20, status="Em análise")

    response = client.post(f"/api/activities/{activity.id}/approve/", {"hours_granted": 10})
    assert response.status_code == 200
    assert response.data["status"] == "Aprovado com ajuste"
    assert response.data["hours_granted"] == 10


@pytest.mark.django_db
def test_validator_can_reject_with_reason():
    validator = User.objects.create_user(username="coord", password="12345678", is_staff=True)
    client = APIClient()
    client.force_authenticate(validator)

    activity = Activity.objects.create(title="Evento", hours_requested=10, status="Em análise")

    response = client.post(f"/api/activities/{activity.id}/reject/", {"reason": "Documento inválido"})
    assert response.status_code == 200
    assert response.data["status"] == "Indeferido"
    assert "Documento inválido" in response.data["reason"]


@pytest.mark.django_db
def test_validator_can_request_complementation_with_checklist():
    validator = User.objects.create_user(username="coord", password="12345678", is_staff=True)
    client = APIClient()
    client.force_authenticate(validator)

    activity = Activity.objects.create(title="Oficina", hours_requested=15, status="Em análise")

    response = client.post(
        f"/api/activities/{activity.id}/request-complement/",
        {"checklist": ["Falta assinatura", "Data inconsistente"]}
    )
    assert response.status_code == 200
    assert response.data["status"] == "Complementação solicitada"
    assert "Falta assinatura" in response.data["checklist"]
