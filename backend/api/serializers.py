from rest_framework import serializers
from .models import *

class AuthUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthUsuario
        fields = '__all__'


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class TipoCambioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoCambio
        fields = '__all__'


class GastoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gasto
        fields = '__all__'


class IngresoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingreso
        fields = '__all__'


class SuscripcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suscripcion
        fields = '__all__'
