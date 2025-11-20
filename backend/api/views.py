from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth.hashers import check_password
import datetime
import jwt
from django.conf import settings

from .models import *
from .serializers import *
from .authentication import JWTAuthentication
from .permissions import IsAuthenticatedAuthUsuario



class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get('correo') or request.data.get('username')
        password = request.data.get('password')

        if not identifier or not password:
            return Response({'detail': 'correo y password requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = AuthUsuario.objects.get(correo=identifier)
        except AuthUsuario.DoesNotExist:
            return Response({'detail': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

        stored = usuario.contrasenha_hash or ''

        valid = False
        try:
            valid = check_password(password, stored)
        except Exception:
            valid = False

        if not valid:
            if stored == password:
                valid = True

        if not valid:
            return Response({'detail': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

        exp = datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        payload = {
            'user_id': usuario.id_usuario,
            'exp': exp
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        return Response({
            'token': token,
            'usuario': {
                'id_usuario': usuario.id_usuario,
                'nombre': usuario.nombre,
                'correo': usuario.correo,
                'fecha_registro': usuario.fecha_registro
            }
        })


class AuthUsuarioView(ListCreateAPIView):
    queryset = AuthUsuario.objects.all()
    serializer_class = AuthUsuarioSerializer


class AuthUsuarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = AuthUsuario.objects.all()
    serializer_class = AuthUsuarioSerializer



class CategoriaView(ListCreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class CategoriaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class TipoCambioView(ListCreateAPIView):
    queryset = TipoCambio.objects.all()
    serializer_class = TipoCambioSerializer


class TipoCambioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = TipoCambio.objects.all()
    serializer_class = TipoCambioSerializer


class GastoView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = GastoSerializer

    def get_queryset(self):
        return Gasto.objects.filter(id_usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(id_usuario=self.request.user)


class GastoDetailView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = GastoSerializer

    def get_queryset(self):
        return Gasto.objects.filter(id_usuario=self.request.user)


class IngresoView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = IngresoSerializer

    def get_queryset(self):
        return Ingreso.objects.filter(id_usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(id_usuario=self.request.user)


class IngresoDetailView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = IngresoSerializer

    def get_queryset(self):
        return Ingreso.objects.filter(id_usuario=self.request.user)

class SuscripcionView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = SuscripcionSerializer

    def get_queryset(self):
        return Suscripcion.objects.filter(id_usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(id_usuario=self.request.user)


class SuscripcionDetailView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedAuthUsuario]
    serializer_class = SuscripcionSerializer

    def get_queryset(self):
        return Suscripcion.objects.filter(id_usuario=self.request.user)
