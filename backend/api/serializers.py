from rest_framework import serializers
from .models import AuthUsuario, Categoria, TipoCambio, Gasto, Ingreso, Suscripcion

# USUARIO 
class AuthUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthUsuario
        fields = '__all__'


#  CATEGORIA 
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


# TIPO CAMBIO 
class TipoCambioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoCambio
        fields = '__all__'


#GASTOS
class GastoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gasto
        fields = '__all__'


    def create(self, validated_data):
        return Gasto.objects.create(**validated_data)


#  INGRESOS
class IngresoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingreso
        fields = '__all__'

    def create(self, validated_data):
        return Ingreso.objects.create(**validated_data)


# SUSCRIPCIONES 
class SuscripcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suscripcion
        fields = '__all__'

    def create(self, validated_data):
        return Suscripcion.objects.create(**validated_data)
