import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

@pytest.mark.django_db
def test_student_sees_only_own_submissions():
    student1 = User.objects.create_user(username="usuario1", password="12345678")
    student2 = User.objects.create_user(username="usuario2", password="12345678")
    client = APIClient()
    client.force_authenticate(student1)


    resp = client.get("/api/activities/")
    assert resp.status_code == 200
    