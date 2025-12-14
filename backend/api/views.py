from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password, make_password

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    AuthUsuario,
    Categoria,
    TipoCambio,
    Gasto,
    Ingreso,
    Suscripcion,
)
from .serializers import (
    AuthUsuarioSerializer,
    AuthUsuarioAdminListSerializer,
    PasswordChangeSerializer,
    AdminCreateSerializer,
    CategoriaSerializer,
    TipoCambioSerializer,
    GastoSerializer,
    IngresoSerializer,
    SuscripcionSerializer,
)
from .permissions import IsAuthenticatedAuthUsuario, IsAdminAuthUsuario
from .authentication import JWTAuthentication


# LOGIN


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        correo = request.data.get("correo")
        password = request.data.get("password")

        if not correo or not password:
            return Response({"detail": "Datos incompletos"}, status=400)

        try:
            usuario = AuthUsuario.objects.get(correo=correo)
        except AuthUsuario.DoesNotExist:
            return Response({"detail": "Credenciales inválidas"}, status=401)

        valido = False
        try:
            valido = check_password(password, usuario.contrasenha_hash)
        except Exception:
            valido = False

        if not valido and usuario.contrasenha_hash == password:
            valido = True
            usuario.contrasenha_hash = make_password(password)
            usuario.save()

        if not valido:
            return Response({"detail": "Credenciales inválidas"}, status=401)

        refresh = RefreshToken.for_user(usuario)

        return Response({
            "token": str(refresh.access_token),
            "refresh": str(refresh),
            "usuario": {
                "id_usuario": usuario.id_usuario,
                "nombre": usuario.nombre,
                "correo": usuario.correo,
                "is_admin": usuario.is_admin,
                "fecha_registro": usuario.fecha_registro,
            }
        })



# USUARIO ACTUAL


class UsuarioActualAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]

    def get(self, request):
        serializer = AuthUsuarioAdminListSerializer(request.user)
        return Response(serializer.data)



# USUARIOS (ADMIN)


class AuthUsuarioView(ListCreateAPIView):
    queryset = AuthUsuario.objects.all()
    authentication_classes = [JWTAuthentication]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return AuthUsuarioAdminListSerializer
        return AuthUsuarioSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [AllowAny()]
        return [IsAdminAuthUsuario()]


class AuthUsuarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = AuthUsuario.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminAuthUsuario]
    serializer_class = AuthUsuarioSerializer


class AdminUsuarioPasswordUpdateAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminAuthUsuario]

    def put(self, request, pk):
        usuario = get_object_or_404(AuthUsuario, pk=pk)
        serializer = PasswordChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        usuario.contrasenha_hash = make_password(serializer.validated_data["password"])
        usuario.save()

        return Response({"detail": "Contraseña actualizada"})


class AdminCrearAdminAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminAuthUsuario]

    def post(self, request):
        serializer = AdminCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        if AuthUsuario.objects.filter(correo=data["correo"]).exists():
            return Response({"detail": "Correo ya existe"}, status=400)

        admin = AuthUsuario.objects.create(
            nombre=data["nombre"],
            correo=data["correo"],
            contrasenha_hash=make_password(data["password"]),
            is_admin=True,
        )

        return Response(AuthUsuarioAdminListSerializer(admin).data, status=201)


# CATEGORÍAS 

class CategoriaView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminAuthUsuario()]


class CategoriaDetailView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminAuthUsuario()]


# TIPO DE CAMBIO 


class TipoCambioView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    queryset = TipoCambio.objects.all()
    serializer_class = TipoCambioSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminAuthUsuario()]


class TipoCambioDetailView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    queryset = TipoCambio.objects.all()
    serializer_class = TipoCambioSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminAuthUsuario()]



# GASTOS / INGRESOS / SUSCRIPCIONES



class GastoView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = GastoSerializer

    def get_queryset(self):
        return Gasto.objects.filter(id_usuario=self.request.user.id_usuario, eliminado=False)

    def perform_create(self, serializer):
        serializer.save(id_usuario=self.request.user)


class IngresoView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = IngresoSerializer

    def get_queryset(self):
        return Ingreso.objects.filter(id_usuario=self.request.user.id_usuario, eliminado=False)

    def perform_create(self, serializer):
        serializer.save(id_usuario=self.request.user)


class SuscripcionView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = SuscripcionSerializer

    def get_queryset(self):
        return Suscripcion.objects.filter(id_usuario=self.request.user.id_usuario, eliminado=False)

    def perform_create(self, serializer):
        serializer.save(id_usuario=self.request.user)
