from django.db import migrations


def create_initial_categories(apps, schema_editor):
    Categoria = apps.get_model('activities', 'Categoria')
    
    initial_categories = [
        {'nome': 'Pesquisa', 'limite_horas': 100, 'obrigatoriedade': False},
        {'nome': 'Extensão', 'limite_horas': 80, 'obrigatoriedade': True},
        {'nome': 'Monitoria', 'limite_horas': 60, 'obrigatoriedade': False},
        {'nome': 'Ensino', 'limite_horas': 120, 'obrigatoriedade': True},
        {'nome': 'Evento', 'limite_horas': 50, 'obrigatoriedade': False},
    ]
    
    for cat in initial_categories:
        Categoria.objects.get_or_create(nome=cat['nome'], defaults=cat)


class Migration(migrations.Migration):
    dependencies = [
        ('activities', '0005_configuracoesinstituicao_remove_atividade_documentos_and_more'),
    ]

    operations = [
        migrations.RunPython(create_initial_categories, reverse_code=migrations.RunPython.noop),
    ]