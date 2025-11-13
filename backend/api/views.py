from django.shortcuts import render

from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import *
from .serializers import *

# ====== USUARIO ======
class AuthUsuarioView(ListCreateAPIView):
    queryset = AuthUsuario.objects.all()
    serializer_class = AuthUsuarioSerializer

class AuthUsuarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = AuthUsuario.objects.all()
    serializer_class = AuthUsuarioSerializer


# ====== CATEGORIA ======
class CategoriaView(ListCreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class CategoriaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


# ====== TIPO CAMBIO ======
class TipoCambioView(ListCreateAPIView):
    queryset = TipoCambio.objects.all()
    serializer_class = TipoCambioSerializer

class TipoCambioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = TipoCambio.objects.all()
    serializer_class = TipoCambioSerializer


# ====== GASTOS ======
class GastoView(ListCreateAPIView):
    queryset = Gasto.objects.all()
    serializer_class = GastoSerializer

class GastoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Gasto.objects.all()
    serializer_class = GastoSerializer


# ====== INGRESOS ======
class IngresoView(ListCreateAPIView):
    queryset = Ingreso.objects.all()
    serializer_class = IngresoSerializer

class IngresoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Ingreso.objects.all()
    serializer_class = IngresoSerializer


# ====== SUSCRIPCIONES ======
class SuscripcionView(ListCreateAPIView):
    queryset = Suscripcion.objects.all()
    serializer_class = SuscripcionSerializer

class SuscripcionDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Suscripcion.objects.all()
    serializer_class = SuscripcionSerializer

