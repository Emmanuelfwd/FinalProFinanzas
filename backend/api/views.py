# backend/api/views.py
import datetime
import jwt

from django.conf import settings
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import BasePermission, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password

from .authentication import JWTAuthentication
from .models import (
    AuthUsuario,
    Categoria,
    Gasto,
    Ingreso,
    Suscripcion,
    TipoCambio,
)
from .serializers import (
    AuthUsuarioSerializer,
    CategoriaSerializer,
    GastoSerializer,
    IngresoSerializer,
    SuscripcionSerializer,
    TipoCambioSerializer,
)


# -------------------------
#  PERMISO PERSONALIZADO
# -------------------------

class IsAuthenticatedAuthUsuario(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and getattr(request.user, "is_authenticated", False))


# -------------------------
#  LOGIN
# -------------------------

class LoginView(APIView):
    """
    Endpoint de login manual con JWT.

    Entrada JSON:
        {
            "correo": "test@test.com",
            "password": "12345"
        }

    Respuesta exitosa:
        {
            "token": "<jwt>",
            "usuario": {
                "id_usuario": ...,
                "nombre": "...",
                "correo": "...",
                "fecha_registro": "..."
            }
        }
    """

    permission_classes = [AllowAny]

    def post(self, request):
        correo = request.data.get("correo")
        password = request.data.get("password")

        if not correo or not password:
            return Response(
                {"detail": "Correo y contraseña son requeridos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            usuario = AuthUsuario.objects.get(correo=correo)
        except AuthUsuario.DoesNotExist:
            return Response(
                {"detail": "Credenciales inválidas."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        contrasenha_guardada = usuario.contrasenha_hash or ""

        # 1) Intentar verificar como hash
        valido = False
        try:
            valido = check_password(password, contrasenha_guardada)
        except Exception:
            valido = False

        # 2) Si no es hash, comparar directo por si guardaste el texto plano
        if not valido and contrasenha_guardada == password:
            valido = True

        if not valido:
            return Response(
                {"detail": "Credenciales inválidas."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Crear token JWT válido 2 horas
        expiracion = datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        payload = {
            "user_id": usuario.id_usuario,
            "exp": expiracion,
        }

        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

        return Response(
            {
                "token": token,
                "usuario": {
                    "id_usuario": usuario.id_usuario,
                    "nombre": usuario.nombre,
                    "correo": usuario.correo,
                    "fecha_registro": usuario.fecha_registro,
                },
            }
        )


# -------------------------
#  USUARIOS
# -------------------------

class AuthUsuarioView(ListCreateAPIView):
    queryset = AuthUsuario.objects.all()
    serializer_class = AuthUsuarioSerializer
    permission_classes = [AllowAny]


class AuthUsuarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = AuthUsuario.objects.all()
    serializer_class = AuthUsuarioSerializer
    permission_classes = [AllowAny]


# -------------------------
#  CATEGORÍAS
# -------------------------

class CategoriaView(ListCreateAPIView):
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """
        Soporta filtro por tipo:
            /api/categorias/?tipo=INGRESO
            /api/categorias/?tipo=GASTO
        """
        tipo = self.request.query_params.get("tipo")
        if tipo:
            return Categoria.objects.filter(tipo=tipo)
        return Categoria.objects.all()


class CategoriaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]


# -------------------------
#  TIPO DE CAMBIO
# -------------------------

class TipoCambioView(ListCreateAPIView):
    queryset = TipoCambio.objects.all()
    serializer_class = TipoCambioSerializer
    permission_classes = [AllowAny]


class TipoCambioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = TipoCambio.objects.all()
    serializer_class = TipoCambioSerializer
    permission_classes = [AllowAny]


# -------------------------
#  GASTOS
# -------------------------

class GastoView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = GastoSerializer

    def get_queryset(self):
        # Filtrar por usuario logueado
        return Gasto.objects.filter(id_usuario=self.request.user.id_usuario)

    def perform_create(self, serializer):
        usuario = get_object_or_404(
            AuthUsuario, id_usuario=self.request.user.id_usuario
        )
        serializer.save(id_usuario=usuario)


class GastoDetailView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = GastoSerializer

    def get_queryset(self):
        return Gasto.objects.filter(id_usuario=self.request.user.id_usuario)


# -------------------------
#  INGRESOS
# -------------------------

class IngresoView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = IngresoSerializer

    def get_queryset(self):
        return Ingreso.objects.filter(id_usuario=self.request.user.id_usuario)

    def perform_create(self, serializer):
        usuario = get_object_or_404(
            AuthUsuario, id_usuario=self.request.user.id_usuario
        )
        serializer.save(id_usuario=usuario)


class IngresoDetailView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = IngresoSerializer

    def get_queryset(self):
        return Ingreso.objects.filter(id_usuario=self.request.user.id_usuario)


# -------------------------
#  SUSCRIPCIONES
# -------------------------

class SuscripcionView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = SuscripcionSerializer

    def get_queryset(self):
        return Suscripcion.objects.filter(id_usuario=self.request.user.id_usuario)

    def perform_create(self, serializer):
        usuario = get_object_or_404(
            AuthUsuario, id_usuario=self.request.user.id_usuario
        )
        serializer.save(id_usuario=usuario)


class SuscripcionDetailView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = SuscripcionSerializer

    def get_queryset(self):
        return Suscripcion.objects.filter(id_usuario=self.request.user.id_usuario)
