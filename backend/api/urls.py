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
    GastoDetailView,
    GastoRestoreView,
    GastoForceDeleteView,

    IngresoView,
    IngresoDetailView,
    IngresoRestoreView,
    IngresoForceDeleteView,

    SuscripcionView,
    SuscripcionDetailView,
    SuscripcionRestoreView,
    SuscripcionForceDeleteView,
)

urlpatterns = [
    # AUTH
    path("login/", LoginView.as_view()),
    path("usuarios/me/", UsuarioActualAPIView.as_view()),

    # USUARIOS (ADMIN)
    path("admin/usuarios/", AuthUsuarioView.as_view()),
    path("admin/usuarios/<int:pk>/", AuthUsuarioDetailView.as_view()),
    path("admin/usuarios/<int:pk>/password/", AdminUsuarioPasswordUpdateAPIView.as_view()),
    path("admin/crear-admin/", AdminCrearAdminAPIView.as_view()),

    # USUARIOS (REGISTRO)
    path("usuarios/", AuthUsuarioView.as_view()),

    # CATEGORÍAS
    path("categorias/", CategoriaView.as_view()),
    path("categorias/<int:pk>/", CategoriaDetailView.as_view()),

    # TIPO DE CAMBIO
    path("tipocambio/", TipoCambioView.as_view()),
    path("tipocambio/<int:pk>/", TipoCambioDetailView.as_view()),

    # GASTOS
    path("gastos/", GastoView.as_view()),
    path("gastos/<int:pk>/", GastoDetailView.as_view()),
    path("gastos/<int:pk>/restore/", GastoRestoreView.as_view()),
    path("gastos/<int:pk>/force/", GastoForceDeleteView.as_view()),

    # INGRESOS
    path("ingresos/", IngresoView.as_view()),
    path("ingresos/<int:pk>/", IngresoDetailView.as_view()),
    path("ingresos/<int:pk>/restore/", IngresoRestoreView.as_view()),
    path("ingresos/<int:pk>/force/", IngresoForceDeleteView.as_view()),

    # SUSCRIPCIONES
    path("suscripciones/", SuscripcionView.as_view()),
    path("suscripciones/<int:pk>/", SuscripcionDetailView.as_view()),
    path("suscripciones/<int:pk>/restore/", SuscripcionRestoreView.as_view()),
    path("suscripciones/<int:pk>/force/", SuscripcionForceDeleteView.as_view()),
]
