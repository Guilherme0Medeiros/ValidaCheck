from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permite acesso ao dono da atividade, um staff/admin, ou um secretário.
    """

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        
        # Admins (staff) ou Secretários podem ver tudo
        if request.user.is_staff or request.user.role == 'secretary':
            return True

        # Usuário comum (aluno) só pode ver/editar suas próprias atividades
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
        # CORREÇÃO: "is_authenticated" em vez de "id_authenticated"
        return request.user.is_authenticated and request.user.role == 'secretary'

class IsStudentOrSecretary(permissions.BasePermission):
    """
    Permite acesso para Alunos ou Secretários.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role == 'student' or request.user.role == 'secretary'