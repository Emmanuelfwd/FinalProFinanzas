
import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions

from .models import AuthUsuario


class JWTAuthentication(BaseAuthentication):
    """
    Autenticación sencilla con JWT usando AuthUsuario.
    Espera el header:
        Authorization: Bearer <token>
    """

    def authenticate(self, request):
        authorization_header = request.headers.get("Authorization")

        if not authorization_header:
            return None

        parts = authorization_header.split()

        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise exceptions.AuthenticationFailed("Formato de autorización inválido.")

        token = parts[1]

        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=["HS256"]
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("El token ha expirado.")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Token inválido.")

        user_id = payload.get("user_id")

        if not user_id:
            raise exceptions.AuthenticationFailed("Token sin user_id.")

        try:
            usuario = AuthUsuario.objects.get(id_usuario=user_id)
        except AuthUsuario.DoesNotExist:
            raise exceptions.AuthenticationFailed("Usuario no encontrado.")

        # Para que IsAuthenticatedAuthUsuario funcione
        usuario.is_authenticated = True

        return (usuario, None)
