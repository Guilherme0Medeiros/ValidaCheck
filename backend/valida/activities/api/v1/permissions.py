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
        return obj.enviado_por == request.user

class IsStudent(permissions.BasePermission):
    """
    Permite acesso apenas para usuários com papel de aluno.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'
    
class IsSecretary(permissions.BasePermission):
    """
    Permite acesso apenas para usuários com papel de secretário(a).
    """

    def has_permission(self, request, view):
        return request.user.id_authenticated and request.user.role == 'secretary'