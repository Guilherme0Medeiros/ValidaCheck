from django.contrib import admin
from .models import Categoria, Atividade


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("nome", "limite_horas")
    search_fields = ("nome",)


@admin.register(Atividade)
class AtividadeAdmin(admin.ModelAdmin):
    list_display = ("titulo", "categoria", "status", "enviado_por", "criado_em")
    list_filter = ("status", "categoria")
    search_fields = ("titulo", "descricao", "categoria", "enviado_por__username")
