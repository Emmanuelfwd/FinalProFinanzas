from django.urls import path

from .views import (
    LoginView,
    UsuarioActualAPIView,

    AuthUsuarioView,
    AuthUsuarioDetailView,
    AdminUsuarioPasswordUpdateAPIView,
    AdminCrearAdminAPIView,

    CategoriaView,
    CategoriaDetailView,

    TipoCambioView,
    TipoCambioDetailView,

    GastoView,
    IngresoView,
    SuscripcionView,
)

urlpatterns = [
    # AUTH
    path("login/", LoginView.as_view()),
    path("usuarios/me/", UsuarioActualAPIView.as_view()),

    # USUARIOS 
    path("admin/usuarios/", AuthUsuarioView.as_view()),
    path("admin/usuarios/<int:pk>/", AuthUsuarioDetailView.as_view()),
    path("admin/usuarios/<int:pk>/password/", AdminUsuarioPasswordUpdateAPIView.as_view()),
    path("admin/crear-admin/", AdminCrearAdminAPIView.as_view()),

    # USUARIOS 
    path("usuarios/", AuthUsuarioView.as_view()),

    # CATEGORÍAS
    path("categorias/", CategoriaView.as_view()),
    path("categorias/<int:pk>/", CategoriaDetailView.as_view()),

    # TIPO DE CAMBIO
    path("tipocambio/", TipoCambioView.as_view()),
    path("tipocambio/<int:pk>/", TipoCambioDetailView.as_view()),

    # MOVIMIENTOS
    path("gastos/", GastoView.as_view()),
    path("ingresos/", IngresoView.as_view()),
    path("suscripciones/", SuscripcionView.as_view()),
]
