from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permite apenas o dono da atividade ou um staff/admin editar/aprovar.
    """

    def has_object_permission(self, request, view, obj):
        # Admins têm acesso total
        if request.user and request.user.is_staff:
            return True

        # Usuário comum só pode ver/editar suas próprias atividades
        return obj.submitted_by == request.user
