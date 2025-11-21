from django.urls import path
from .views import *

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),

    path('usuarios/', AuthUsuarioView.as_view(), name='usuarios'),
    path('usuarios/<int:pk>/', AuthUsuarioDetailView.as_view()),

    path('categorias/', CategoriaView.as_view(), name='categorias'),
    path('categorias/<int:pk>/', CategoriaDetailView.as_view()),

    path('tipocambio/', TipoCambioView.as_view(), name='tipocambio'),
    path('tipocambio/<int:pk>/', TipoCambioDetailView.as_view()),

    path('gastos/', GastoView.as_view(), name='gastos'),
    path('gastos/<int:pk>/', GastoDetailView.as_view()),

    path('ingresos/', IngresoView.as_view(), name='ingresos'),
    path('ingresos/<int:pk>/', IngresoDetailView.as_view()),

    path('suscripciones/', SuscripcionView.as_view(), name='suscripciones'),
    path('suscripciones/<int:pk>/', SuscripcionDetailView.as_view()),
]
