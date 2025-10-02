import pytest
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_activity_default_status_is_sent():
    from activities.models import Activity
    student = User.objects.create_user(username="s1", password="123")

    activity = Activity.objects.create(
        title="Congresso",
        hours_requested=20,
        submitted_by=student
    )
    assert activity.status == Activity.Status.SENT  

@pytest.mark.django_db
def test_validator_can_approve_with_adjustment():
    from activities.models import Activity
    validator = User.objects.create_user(username="coord", password="123", is_staff=True)
    student = User.objects.create_user(username="s1", password="123")

    activity = Activity.objects.create(
        title="Extensão",
        hours_requested=20,
        submitted_by=student,
        status=Activity.Status.UNDER_REVIEW 
    )

    # Método para a regra de aprovação
    activity.approve(approved_by=validator, hours_granted=10)

    assert activity.status == Activity.Status.APPROVED_ADJUSTED
    assert activity.hours_granted == 10
   
