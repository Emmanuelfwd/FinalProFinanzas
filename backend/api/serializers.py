from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import AuthUsuario, Categoria, TipoCambio, Gasto, Ingreso, Suscripcion


def _parece_hash_django(valor: str) -> bool:
    """
    Heurística simple para no doble-hashear si ya viene hasheado.
    Django típicamente usa formatos tipo:
    - pbkdf2_sha256$...
    - argon2$...
    - bcrypt$...
    """
    if not isinstance(valor, str):
        return False
    return (
        valor.startswith("pbkdf2_")
        or valor.startswith("argon2$")
        or valor.startswith("bcrypt$")
        or valor.startswith("scrypt$")
    )


# USUARIO
class AuthUsuarioSerializer(serializers.ModelSerializer):
    """
    - NO expone contrasenha_hash (write_only).
    - Acepta:
        * password (como envía tu Register.jsx actual)
        * o contrasenha_hash (compatibilidad)
    - Hashea automáticamente cuando llega en texto plano.
    """
    password = serializers.CharField(write_only=True, required=False, min_length=4, max_length=128)

    class Meta:
        model = AuthUsuario
        fields = [
            "id_usuario",
            "nombre",
            "correo",
            "password",
            "contrasenha_hash",
            "is_admin",
            "fecha_registro",
        ]
        extra_kwargs = {
            "contrasenha_hash": {"write_only": True, "required": False},
            "fecha_registro": {"read_only": True},
            "is_admin": {"required": False},
        }

    def create(self, validated_data):
        # Aceptar password (frontend) o contrasenha_hash (compatibilidad)
        raw_password = validated_data.pop("password", None)
        raw_hash_field = validated_data.get("contrasenha_hash")

        raw = raw_password or raw_hash_field

        if raw:
            if not _parece_hash_django(raw):
                validated_data["contrasenha_hash"] = make_password(raw)
            else:
                validated_data["contrasenha_hash"] = raw

        # seguridad: no permitir crear admin desde /usuarios/
        validated_data["is_admin"] = False

        return super().create(validated_data)

    def update(self, instance, validated_data):
        raw_password = validated_data.pop("password", None)
        raw_hash_field = validated_data.get("contrasenha_hash")

        raw = raw_password or raw_hash_field

        if raw:
            if not _parece_hash_django(raw):
                validated_data["contrasenha_hash"] = make_password(raw)
            else:
                validated_data["contrasenha_hash"] = raw

        # No permitimos elevar a admin desde endpoints generales
        if "is_admin" in validated_data:
            validated_data.pop("is_admin", None)

        return super().update(instance, validated_data)


class AuthUsuarioAdminListSerializer(serializers.ModelSerializer):
    """
    Serializer para listados ADMIN:
    - NO incluye contrasenha_hash
    """
    class Meta:
        model = AuthUsuario
        fields = ["id_usuario", "nombre", "correo", "is_admin", "fecha_registro"]


class PasswordChangeSerializer(serializers.Serializer):
    """
    Para cambio de contraseña por admin (y sin exponer nada).
    """
    password = serializers.CharField(write_only=True, min_length=4, max_length=128)

    def validate_password(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("La contraseña no puede venir vacía.")
        return value


class AdminCreateSerializer(serializers.Serializer):
    """
    Crear un nuevo admin.
    """
    nombre = serializers.CharField(max_length=100)
    correo = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=4, max_length=128)


# CATEGORIA
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = "__all__"


# TIPO CAMBIO
class TipoCambioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoCambio
        fields = "__all__"


# GASTOS
class GastoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gasto
        fields = "__all__"
        read_only_fields = ["id_usuario"]


# INGRESOS
class IngresoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingreso
        fields = "__all__"
        read_only_fields = ["id_usuario"]


# SUSCRIPCIONES
class SuscripcionSerializer(serializers.ModelSerializer):
    moneda_nombre = serializers.CharField(
        source="id_moneda.nombre_moneda",
        read_only=True,
    )

    class Meta:
        model = Suscripcion
        fields = "__all__"
        read_only_fields = ["id_usuario"]
