from rest_framework.permissions import BasePermission
from .models import AuthUsuario


class IsAuthenticatedAuthUsuario(BasePermission):
    """
    Considera autenticado si request.user es una instancia de AuthUsuario.
    """

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(user and isinstance(user, AuthUsuario))


class IsAdminAuthUsuario(BasePermission):
    """
    Autorización: solo admins (AuthUsuario.is_admin == True)
    """

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(user and isinstance(user, AuthUsuario) and getattr(user, "is_admin", False) is True)
