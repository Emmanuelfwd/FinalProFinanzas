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


# USUARIOS (ADMIN + REGISTRO)
class AuthUsuarioView(ListCreateAPIView):
    queryset = AuthUsuario.objects.all()
    authentication_classes = [JWTAuthentication]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return AuthUsuarioAdminListSerializer
        return AuthUsuarioSerializer

    def get_permissions(self):
        # POST /api/usuarios/ => registro público
        if self.request.method == "POST":
            return [AllowAny()]
        # GET /api/admin/usuarios/ => solo admin
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


# Helpers
def _want_incluir_eliminados(request) -> bool:
    return str(request.query_params.get("incluir_eliminados", "")).strip() in ("1", "true", "True", "yes", "YES")


# GASTOS
class GastoView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = GastoSerializer

    def get_queryset(self):
        qs = Gasto.objects.filter(id_usuario=self.request.user.id_usuario)
        if not _want_incluir_eliminados(self.request):
            qs = qs.filter(eliminado=False)
        return qs

    def perform_create(self, serializer):
        serializer.save(id_usuario=self.request.user)


class GastoDetailView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = GastoSerializer

    def get_queryset(self):
        # Para editar/eliminar desde pantallas activas: no permitir operar sobre eliminados
        return Gasto.objects.filter(id_usuario=self.request.user.id_usuario, eliminado=False)

    def perform_destroy(self, instance):
        # Soft delete
        instance.eliminado = True
        instance.save(update_fields=["eliminado"])


class GastoRestoreView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]

    def patch(self, request, pk):
        gasto = get_object_or_404(Gasto, pk=pk, id_usuario=request.user.id_usuario)
        gasto.eliminado = False
        gasto.save(update_fields=["eliminado"])
        return Response({"detail": "Gasto restaurado"}, status=status.HTTP_200_OK)


class GastoForceDeleteView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]

    def delete(self, request, pk):
        gasto = get_object_or_404(Gasto, pk=pk, id_usuario=request.user.id_usuario)
        gasto.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# INGRESOS
class IngresoView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = IngresoSerializer

    def get_queryset(self):
        qs = Ingreso.objects.filter(id_usuario=self.request.user.id_usuario)
        if not _want_incluir_eliminados(self.request):
            qs = qs.filter(eliminado=False)
        return qs

    def perform_create(self, serializer):
        serializer.save(id_usuario=self.request.user)


class IngresoDetailView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = IngresoSerializer

    def get_queryset(self):
        return Ingreso.objects.filter(id_usuario=self.request.user.id_usuario, eliminado=False)

    def perform_destroy(self, instance):
        instance.eliminado = True
        instance.save(update_fields=["eliminado"])


class IngresoRestoreView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]

    def patch(self, request, pk):
        ingreso = get_object_or_404(Ingreso, pk=pk, id_usuario=request.user.id_usuario)
        ingreso.eliminado = False
        ingreso.save(update_fields=["eliminado"])
        return Response({"detail": "Ingreso restaurado"}, status=status.HTTP_200_OK)


class IngresoForceDeleteView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]

    def delete(self, request, pk):
        ingreso = get_object_or_404(Ingreso, pk=pk, id_usuario=request.user.id_usuario)
        ingreso.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# SUSCRIPCIONES
class SuscripcionView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = SuscripcionSerializer

    def get_queryset(self):
        qs = Suscripcion.objects.filter(id_usuario=self.request.user.id_usuario)
        if not _want_incluir_eliminados(self.request):
            qs = qs.filter(eliminado=False)
        return qs

    def perform_create(self, serializer):
        serializer.save(id_usuario=self.request.user)


class SuscripcionDetailView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = SuscripcionSerializer

    def get_queryset(self):
        return Suscripcion.objects.filter(id_usuario=self.request.user.id_usuario, eliminado=False)

    def perform_destroy(self, instance):
        instance.eliminado = True
        instance.save(update_fields=["eliminado"])


class SuscripcionRestoreView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]

    def patch(self, request, pk):
        sus = get_object_or_404(Suscripcion, pk=pk, id_usuario=request.user.id_usuario)
        sus.eliminado = False
        sus.save(update_fields=["eliminado"])
        return Response({"detail": "Suscripción restaurada"}, status=status.HTTP_200_OK)


class SuscripcionForceDeleteView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]

    def delete(self, request, pk):
        sus = get_object_or_404(Suscripcion, pk=pk, id_usuario=request.user.id_usuario)
        sus.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
