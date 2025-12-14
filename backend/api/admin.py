from django.contrib import admin
from .models import AuthUsuario, Categoria, TipoCambio, Gasto, Ingreso, Suscripcion


@admin.register(AuthUsuario)
class AuthUsuarioAdmin(admin.ModelAdmin):
    list_display = ("id_usuario", "nombre", "correo", "is_admin", "fecha_registro")
    list_filter = ("is_admin",)
    search_fields = ("nombre", "correo")
    ordering = ("-fecha_registro",)


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("id_categoria", "nombre_categoria", "tipo")
    list_filter = ("tipo",)
    search_fields = ("nombre_categoria",)


@admin.register(TipoCambio)
class TipoCambioAdmin(admin.ModelAdmin):
    list_display = ("id_moneda", "nombre_moneda", "tasa_cambio", "fecha_actualizacion")
    search_fields = ("nombre_moneda",)
    ordering = ("-fecha_actualizacion",)


@admin.register(Gasto)
class GastoAdmin(admin.ModelAdmin):
    list_display = ("id_gasto", "id_usuario", "id_categoria", "id_moneda", "monto", "fecha", "eliminado")
    list_filter = ("eliminado", "fecha")
    search_fields = ("descripcion", "id_usuario__correo")
    ordering = ("-fecha",)


@admin.register(Ingreso)
class IngresoAdmin(admin.ModelAdmin):
    list_display = ("id_ingreso", "id_usuario", "id_categoria", "id_moneda", "monto", "fecha", "eliminado")
    list_filter = ("eliminado", "fecha")
    search_fields = ("descripcion", "id_usuario__correo")
    ordering = ("-fecha",)


@admin.register(Suscripcion)
class SuscripcionAdmin(admin.ModelAdmin):
    list_display = ("id_suscripcion", "id_usuario", "nombre_servicio", "id_moneda", "monto_mensual", "fecha_inicio", "estado", "eliminado")
    list_filter = ("estado", "eliminado")
    search_fields = ("nombre_servicio", "id_usuario__correo")
    ordering = ("-fecha_inicio",)
