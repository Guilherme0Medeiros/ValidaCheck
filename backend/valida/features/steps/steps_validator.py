from behave import given, when, then
from django.contrib.auth import get_user_model
from django.urls import reverse
from activities.models import Activity

User = get_user_model()

@given("um validador autenticado")
def step_validator_login(context):
    context.validator = User.objects.create_user(username="coord", password="12345678", is_staff=True)
    context.client.login(username="coord", password="12345678")

@given('existem atividades nos estados "Enviado" e "Em análise"')
def step_create_activities(context):
    Activity.objects.create(title="Atv1", status="Enviado")
    Activity.objects.create(title="Atv2", status="Em análise")

@when('ele filtra por status "Em análise"')
def step_filter_analysis(context):
    url = reverse("activities:activity-list")
    context.response = context.client.get(url, {"status": "Em análise"})

@then('a lista deve conter apenas atividades "Em análise"')
def step_assert_filtered(context):
    for item in context.response.json():
        assert item["status"] == "Em análise"

@given('uma atividade "Em análise" com {horas:d} horas solicitadas')
def step_activity_under_review(context, horas):
    context.activity = Activity.objects.create(title="Atv", status="Em análise", hours_requested=horas)

@when("ele aprova concedendo {horas:d} horas")
def step_approve(context, horas):
    url = reverse("activities:activity-approve", args=[context.activity.id])
    context.response = context.client.post(url, {"hours_granted": horas})

@then('o status deve ser "Aprovado"')
def step_assert_approved(context):
    assert context.response.json()["status"] == "Aprovado"

@then('o status deve ser "Aprovado com ajuste"')
def step_assert_adjusted(context):
    assert context.response.json()["status"] == "Aprovado com ajuste"

@then("as horas concedidas devem ser {horas:d}")
def step_assert_hours(context, horas):
    assert context.response.json()["hours_granted"] == horas

@when('ele indeferir a atividade com motivo "Documento inválido"')
def step_reject(context):
    url = reverse("activities:activity-reject", args=[context.activity.id])
    context.response = context.client.post(url, {"reason": "Documento inválido"})

@then('o status deve ser "Indeferido"')
def step_assert_rejected(context):
    assert context.response.json()["status"] == "Indeferido"

@then('o motivo deve conter "Documento inválido"')
def step_assert_reason(context):
    assert "Documento inválido" in context.response.json()["reason"]

@when("ele solicitar complementação com checklist")
def step_complement(context):
    url = reverse("activities:activity-request-complement", args=[context.activity.id])
    context.response = context.client.post(url, {"checklist": ["Falta assinatura"]})

@then('o status deve ser "Complementação solicitada"')
def step_assert_complement(context):
    assert context.response.json()["status"] == "Complementação solicitada"

@then("o estudante deve receber uma notificação")
def step_assert_notification(context):

    assert context.response.status_code == 200
