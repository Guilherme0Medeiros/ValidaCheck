from behave import given, when, then
from django.contrib.auth import get_user_model
from django.urls import reverse
from activities.models import Activity

User = get_user_model()

@given("um estudante autenticado")
def step_student_login(context):
    context.student = User.objects.create_user(username="aluno", password="1235678")
    context.client.login(username="aluno", password="12345678")

@when("ele submete uma atividade com todos os campos obrigatórios")
def step_submit_valid(context):
    url = reverse("activities:activity-list")
    data = {
        "title": "Congresso",
        "category": "Extensão",
        "hours_requested": 20,
        "documents": ["dummy.pdf"],
    }
    context.response = context.client.post(url, data)

@when("ele tenta submeter uma atividade sem documento")
def step_submit_invalid(context):
    url = reverse("activities:activity-list")
    data = {
        "title": "Congresso",
        "category": "Extensão",
        "hours_requested": 20,
    }
    context.response = context.client.post(url, data)

@then('a atividade deve ser criada com status "Enviado"')
def step_assert_sent(context):
    assert context.response.status_code == 201
    assert context.response.json()["status"] == "Enviado"

@then("a atividade não deve ser criada")
def step_assert_invalid(context):
    assert context.response.status_code == 400

@then('deve aparecer o erro "Documento obrigatório"')
def step_assert_doc_error(context):
    assert "documento" in str(context.response.content).lower()

@given("um estudante com atividades em diferentes estados")
def step_student_with_activities(context):
    Activity.objects.create(title="Atv1", submitted_by=context.student, status="Enviado")
    Activity.objects.create(title="Atv2", submitted_by=context.student, status="Em análise")
    Activity.objects.create(title="Atv3", submitted_by=context.student, status="Aprovado")

@when("ele consulta sua linha do tempo")
def step_timeline(context):
    url = reverse("activities:activity-timeline")
    context.response = context.client.get(url)

@then('ele deve ver os status "Enviado", "Em análise" e "Aprovado"')
def step_assert_timeline(context):
    statuses = [a["status"] for a in context.response.json()]
    assert all(s in statuses for s in ["Enviado", "Em análise", "Aprovado"])
