from django.urls import path
from .views import (
    # --- Autenticación ---
    CustomTokenView,
    LoginView,
    UsuarioActualAPIView,

    # --- Usuarios ---
    AuthUsuarioView,
    AuthUsuarioDetailView,

    # --- Categorías ---
    CategoriaView,
    CategoriaDetailView,

    # --- Ingresos ---
    IngresoView,
    IngresoDetailView,
    IngresoRestoreView,
    IngresoForceDeleteView,

    # --- Gastos ---
    GastoView,
    GastoDetailView,
    GastoRestoreView,
    GastoForceDeleteView,

    # --- Suscripciones ---
    SuscripcionView,
    SuscripcionDetailView,
    SuscripcionRestoreView,
    SuscripcionForceDeleteView,

    # --- Tipo de cambio ---
    TipoCambioView,
    TipoCambioDetailView,
)

urlpatterns = [
    # =========================
    # AUTENTICACIÓN
    # =========================
    path("token/", CustomTokenView.as_view(), name="token_personalizado"),
    path("login/", LoginView.as_view(), name="login"),
    path("usuarios/me/", UsuarioActualAPIView.as_view(), name="usuario_actual"),

    # =========================
    # USUARIOS
    # =========================
    path("usuarios/", AuthUsuarioView.as_view(), name="usuarios_lista"),
    path("usuarios/<int:pk>/", AuthUsuarioDetailView.as_view(), name="usuarios_detalle"),

    # =========================
    # CATEGORÍAS
    # =========================
    path("categorias/", CategoriaView.as_view(), name="categorias_lista"),
    path("categorias/<int:pk>/", CategoriaDetailView.as_view(), name="categorias_detalle"),

    # =========================
    # INGRESOS
    # =========================
    path("ingresos/", IngresoView.as_view(), name="ingresos_lista"),
    path("ingresos/<int:pk>/", IngresoDetailView.as_view(), name="ingresos_detalle"),

    # 🔁 Ingresos – Soft delete avanzado
    path("ingresos/<int:pk>/restore/", IngresoRestoreView.as_view(), name="ingresos_restore"),
    path("ingresos/<int:pk>/force/", IngresoForceDeleteView.as_view(), name="ingresos_force_delete"),

    # =========================
    # GASTOS
    # =========================
    path("gastos/", GastoView.as_view(), name="gastos_lista"),
    path("gastos/<int:pk>/", GastoDetailView.as_view(), name="gastos_detalle"),

    # 🔁 Gastos – Soft delete avanzado
    path("gastos/<int:pk>/restore/", GastoRestoreView.as_view(), name="gastos_restore"),
    path("gastos/<int:pk>/force/", GastoForceDeleteView.as_view(), name="gastos_force_delete"),

    # =========================
    # SUSCRIPCIONES
    # =========================
    path("suscripciones/", SuscripcionView.as_view(), name="suscripciones_lista"),
    path("suscripciones/<int:pk>/", SuscripcionDetailView.as_view(), name="suscripciones_detalle"),

    # 🔁 Suscripciones – Soft delete avanzado
    path("suscripciones/<int:pk>/restore/", SuscripcionRestoreView.as_view(), name="suscripciones_restore"),
    path("suscripciones/<int:pk>/force/", SuscripcionForceDeleteView.as_view(), name="suscripciones_force_delete"),

    # =========================
    # TIPO DE CAMBIO
    # =========================
    path("tipocambio/", TipoCambioView.as_view(), name="tipocambio_lista"),
    path("tipocambio/<int:pk>/", TipoCambioDetailView.as_view(), name="tipocambio_detalle"),
]
