# api/urls.py
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
    UsuarioActualAPIView
)

urlpatterns = [
    # LOGIN USANDO SIMPLEJWT PERSONALIZADO
    path("token/", CustomTokenView.as_view(), name="token_personalizado"),

    # Si usas tu login propio (opcional)
    path("login/", LoginView.as_view()),

    # USUARIO ACTUAL
    path("usuarios/me/", UsuarioActualAPIView.as_view()),

    # CRUD
    path("usuarios/", AuthUsuarioView.as_view()),
    path("usuarios/<int:pk>/", AuthUsuarioDetailView.as_view()),

    path("categorias/", CategoriaView.as_view()),
    path("categorias/<int:pk>/", CategoriaDetailView.as_view()),

    path("ingresos/", IngresoView.as_view()),
    path("ingresos/<int:pk>/", IngresoDetailView.as_view()),

    path("gastos/", GastoView.as_view()),
    path("gastos/<int:pk>/", GastoDetailView.as_view()),

    path("suscripciones/", SuscripcionView.as_view()),
    path("suscripciones/<int:pk>/", SuscripcionDetailView.as_view()),

    path("tipocambio/", TipoCambioView.as_view()),
]
