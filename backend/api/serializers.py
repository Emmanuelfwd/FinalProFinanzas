from rest_framework import serializers
from .models import AuthUsuario, Categoria, TipoCambio, Gasto, Ingreso, Suscripcion

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
    id_usuario = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Gasto
        fields = '__all__'


class IngresoSerializer(serializers.ModelSerializer):
    id_usuario = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Ingreso
        fields = '__all__'


class SuscripcionSerializer(serializers.ModelSerializer):
    id_usuario = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Suscripcion
        fields = '__all__'
