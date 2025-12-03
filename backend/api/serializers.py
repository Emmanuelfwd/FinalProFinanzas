# backend/api/serializers.py
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


# GASTOS
class GastoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gasto
        fields = '__all__'
        read_only_fields = ['id_usuario']   # 👈 IMPORTANTE


# INGRESOS
class IngresoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingreso
        fields = '__all__'
        read_only_fields = ['id_usuario']   # 👈 IMPORTANTE


# SUSCRIPCIONES 
class SuscripcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suscripcion
        fields = '__all__'
        read_only_fields = ['id_usuario']   # 👈 IMPORTANTE
