from django.urls import path
from .views import (
    CustomTokenView,
    LoginView,
    AuthUsuarioView,
    AuthUsuarioDetailView,
    CategoriaView,
    CategoriaDetailView,
    IngresoView,
    IngresoDetailView,
    GastoView,
    GastoDetailView,
    SuscripcionView,
    SuscripcionDetailView,
    TipoCambioView,
    TipoCambioDetailView,
    UsuarioActualAPIView,
)

urlpatterns = [
    # --- Autenticación ---
    # Token personalizado (SimpleJWT usando AuthUsuario)
    path("token/", CustomTokenView.as_view(), name="token_personalizado"),

    # Login propio con correo + contraseña
    path("login/", LoginView.as_view(), name="login"),

    # Usuario actual (a partir del JWT)
    path("usuarios/me/", UsuarioActualAPIView.as_view(), name="usuario_actual"),

    # --- Usuarios ---
    path("usuarios/", AuthUsuarioView.as_view(), name="usuarios_lista"),
    path("usuarios/<int:pk>/", AuthUsuarioDetailView.as_view(), name="usuarios_detalle"),

    # --- Categorías ---
    path("categorias/", CategoriaView.as_view(), name="categorias_lista"),
    path("categorias/<int:pk>/", CategoriaDetailView.as_view(), name="categorias_detalle"),

    # --- Ingresos ---
    path("ingresos/", IngresoView.as_view(), name="ingresos_lista"),
    path("ingresos/<int:pk>/", IngresoDetailView.as_view(), name="ingresos_detalle"),

    # --- Gastos ---
    path("gastos/", GastoView.as_view(), name="gastos_lista"),
    path("gastos/<int:pk>/", GastoDetailView.as_view(), name="gastos_detalle"),

    # --- Suscripciones ---
    path("suscripciones/", SuscripcionView.as_view(), name="suscripciones_lista"),
    path("suscripciones/<int:pk>/", SuscripcionDetailView.as_view(), name="suscripciones_detalle"),

    # --- Tipo de cambio ---
    path("tipocambio/", TipoCambioView.as_view(), name="tipocambio_lista"),
    path("tipocambio/<int:pk>/", TipoCambioDetailView.as_view(), name="tipocambio_detalle"),
]
