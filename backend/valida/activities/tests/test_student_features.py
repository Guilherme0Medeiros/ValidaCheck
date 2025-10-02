import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

@pytest.mark.django_db
def test_student_can_submit_activity_with_all_required_fields():
    student = User.objects.create_user(username="aluno", password="12345678")
    client = APIClient()
    client.force_authenticate(student)

    data = {
        "title": "Participação em congresso",
        "category": "Extensão",
        "hours_requested": 20,
        "start_date": "2025-01-01",
        "end_date": "2025-01-05",
        "responsible_contact": "carlos@gmail.com",
        "documents": ["dummy.pdf"],  
    }

    response = client.post("/api/activities/", data, format="json")

    assert response.status_code == 201
    assert response.data["status"] == "Enviado"


@pytest.mark.django_db
def test_student_cannot_submit_without_document():
    student = User.objects.create_user(username="aluno", password="12345678")
    client = APIClient()
    client.force_authenticate(student)

    data = {
        "title": "Congresso sem documento",
        "category": "Extensão",
        "hours_requested": 20,
        "start_date": "2025-01-01",
        "end_date": "2025-01-05",
    }

    response = client.post("/api/activities/", data, format="json")

    assert response.status_code == 400
    assert "documento" in str(response.data).lower()


@pytest.mark.django_db
def test_student_can_track_activity_status_timeline():
    student = User.objects.create_user(username="aluno", password="12345678")
    client = APIClient()
    client.force_authenticate(student)

    
    from activities.models import Activity
    Activity.objects.create(title="Atividade 1", submitted_by=student, status="Enviado")
    Activity.objects.create(title="Atividade 2", submitted_by=student, status="Em análise")
    Activity.objects.create(title="Atividade 3", submitted_by=student, status="Aprovado")

    response = client.get("/api/activities/timeline/")

    assert response.status_code == 200
    statuses = [a["status"] for a in response.data]
    assert "Enviado" in statuses
    assert "Em análise" in statuses
    assert "Aprovado" in statuses
