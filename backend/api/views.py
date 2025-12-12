import datetime
import jwt
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password

from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .authentication import JWTAuthentication
from .models import AuthUsuario, Categoria, Gasto, Ingreso, Suscripcion, TipoCambio
from .serializers import (
    AuthUsuarioSerializer,
    CategoriaSerializer,
    GastoSerializer,
    IngresoSerializer,
    SuscripcionSerializer,
    TipoCambioSerializer
)

###########################################
#  SIMPLEJWT PERSONALIZADO PARA AuthUsuario
###########################################

class CustomTokenSerializer(TokenObtainPairSerializer):
    """Permite login usando correo en lugar de username."""

    def validate(self, attrs):
        correo = attrs.get("username")
        password = attrs.get("password")

        try:
            usuario = AuthUsuario.objects.get(correo=correo)
        except AuthUsuario.DoesNotExist:
            raise Exception("Credenciales inválidas")

        contrasenha_guardada = usuario.contrasenha_hash or ""

        valido = False
        try:
            valido = check_password(password, contrasenha_guardada)
        except Exception:
            valido = False

        if not valido and contrasenha_guardada == password:
            valido = True

        if not valido:
            raise Exception("Credenciales inválidas")

        refresh = RefreshToken.for_user(usuario)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "usuario": {
                "id_usuario": usuario.id_usuario,
                "nombre": usuario.nombre,
                "correo": usuario.correo,
                "fecha_registro": usuario.fecha_registro,
            }
        }


class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer


###########################################
# LOGIN (si usas tu endpoint /api/login/)
###########################################

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        correo = request.data.get("correo")
        password = request.data.get("password")

        if not correo or not password:
            return Response(
                {"detail": "Correo y contraseña requeridos."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Buscar usuario por correo
        try:
            usuario = AuthUsuario.objects.get(correo=correo)
        except AuthUsuario.DoesNotExist:
            return Response({"detail": "Credenciales inválidas."},
                            status=status.HTTP_401_UNAUTHORIZED)

        # Obtener contraseña guardada
        contrasenha_guardada = usuario.contrasenha_hash

        # Normalizar
        if contrasenha_guardada is None:
            contrasenha_guardada = ""

        # Validación:
        # 1. Si está hasheada -> check_password
        # 2. Si no -> comparar texto plano
        password_valida = False
        
        try:
            if check_password(password, contrasenha_guardada):
                password_valida = True
        except Exception:
            pass

        if not password_valida and contrasenha_guardada == password:
            password_valida = True

        if not password_valida:
            return Response({"detail": "Credenciales inválidas."},
                            status=status.HTTP_401_UNAUTHORIZED)

        # GENERAR JWT MANUALMENTE (independiente de Django User)
        payload = {
            "id_usuario": usuario.id_usuario,
            "correo": usuario.correo,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=12),
            "iat": datetime.datetime.utcnow(),
        }

        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

        return Response({
            "token": token,
            "usuario": {
                "id_usuario": usuario.id_usuario,
                "nombre": usuario.nombre,
                "correo": usuario.correo,
                "fecha_registro": usuario.fecha_registro
            }
        })

    permission_classes = [AllowAny]

    def post(self, request):
        correo = request.data.get("correo")
        password = request.data.get("password")

        if not correo or not password:
            return Response(
                {"detail": "Correo y contraseña requeridos."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            usuario = AuthUsuario.objects.get(correo=correo)
        except AuthUsuario.DoesNotExist:
            return Response({"detail": "Credenciales inválidas."},
                            status=status.HTTP_401_UNAUTHORIZED)

        contrasenha_guardada = usuario.contrasenha_hash or ""
        valido = False
        try:
            valido = check_password(password, contrasenha_guardada)
        except Exception:
            valido = False

        if not valido and contrasenha_guardada == password:
            valido = True

        if not valido:
            return Response({"detail": "Credenciales inválidas."},
                            status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(usuario)

        return Response({
            "token": str(refresh.access_token),
            "refresh": str(refresh),
            "usuario": AuthUsuarioSerializer(usuario).data
        })


###########################################
#  USUARIO ACTUAL
###########################################

class UsuarioActualAPIView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        serializer = AuthUsuarioSerializer(request.user)
        return Response(serializer.data)


###########################################
#  CRUD GENERAL
###########################################

class AuthUsuarioView(ListCreateAPIView):
    queryset = AuthUsuario.objects.all()
    serializer_class = AuthUsuarioSerializer


class AuthUsuarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = AuthUsuario.objects.all()
    serializer_class = AuthUsuarioSerializer


class CategoriaView(ListCreateAPIView):
    serializer_class = CategoriaSerializer

    def get_queryset(self):
        tipo = self.request.query_params.get("tipo")
        if tipo:
            return Categoria.objects.filter(tipo=tipo)
        return Categoria.objects.all()


class CategoriaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class TipoCambioView(ListCreateAPIView):
    queryset = TipoCambio.objects.all()
    serializer_class = TipoCambioSerializer


class TipoCambioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = TipoCambio.objects.all()
    serializer_class = TipoCambioSerializer


###############
# GASTOS
###############

class GastoView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    serializer_class = GastoSerializer

    def get_queryset(self):
        return Gasto.objects.filter(id_usuario=self.request.user.id_usuario)

    def perform_create(self, serializer):
        usuario = get_object_or_404(AuthUsuario, id_usuario=self.request.user.id_usuario)
        serializer.save(id_usuario=usuario)


class GastoDetailView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    serializer_class = GastoSerializer

    def get_queryset(self):
        return Gasto.objects.filter(id_usuario=self.request.user.id_usuario)


###############
# INGRESOS
###############

class IngresoView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    serializer_class = IngresoSerializer

    def get_queryset(self):
        return Ingreso.objects.filter(id_usuario=self.request.user.id_usuario)

    def perform_create(self, serializer):
        usuario = get_object_or_404(AuthUsuario, id_usuario=self.request.user.id_usuario)
        serializer.save(id_usuario=usuario)


class IngresoDetailView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    serializer_class = IngresoSerializer

    def get_queryset(self):
        return Ingreso.objects.filter(id_usuario=self.request.user.id_usuario)


###############
# SUSCRIPCIONES
###############

class SuscripcionView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    serializer_class = SuscripcionSerializer

    def get_queryset(self):
        return Suscripcion.objects.filter(id_usuario=self.request.user.id_usuario)

    def perform_create(self, serializer):
        usuario = get_object_or_404(AuthUsuario, id_usuario=self.request.user.id_usuario)
        serializer.save(id_usuario=usuario)


class SuscripcionDetailView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    serializer_class = SuscripcionSerializer

    def get_queryset(self):
        return Suscripcion.objects.filter(id_usuario=self.request.user.id_usuario)
