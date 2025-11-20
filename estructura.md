models.py
from django.db import models


# =======================
#  MODELO USUARIO
# =======================
class AuthUsuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)
    contrasenha_hash = models.CharField(max_length=255)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre


# =======================
#  MODELO CATEGORIA
# =======================
class Categoria(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre_categoria = models.CharField(max_length=100)
    tipo = models.CharField(
        max_length=50,
        choices=[
            ('GASTO', 'Gasto'),
            ('INGRESO', 'Ingreso'),
            ('AMBOS', 'Ambos')
        ]
    )

    def __str__(self):
        return self.nombre_categoria


# =======================
#  MODELO TIPO_CAMBIO
# =======================
class TipoCambio(models.Model):
    id_moneda = models.AutoField(primary_key=True)
    nombre_moneda = models.CharField(max_length=50)
    tasa_cambio = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre_moneda


# =======================
#  MODELO GASTOS
# =======================
class Gasto(models.Model):
    id_gasto = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(AuthUsuario, on_delete=models.CASCADE, related_name="gastos")
    id_categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)
    id_moneda = models.ForeignKey(TipoCambio, on_delete=models.SET_NULL, null=True)
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    fecha = models.DateField()
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.descripcion or 'Gasto'} - {self.monto}"


# =======================
#  MODELO INGRESOS
# =======================
class Ingreso(models.Model):
    id_ingreso = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(AuthUsuario, on_delete=models.CASCADE, related_name="ingresos")
    id_categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)
    id_moneda = models.ForeignKey(TipoCambio, on_delete=models.SET_NULL, null=True)
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    fecha = models.DateField()
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.descripcion or 'Ingreso'} - {self.monto}"


# =======================
#  MODELO SUSCRIPCIONES
# =======================
class Suscripcion(models.Model):
    id_suscripcion = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(AuthUsuario, on_delete=models.CASCADE, related_name="suscripciones")
    nombre_servicio = models.CharField(max_length=100)
    monto_mensual = models.DecimalField(max_digits=12, decimal_places=2)
    fecha_inicio = models.DateField()
    estado = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre_servicio
apps.py

from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

Serializers.py
from rest_framework import serializers
from .models import *

class AuthUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthUsuario
        fields = '__all__'


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class TipoCambioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoCambio
        fields = '__all__'


class GastoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gasto
        fields = '__all__'


class IngresoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingreso
        fields = '__all__'


class SuscripcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suscripcion
        fields = '__all__'

urls.py (dentro de api)
from django.urls import path
from .views import *

urlpatterns = [
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


views.py

from django.shortcuts import render

from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import *
from .serializers import *

# ====== USUARIO ======
class AuthUsuarioView(ListCreateAPIView):
    queryset = AuthUsuario.objects.all()
    serializer_class = AuthUsuarioSerializer

class AuthUsuarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = AuthUsuario.objects.all()
    serializer_class = AuthUsuarioSerializer


# ====== CATEGORIA ======
class CategoriaView(ListCreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class CategoriaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


# ====== TIPO CAMBIO ======
class TipoCambioView(ListCreateAPIView):
    queryset = TipoCambio.objects.all()
    serializer_class = TipoCambioSerializer

class TipoCambioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = TipoCambio.objects.all()
    serializer_class = TipoCambioSerializer


# ====== GASTOS ======
class GastoView(ListCreateAPIView):
    queryset = Gasto.objects.all()
    serializer_class = GastoSerializer

class GastoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Gasto.objects.all()
    serializer_class = GastoSerializer


# ====== INGRESOS ======
class IngresoView(ListCreateAPIView):
    queryset = Ingreso.objects.all()
    serializer_class = IngresoSerializer

class IngresoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Ingreso.objects.all()
    serializer_class = IngresoSerializer


# ====== SUSCRIPCIONES ======
class SuscripcionView(ListCreateAPIView):
    queryset = Suscripcion.objects.all()
    serializer_class = SuscripcionSerializer

class SuscripcionDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Suscripcion.objects.all()
    serializer_class = SuscripcionSerializer


settings.py (dentro de backend)
"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 5.2.7.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.2/ref/settings/
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-8j4hnd_8f_5-8%=^7#ob13%z!4@p==^m8bdgrnlrqzf=p7s6rx'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'api',

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'baseDatosFinanciera',
        'USER': 'root',         
        'PASSWORD': '26637053lolL',          
        'HOST': 'localhost',
        'PORT': '3306',
    }
}



# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

urls.py (dentro de backend)

"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
