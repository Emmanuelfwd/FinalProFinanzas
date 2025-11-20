
import jwt
from django.conf import settings
from rest_framework import authentication, exceptions
from .models import AuthUsuario

class JWTAuthentication(authentication.BaseAuthentication):
    """
    Autenticación basada en JWT usando la tabla AuthUsuario.
    Coloca la instancia AuthUsuario en request.user.
    """

    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).split()

        if not auth_header:
            return None

        if auth_header[0].lower() != b'bearer':
            return None

        if len(auth_header) == 1:
            raise exceptions.AuthenticationFailed('Token no proporcionado.')
        if len(auth_header) > 2:
            raise exceptions.AuthenticationFailed('Token con formato inválido.')

        token = auth_header[1]

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token expirado.')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Token inválido.')

        user_id = payload.get('user_id')

        if user_id is None:
            raise exceptions.AuthenticationFailed('Token sin user_id.')

        try:
            user = AuthUsuario.objects.get(id_usuario=user_id)
        except AuthUsuario.DoesNotExist:
            raise exceptions.AuthenticationFailed('Usuario no existe.')

        return (user, token)
